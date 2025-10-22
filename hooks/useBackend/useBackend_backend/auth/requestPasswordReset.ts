/**
 * Request password reset email
 */
import { AuthBackendType } from '../../../../types'
import { authApi } from '../../../../services/api'

export const requestPasswordReset = (
	setIsLoading: (v: boolean) => void,
	setError: (v: string | null) => void
): AuthBackendType['requestPasswordReset'] => {
	return async (email) => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await authApi.requestPasswordReset(email)
			if (!response.success) {
				setError(response.error || 'Password reset request failed')
				return {
					success: false,
					error: response.error || 'Password reset request failed',
				}
			}

			return response
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : 'Password reset request failed'
			setError(errorMsg)
			return {
				success: false,
				error: errorMsg,
			}
		} finally {
			setIsLoading(false)
		}
	}
}
