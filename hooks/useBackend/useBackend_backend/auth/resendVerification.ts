/**
 * Resend verification email
 */
import { AuthBackendType } from '../../../../types'
import { authApi } from '../../../../services/api'

export const resendVerification = (
	setIsLoading: (v: boolean) => void,
	setError: (v: string | null) => void
): AuthBackendType['resendVerification'] => {
	return async (userId) => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await authApi.resendVerification(userId)
			if (!response.success) {
				setError(response.error || 'Resend verification failed')
			}
			return {
				success: response.success,
				error: response.error,
			}
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : 'Resend verification failed'
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
