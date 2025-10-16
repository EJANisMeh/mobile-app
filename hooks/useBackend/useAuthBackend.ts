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

	return {
		user,
		login: auth.login(setUser),
		register: auth.register(),
		logout: auth.logout(setUser),
		checkAuthStatus: auth.checkAuthStatus(setUser),
		changePassword: auth.changePassword(),
		completeProfile: auth.completeProfile(setUser),
		verifyEmail: auth.verifyEmail(user, setUser),
		resendVerification: auth.resendVerification(),
		requestPasswordReset: auth.requestPasswordReset(),
		resetPassword: auth.resetPassword(),
	}
}
