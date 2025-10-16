/**
 * Authentication Backend Hook
 * Provides all authentication functions and state by calling auth backend API
 */
import { useState } from 'react'
import { AuthBackendType, UserData } from '../../types'
import { authApi } from '../../services/api'
import * as auth from './useBackend_backend/auth'

export const useAuthBackend = (): AuthBackendType => {
	const [user, setUser] = useState<UserData | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Derive isAuthenticated from user state
	const isAuthenticated = !!user

	return {
		user,
		isAuthenticated,
		isLoading,
		error,
		login: auth.login(setUser, setIsLoading, setError),
		register: auth.register(setIsLoading, setError),
		logout: auth.logout(setUser, setIsLoading, setError),
		checkAuthStatus: auth.checkAuthStatus(setUser, setIsLoading, setError),
		changePassword: auth.changePassword(setIsLoading, setError),
		completeProfile: auth.completeProfile(setUser, setIsLoading, setError),
		verifyEmail: auth.verifyEmail(user, setUser, setIsLoading, setError),
		resendVerification: auth.resendVerification(setIsLoading, setError),
		requestPasswordReset: auth.requestPasswordReset(setIsLoading, setError),
		resetPassword: auth.resetPassword(setIsLoading, setError),
	}
}
