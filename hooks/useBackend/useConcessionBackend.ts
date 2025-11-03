/**
 * Concession Backend Hook
 * Communication layer between frontend and backend concession functions
 * Used by ConcessionContext to manage concession data and operations
 */
import { useMemo, useState } from 'react'
import {
	getConcession,
	toggleConcessionStatus,
	updateConcession,
} from './useBackend_backend/concesssion'
import { ConcessionData } from '../../types'

export const useConcessionBackend = () => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [concession, setConcession] = useState<ConcessionData | null>(null)

	const getConcessionHandler = useMemo(
		() => getConcession(setLoading, setError, setConcession),
		[setLoading, setError, setConcession]
	)

	const updateConcessionHandler = useMemo(
		() => updateConcession(setLoading, setError, setConcession),
		[setLoading, setError, setConcession]
	)

	const toggleConcessionStatusHandler = useMemo(
		() => toggleConcessionStatus(setLoading, setError, setConcession),
		[setLoading, setError, setConcession]
	)

	return {
		loading,
		error,
		concession,
		getConcession: getConcessionHandler,
		updateConcession: updateConcessionHandler,
		toggleConcessionStatus: toggleConcessionStatusHandler,
	}
}
