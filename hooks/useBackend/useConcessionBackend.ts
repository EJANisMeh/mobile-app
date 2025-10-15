/**
 * Concession Backend Hook
 * Communication layer between frontend and backend concession functions
 * Used by ConcessionContext to manage concession data and operations
 */
import { useState } from 'react'
import { concessionApi } from '../../services/api'
import { ConcessionData, UpdateConcessionData } from '../../types'

export const useConcessionBackend = () => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	/**
	 * Get concession by ID
	 */
	const getConcession = async (
		concessionId: number
	): Promise<{
		success: boolean
		concession?: ConcessionData
		error?: string
	}> => {
		setLoading(true)
		setError(null)

		try {
			const response = await concessionApi.getConcession(concessionId)

			if (response.success && response.concession) {
				return {
					success: true,
					concession: response.concession as ConcessionData,
				}
			}

			setError(response.error || 'Failed to fetch concession')
			return {
				success: false,
				error: response.error || 'Failed to fetch concession',
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Unknown error occurred'
			setError(errorMessage)
			return { success: false, error: errorMessage }
		} finally {
			setLoading(false)
		}
	}

	/**
	 * Update concession details
	 */
	const updateConcession = async (
		concessionId: number,
		data: UpdateConcessionData
	): Promise<{
		success: boolean
		concession?: ConcessionData
		error?: string
	}> => {
		setLoading(true)
		setError(null)

		try {
			const response = await concessionApi.updateConcession(concessionId, data)

			if (response.success && response.concession) {
				return {
					success: true,
					concession: response.concession as ConcessionData,
				}
			}

			setError(response.error || 'Failed to update concession')
			return {
				success: false,
				error: response.error || 'Failed to update concession',
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Unknown error occurred'
			setError(errorMessage)
			return { success: false, error: errorMessage }
		} finally {
			setLoading(false)
		}
	}

	/**
	 * Toggle concession open/closed status
	 */
	const toggleConcessionStatus = async (
		concessionId: number,
		is_open: boolean
	): Promise<{
		success: boolean
		concession?: ConcessionData
		error?: string
	}> => {
		setLoading(true)
		setError(null)

		try {
			const response = await concessionApi.toggleConcessionStatus(
				concessionId,
				is_open
			)

			if (response.success && response.concession) {
				return {
					success: true,
					concession: response.concession as ConcessionData,
				}
			}

			setError(response.error || 'Failed to toggle concession status')
			return {
				success: false,
				error: response.error || 'Failed to toggle concession status',
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Unknown error occurred'
			setError(errorMessage)
			return { success: false, error: errorMessage }
		} finally {
			setLoading(false)
		}
	}

	return {
		loading,
		error,
		getConcession,
		updateConcession,
		toggleConcessionStatus,
	}
}
