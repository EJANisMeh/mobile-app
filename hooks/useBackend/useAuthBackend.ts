/**
 * Authentication Backend Hook
 * Provides all authentication functions and state
 */
import { useState } from 'react'
import { AuthBackendType, UserData } from '../../types'
import { authApi } from '../../services/api'
import {
	storeAuthToken,
	getStoredUser,
	storeUser,
	clearAuthData,
} from '../../backend/auth/authAsyncData'

export const useAuthBackend = (): AuthBackendType => {
	const [user, setUser] = useState<UserData | null>(null)

	/**
	 * Login user
	 * Calls backend API and stores auth data locally
	 */
	const login: AuthBackendType['login'] = async (credentials) => {
		try {
			// Call backend login endpoint via API
			const response = await authApi.login(credentials)

			if (response.success && response.user && response.token) {
				// Store auth token
				await storeAuthToken(response.token)

				// Store user data
				await storeUser(response.user as UserData)

				// Update local state
				setUser(response.user as UserData)

				return {
					success: true,
					user: response.user as UserData,
					token: response.token,
					needsEmailVerification: response.needsEmailVerification,
					needsProfileCreation: response.needsProfileCreation,
				}
			} else {
				return {
					success: false,
					error: response.error || 'Login failed',
				}
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Login failed',
			}
		}
	}

	/**
	 * Register new user
	 * Calls backend API and stores auth data locally
	 */
	const register: AuthBackendType['register'] = async (data) => {
		try {
			// Call backend register endpoint via API
			const response = await authApi.register(data)

			if (response.success && response.user && response.token) {
				// Store auth token
				await storeAuthToken(response.token)

				// Store user data
				await storeUser(response.user as UserData)

				// Update local state
				setUser(response.user as UserData)

				return {
					success: true,
					user: response.user as UserData,
					token: response.token,
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

	/**
	 * Logout user
	 * Clears auth data and calls backend logout endpoint
	 */
	const logout: AuthBackendType['logout'] = async () => {
		try {
			// Call backend logout endpoint
			await authApi.logout()

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

	/**
	 * Check authentication status
	 * Verifies token with backend
	 */
	const checkAuthStatus: AuthBackendType['checkAuthStatus'] = async () => {
		try {
			// Call backend to verify token
			const response = await authApi.checkAuthStatus()

			if (response.success && response.user) {
				setUser(response.user as UserData)
				return {
					success: true,
					user: response.user as UserData,
				}
			} else {
				setUser(null)
				return {
					success: false,
					error: response.error || 'Not authenticated',
				}
			}
		} catch (error) {
			setUser(null)
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Auth check failed',
			}
		}
	}

	/**
	 * Change user password
	 */
	const changePassword: AuthBackendType['changePassword'] = async (data) => {
		try {
			const response = await authApi.changePassword(data)
			return {
				success: response.success,
				error: response.error,
			}
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Password change failed',
			}
		}
	}

	/**
	 * Verify email with code
	 */
	const verifyEmail: AuthBackendType['verifyEmail'] = async (data) => {
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

	/**
	 * Resend verification email
	 */
	const resendVerification: AuthBackendType['resendVerification'] = async (
		userId
	) => {
		try {
			const response = await authApi.resendVerification(userId)
			return {
				success: response.success,
				error: response.error,
			}
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Resend verification failed',
			}
		}
	}

	/**
	 * Request password reset email
	 */
	const requestPasswordReset: AuthBackendType['requestPasswordReset'] = async (
		email
	) => {
		try {
			const response = await authApi.requestPasswordReset(email)
			return {
				success: response.success,
				error: response.error,
			}
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: 'Password reset request failed',
			}
		}
	}

	/**
	 * Reset password with token
	 */
	const resetPassword: AuthBackendType['resetPassword'] = async (data) => {
		try {
			const response = await authApi.resetPassword(data)
			return {
				success: response.success,
				error: response.error,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Password reset failed',
			}
		}
	}

	return {
		user,
		login,
		register,
		logout,
		checkAuthStatus,
		changePassword,
		verifyEmail,
		resendVerification,
		requestPasswordReset,
		resetPassword,
	}
}
