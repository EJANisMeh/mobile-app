/**
 * Concession Context
 * Manages concession state and provides concession operations to the app
 * Uses useConcessionBackend hook for backend communication
 */
import React, { createContext, useContext, useState, useCallback } from 'react'
import { useConcessionBackend } from '../hooks/useBackend'
import {
	ConcessionContextType,
	ConcessionProviderProps,
	ConcessionData,
	UpdateConcessionData,
} from '../types'

const ConcessionContext = createContext<ConcessionContextType | undefined>(
	undefined
)

export const ConcessionProvider: React.FC<ConcessionProviderProps> = ({
	children,
}) => {
	const backend = useConcessionBackend()
	const [concession, setConcession] = useState<ConcessionData | null>(null)
	const [currentConcessionId, setCurrentConcessionId] = useState<number | null>(
		null
	)

	/**
	 * Get concession by ID and update context state
	 */
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

	/**
	 * Update concession details and refresh context state
	 */
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

	/**
	 * Toggle concession open/closed status
	 */
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

	/**
	 * Refresh current concession data
	 */
	const refreshConcession = useCallback(async () => {
		if (currentConcessionId) {
			await getConcession(currentConcessionId)
		}
	}, [currentConcessionId, getConcession])

	const value: ConcessionContextType = {
		concession,
		loading: backend.loading,
		error: backend.error,
		getConcession,
		updateConcession,
		toggleConcessionStatus,
		refreshConcession,
	}

	return (
		<ConcessionContext.Provider value={value}>
			{children}
		</ConcessionContext.Provider>
	)
}

/**
 * Hook to use ConcessionContext
 */
export const useConcession = (): ConcessionContextType => {
	const context = useContext(ConcessionContext)
	if (!context) {
		throw new Error('useConcession must be used within a ConcessionProvider')
	}
	return context
}
