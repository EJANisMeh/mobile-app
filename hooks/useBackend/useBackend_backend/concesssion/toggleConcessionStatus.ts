/**
 * Toggle concession open/closed status
 */
import { ConcessionData } from '../../../../types'
import { concessionApi } from '../../../../services/api'

export const toggleConcessionStatus = (
	setLoading: (v: boolean) => void,
	setError: (v: string | null) => void
) => {
	return async (
		concessionId: number
	): Promise<{
		success: boolean
		concession_data?: ConcessionData
		error?: string
		message?: string
	}> => {
		setLoading(true)
		setError(null)

		try {
			const response = await concessionApi.toggleConcessionStatus(concessionId)

			if (!response.success || !response.concession_data) {
				const err = response.error || 'Failed to toggle concession status'
				setError(err)
				return {
					success: false,
					error: err,
				}
			}

			return {
				success: true,
				concession_data: response.concession_data,
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Unknown error occurred'
			setError(errorMessage)
			return {
				success: false,
				error: errorMessage,
			}
		} finally {
			setLoading(false)
		}
	}
}
