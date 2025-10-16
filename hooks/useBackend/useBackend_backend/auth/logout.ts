/**
 * Logout user
 * Clears auth data and calls backend logout endpoint
 */
import { AuthBackendType } from '../../../../types'
import { authApi } from '../../../../services/api'
import { clearAuthData } from '../../../../backend/auth/authAsyncData'
import { response } from 'express'

export const logout = (
	setUser: (u: null) => void
): AuthBackendType['logout'] => {
	return async () => {
		try {
			// Call backend logout endpoint
			const response = await authApi.logout()

			// Clear local auth data
			await clearAuthData()

			// Update local state
			setUser(null)

			return { success: true }
		} catch (error) {
			// Even if backend call fails, clear local data
			await clearAuthData()
			setUser(null)
			return { success: true }
		}
	}
}
