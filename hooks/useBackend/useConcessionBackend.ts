/**
 * Concession Backend Hook
 * Communication layer between frontend and backend concession functions
 * Used by ConcessionContext to manage concession data and operations
 */
import { useState } from 'react'
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

	return {
		loading,
		error,
		concession,
		getConcession: getConcession(setLoading, setError, setConcession),
		updateConcession: updateConcession(setLoading, setError, setConcession),
		toggleConcessionStatus: toggleConcessionStatus(
			setLoading,
			setError,
			setConcession
		),
	}
}
