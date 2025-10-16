/**
 * Reset password with email
 */
import { AuthBackendType } from '../../../../types'
import { authApi } from '../../../../services/api'

export const resetPassword = (
	setIsLoading: (v: boolean) => void,
	setError: (v: string | null) => void
): AuthBackendType['resetPassword'] => {
	return async (data) => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await authApi.resetPassword(data)
			if (!response.success) {
				setError(response.error || 'Password reset failed')
				return {
					success: false,
					error: response.error || 'Password reset failed',
				}
			}

			return {
				success: true,
				message: response.message || 'Password reset successful',
			}
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : 'Password reset failed'
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
