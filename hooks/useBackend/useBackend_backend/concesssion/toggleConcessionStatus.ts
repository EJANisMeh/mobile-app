/**
 * Toggle concession open/closed status
 */
import { ConcessionData } from '../../../../types'
import { concessionApi } from '../../../../services/api'

export const toggleConcessionStatus = (
	setLoading: (v: boolean) => void,
	setError: (v: string | null) => void,
	setConcession: (concession: ConcessionData | null) => void
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

			const updatedConcession = response.concession_data as ConcessionData

			setConcession(updatedConcession)

			return {
				success: true,
				message: response.message || 'Concession status toggled successfully',
				concession_data: updatedConcession
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
