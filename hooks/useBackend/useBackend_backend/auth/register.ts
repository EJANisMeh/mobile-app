/**
 * Register new user
 * Calls backend API and stores auth data locally
 */
import { AuthBackendType } from '../../../../types'
import { authApi } from '../../../../services/api'

export const register = (
	setIsLoading: (v: boolean) => void,
	setError: (v: string | null) => void
): AuthBackendType['register'] => {
	return async (userData) => {
		setIsLoading(true)
		setError(null)

		try {
			// Call backend register endpoint via API
			const response = await authApi.register(userData)

			if (!response.success) {
				setError(response.error || 'Registration failed')
				return {
					success: false,
					error: response.error || 'Registration failed',
				}
			}

			return {
				success: true,
				userId: response.userId as number,
				needsEmailVerification: response.needsEmailVerification,
				message: response.message,
			}
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : 'Registration failed'
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
