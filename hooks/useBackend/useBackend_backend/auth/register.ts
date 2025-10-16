/**
 * Register new user
 * Calls backend API and stores auth data locally
 */
import { AuthBackendType } from '../../../../types'
import { authApi } from '../../../../services/api'

export const register = (): AuthBackendType['register'] => {
	return async (userData) => {
		try {
			// Call backend register endpoint via API
			const response = await authApi.register(userData)

			if (response.success) {
				return {
					success: true,
					userId: response.userId as number,
					needsEmailVerification: response.needsEmailVerification,
				}
			} else {
				return {
					success: false,
					error: response.error || 'Registration failed',
				}
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Registration failed',
			}
		}
	}
}
