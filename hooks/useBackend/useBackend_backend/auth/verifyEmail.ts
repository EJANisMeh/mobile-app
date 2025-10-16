/**
 * Verify email with code
 */
import { AuthBackendType } from '../../../../types'
import { authApi } from '../../../../services/api'
import { UserData } from '../../../../types'
import { storeUser } from '../../../../backend/auth/authAsyncData'

export const verifyEmail = (
	user: UserData | null,
	setUser: (u: UserData) => void,
	setIsLoading: (v: boolean) => void,
	setError: (v: string | null) => void
): AuthBackendType['verifyEmail'] => {
	return async (data) => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await authApi.verifyEmail(data)

			if (response.success && user) {
				// Update local user state with emailVerified = true
				const updatedUser = { ...user, emailVerified: true }
				setUser(updatedUser)
				await storeUser(updatedUser)
			}

			if (!response.success) {
				setError(response.error || 'Email verification failed')
			}

			return {
				success: response.success,
				error: response.error,
			}
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : 'Email verification failed'
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
