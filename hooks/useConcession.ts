import { useState, useCallback } from 'react'
import { useConcessionBackend } from './useBackend'
import type { ConcessionData, UpdateConcessionData } from '../types'

export const useConcession = () => {
	const backend = useConcessionBackend()
	const [concession, setConcession] = useState<ConcessionData | null>(null)
	const [currentConcessionId, setCurrentConcessionId] = useState<number | null>(
		null
	)

	const getConcession = useCallback(
		async (concessionId: number): Promise<boolean> => {
			const result = await backend.getConcession(concessionId)

			if (result.success && result.concession) {
				setConcession(result.concession)
				setCurrentConcessionId(concessionId)
				return true
			}

			return false
		},
		[backend]
	)

	const updateConcession = useCallback(
		async (
			concessionId: number,
			data: UpdateConcessionData
		): Promise<boolean> => {
			const result = await backend.updateConcession(concessionId, data)

			if (result.success && result.concession) {
				setConcession(result.concession)
				return true
			}

			return false
		},
		[backend]
	)

	const toggleConcessionStatus = useCallback(
		async (concessionId: number, is_open: boolean): Promise<boolean> => {
			const result = await backend.toggleConcessionStatus(concessionId, is_open)

			if (result.success && result.concession) {
				setConcession(result.concession)
				return true
			}

			return false
		},
		[backend]
	)

	const refreshConcession = useCallback(async () => {
		if (currentConcessionId) {
			await getConcession(currentConcessionId)
		}
	}, [currentConcessionId, getConcession])

	return {
		concession,
		loading: backend.loading,
		error: backend.error,
		getConcession,
		updateConcession,
		toggleConcessionStatus,
		refreshConcession,
	}
}
