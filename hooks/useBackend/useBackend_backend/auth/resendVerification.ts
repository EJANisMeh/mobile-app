/**
 * Resend verification email
 */
import { AuthBackendType } from '../../../../types'
import { authApi } from '../../../../services/api'

export const resendVerification = (): AuthBackendType['resendVerification'] => {
	return async (userId) => {
		try {
			const response = await authApi.resendVerification(userId)
			return {
				success: response.success,
				error: response.error,
			}
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Resend verification failed',
			}
		}
	}
}
