import { useEffect, useState } from 'react'
import { useAuthBackend } from './useBackend'
import { appStateManager } from '../utils/appStateManager'
import type { LoginCredentials, RegisterData } from '../types'

export const useAuth = () => {
	const authBackend = useAuthBackend()
	const isAuthenticated = !!authBackend.user
	const [isCheckingAuth, setIsCheckingAuth] = useState(true)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleAutoLogout = async () => {
		console.log('Auto-logout triggered')
		await authBackend.logout()
	}

	const handleAppBackground = () => {
		console.log('App going to background')
	}

	const handleAppForeground = () => {
		console.log('App coming to foreground')
	}

	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				setIsCheckingAuth(true)
				const result = await authBackend.checkAuthStatus()

				if (result.success) {
					appStateManager.initialize({
						onAutoLogout: handleAutoLogout,
						onAppBackground: handleAppBackground,
						onAppForeground: handleAppForeground,
					})
				}
			} catch (err) {
				console.error('Error checking auth status:', err)
				setError('Failed to check authentication status')
			} finally {
				setIsCheckingAuth(false)
			}
		}

		checkAuthStatus()

		return () => {
			appStateManager.cleanup()
		}
	}, [])

	const login = async (credentials: LoginCredentials) => {
		setIsLoading(true)
		setError(null)

		const result = await authBackend.login(credentials)

		if (!result.success || !result.user) {
			setError(result.error || 'Login failed')
			setIsLoading(false)
			return { success: false }
		}

		if (result.needsEmailVerification && result.user) {
			setIsLoading(false)
			return {
				success: true,
				needsEmailVerification: true,
				userId: result.user.id,
			}
		}

		if (result.needsProfileCreation && result.user) {
			setIsLoading(false)
			return {
				success: true,
				needsProfileCreation: true,
				userId: result.user.id,
				token: result.token,
			}
		}

		appStateManager.initialize({
			onAutoLogout: handleAutoLogout,
			onAppBackground: handleAppBackground,
			onAppForeground: handleAppForeground,
		})

		setIsLoading(false)
		return { success: true }
	}

	const register = async (data: RegisterData) => {
		setIsLoading(true)
		setError(null)

		const result = await authBackend.register(data)

		if (!result.success) {
			setError(result.error || 'Registration failed')
		}

		setIsLoading(false)
		return result
	}

	const logout = async () => {
		await authBackend.logout()
		appStateManager.cleanup()
	}

	return {
		user: authBackend.user,
		isAuthenticated,
		isCheckingAuth,
		isLoading,
		error,
		login,
		register,
		logout,
		verifyEmail: authBackend.verifyEmail,
		completeProfile: authBackend.completeProfile,
		requestPasswordReset: authBackend.requestPasswordReset,
		resetPassword: authBackend.resetPassword,
		changePassword: authBackend.changePassword,
	}
}
