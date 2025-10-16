/**
 * Verify email with code
 */
import { AuthBackendType } from '../../../../types'
import { authApi } from '../../../../services/api'
import { UserData } from '../../../../types'
import { storeUser } from '../../../../backend/auth/authAsyncData'

export const verifyEmail = (
	user: UserData | null,
	setUser: (u: UserData) => void
): AuthBackendType['verifyEmail'] => {
	return async (data) => {
		try {
			const response = await authApi.verifyEmail(data)

			if (response.success && user) {
				// Update local user state with emailVerified = true
				const updatedUser = { ...user, emailVerified: true }
				setUser(updatedUser)
				await storeUser(updatedUser)
			}

			return {
				success: response.success,
				error: response.error,
			}
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Email verification failed',
			}
		}
	}
}
