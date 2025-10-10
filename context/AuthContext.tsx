import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import {
	AuthProviderProps,
	AuthContextType,
	LoginCredentials,
	RegisterData,
} from '../types'
import { useAuthBackend } from '../hooks'
import { appStateManager } from '../utils/appStateManager'

// Context type - extends AuthState and adds auth functions

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	// Use backend auth functions from backend/auth/index.ts
	const authBackend = useAuthBackend()

	// Derive auth state from backend user
	const isAuthenticated = !!authBackend.user
	const [isCheckingAuth, setIsCheckingAuth] = React.useState(true) // Renamed for clarity
	const [isLoading, setIsLoading] = React.useState(false) // For login/register operations
	const [error, setError] = React.useState<string | null>(null)

	// Auto-logout handler for app state manager
	const handleAutoLogout = async () => {
		console.log('Auto-logout triggered by app state manager')
		await authBackend.logout()
	}

	// App background handler
	const handleAppBackground = () => {
		console.log('App going to background')
	}

	// App foreground handler
	const handleAppForeground = () => {
		console.log('App coming to foreground')
	}

	// Check authentication status on app start
	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				setIsCheckingAuth(true)
				const result = await authBackend.checkAuthStatus()

				if (result.success) {
					// Initialize app state manager for authenticated users
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

		// Cleanup on unmount
		return () => {
			appStateManager.cleanup()
		}
	}, [])

	// Login wrapper - delegates to backend
	const login: AuthContextType['login'] = async (credentials: LoginCredentials): Promise<boolean> => {
		setIsLoading(true)
		setError(null)

		const result = await authBackend.login(credentials)

		if (result.success) {
			// Initialize app state manager after successful login
			appStateManager.initialize({
				onAutoLogout: handleAutoLogout,
				onAppBackground: handleAppBackground,
				onAppForeground: handleAppForeground,
			})
			setIsLoading(false)
			return true
		} else {
			setError(result.error || 'Login failed')
			setIsLoading(false)
			return false
		}
	}

	// Register wrapper - delegates to backend
	const register: AuthContextType['register'] = async (data: RegisterData): Promise<boolean> => {
		setIsLoading(true)
		setError(null)

		const result = await authBackend.register(data)

		if (result.success) {
			// Initialize app state manager after successful registration
			appStateManager.initialize({
				onAutoLogout: handleAutoLogout,
				onAppBackground: handleAppBackground,
				onAppForeground: handleAppForeground,
			})
			setIsLoading(false)
			return true
		} else {
			setError(result.error || 'Registration failed')
			setIsLoading(false)
			return false
		}
	}

	// Logout wrapper - delegates to backend
	const logout = async (): Promise<void> => {
		await authBackend.logout()
		await appStateManager.clearSession()
	}

	const requestPasswordReset: AuthContextType['requestPasswordReset'] = async (
		email: string
	): Promise<boolean> => {
		setIsLoading(true)
		setError(null)

		try {
			const result = await authBackend.requestPasswordReset(email)

			setIsLoading(false)

			if (result.success) {
				return true
			} else {
				setError(result.error || 'Failed to send password reset email')
				return false
			}
		} catch (err) {
			setIsLoading(false)
			setError(
				err instanceof Error
					? err.message
					: 'Failed to send password reset email'
			)
			return false
		}
	}

	const value: AuthContextType = {
		user: authBackend.user,
		isAuthenticated,
		isLoading: isCheckingAuth || isLoading, // Combined loading state
		error,
		login,
		register,
		logout,
		requestPasswordReset,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
