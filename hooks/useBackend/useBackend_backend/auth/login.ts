/**
 * Login user
 * Calls backend API and stores auth data locally
 */

import { AuthBackendType } from '../../../../types'
import { UserData } from '../../../../types/userTypes'
import { authApi } from '../../../../services/api'
import {
	storeAuthToken,
	storeUser,
} from '../../../../backend/auth/authAsyncData'

export const login = (
	setUser: (u: UserData | null) => void,
	setIsLoading: (v: boolean) => void,
	setError: (v: string | null) => void
): AuthBackendType['login'] => {
	return async (credentials) => {
		setIsLoading(true)
		setError(null)

		try {
			// Call backend login endpoint via API
			const response = await authApi.login(credentials)
			if (!response.user || !response.success) {
				setError(response.error || 'Login failed')
				return {
					success: false,
					error: response.error || 'Login failed',
				}
			}

			// Check if user needs to complete profile
			// If so, don't store auth data yet - just return the info

			if (response.needsEmailVerification) {
				return {
					success: true,
					userId: response.user.id,
					needsEmailVerification: response.needsEmailVerification,
					message: response.message,
				}
			}

			// Ensure user login is complete - token must be present
			if (!response.token) {
				setError('No token received')
				return {
					success: false,
					error: 'No token received',
				}
			}

			if (response.needsProfileCreation) {
				return {
					success: true,
					userId: response.user.id,
					needsProfileCreation: response.needsProfileCreation,
					token: response.token,
					message: response.message,
				}
			}

			// Normal login flow - store auth data
			// Store auth token
			await storeAuthToken(response.token)

			// Store user data
			await storeUser(response.user as UserData)

			// Update local state
			setUser(response.user as UserData)

			return response
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : 'Login failed'
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
