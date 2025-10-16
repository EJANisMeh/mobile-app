/**
 * Check authentication status
 * Verifies token with backend
 */
import { AuthBackendType } from '../../../../types'
import { UserData } from '../../../../types/userTypes'
import { authApi } from '../../../../services/api'

export const checkAuthStatus = (
	setUser: (user: UserData | null) => void,
	setIsLoading: (v: boolean) => void,
	setError: (v: string | null) => void
): AuthBackendType['checkAuthStatus'] => {
	return async () => {
		setIsLoading(true)
		setError(null)

		try {
			// Call backend to verify token
			const response = await authApi.checkAuthStatus()

			if (!response.success || !response.user) {
				setUser(null)
				setError(response.error || 'Not authenticated')
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
			const errorMsg =
				error instanceof Error ? error.message : 'Auth check failed'
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
