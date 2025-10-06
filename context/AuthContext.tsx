import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { AuthState, LoginCredentials, RegisterData } from '../types/auth'
import { useAuthBackend } from '../backend/auth'
import { appStateManager } from '../utils/appStateManager'

// Context type - extends AuthState and adds auth functions
interface AuthContextType extends AuthState {
	login: (credentials: LoginCredentials) => Promise<boolean>
	register: (data: RegisterData) => Promise<boolean>
	logout: () => Promise<void>
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
interface AuthProviderProps {
	children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	// Use backend auth functions from backend/auth/index.ts
	const authBackend = useAuthBackend()

	// Derive auth state from backend user
	const isAuthenticated = !!authBackend.user
	const [isLoading, setIsLoading] = React.useState(true)
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
				setIsLoading(true)
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
				setIsLoading(false)
			}
		}

		checkAuthStatus()

		// Cleanup on unmount
		return () => {
			appStateManager.cleanup()
		}
	}, [])

	// Login wrapper
	const login = async (credentials: LoginCredentials): Promise<boolean> => {
		try {
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
				return true
			} else {
				setError(result.error || 'Login failed')
				return false
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Login failed'
			setError(errorMessage)
			return false
		} finally {
			setIsLoading(false)
		}
	}

	// Register wrapper
	const register = async (data: RegisterData): Promise<boolean> => {
		try {
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
				return true
			} else {
				setError(result.error || 'Registration failed')
				return false
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Registration failed'
			setError(errorMessage)
			return false
		} finally {
			setIsLoading(false)
		}
	}

	// Logout wrapper
	const logout = async (): Promise<void> => {
		try {
			await authBackend.logout()
			await appStateManager.clearSession()
		} catch (err) {
			console.error('Error during logout:', err)
			// Even if logout fails, clear session
			await appStateManager.clearSession()
		}
	}

	const value: AuthContextType = {
		user: authBackend.user,
		isAuthenticated,
		isLoading,
		error,
		login,
		register,
		logout,
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
