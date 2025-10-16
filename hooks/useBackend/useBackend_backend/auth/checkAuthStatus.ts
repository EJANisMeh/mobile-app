/**
 * Check authentication status
 * Verifies token with backend
 */
import { AuthBackendType } from '../../../../types'
import { UserData } from '../../../../types/userTypes'
import { authApi } from '../../../../services/api'

export const checkAuthStatus = (
	setUser: (user: UserData | null) => void
): AuthBackendType['checkAuthStatus'] => {
	return async () => {
		try {
			// Call backend to verify token
			const response = await authApi.checkAuthStatus()

			if (!response.success || !response.user) {
				setUser(null)
				return {
					success: false,
					error: response.error || 'Not authenticated',
				}
			}

			setUser(response.user as UserData)
			return {
				success: true,
        user: response.user as UserData,
        message: response.message || 'Authenticated',
			}
		} catch (error) {
			setUser(null)
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Auth check failed',
			}
		}
	}
}
