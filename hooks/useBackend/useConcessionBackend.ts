/**
 * Concession Backend Hook
 * Communication layer between frontend and backend concession functions
 * Used by ConcessionContext to manage concession data and operations
 */
import { useState } from 'react'
import { getConcession, toggleConcessionStatus, updateConcession } from './useBackend_backend/concesssion'

export const useConcessionBackend = () => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	return {
		loading,
		error,
		getConcession: getConcession(setLoading, setError),
		updateConcession: updateConcession(setLoading, setError),
		toggleConcessionStatus: toggleConcessionStatus(setLoading, setError),
	}
}
