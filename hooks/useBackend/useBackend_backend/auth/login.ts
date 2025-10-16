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
	setUser: (u: UserData | null) => void
): AuthBackendType['login'] => {
	return async (credentials) => {
		try {
			// Call backend login endpoint via API
			const response = await authApi.login(credentials)
			console.log('Login response:', response)
			if (!response.user || !response.success) {
				return {
					success: false,
					error: response.error || 'Login failed',
				}
			}

			// Check if user needs to complete profile
			// If so, don't store auth data yet - just return the info

			if (response.needsEmailVerification || response.needsProfileCreation) {
				return response
			}

			if (!response.token) {
				return {
					success: false,
					error: 'No token received',
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
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Login failed',
			}
		}
	}
}
