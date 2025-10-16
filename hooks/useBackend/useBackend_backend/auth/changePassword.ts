/**
 * Change user password
 */
import { AuthBackendType } from '../../../../types'
import { authApi } from '../../../../services/api'

export const changePassword = (
	setIsLoading: (v: boolean) => void,
	setError: (v: string | null) => void
): AuthBackendType['changePassword'] => {
	return async (data) => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await authApi.changePassword(data)
			if (!response.success) {
				setError(response.error || 'Password change failed')
				return {
					success: false,
					error: response.error || 'Password change failed',
				}
			}

			return {
				success: response.success,
				message: response.message,
			}
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : 'Password change failed'
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
