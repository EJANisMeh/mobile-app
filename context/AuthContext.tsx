import React, {
	createContext,
	useContext,
	useReducer,
	useEffect,
	ReactNode,
} from 'react'
import { AuthState, User, LoginCredentials, RegisterData } from '../types/auth'
import { authApi } from '../services/api'
import { appStateManager } from '../utils/appStateManager'

// Initial state
const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	isLoading: true,
	error: null,
}

// Action types
type AuthAction =
	| { type: 'SET_LOADING'; payload: boolean }
	| { type: 'SET_USER'; payload: Omit<User, 'passwordHash'> | null }
	| { type: 'SET_ERROR'; payload: string | null }
	| {
			type: 'LOGIN_SUCCESS'
			payload: { user: Omit<User, 'passwordHash'>; token: string }
	  }
	| { type: 'LOGOUT' }

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
	switch (action.type) {
		case 'SET_LOADING':
			return { ...state, isLoading: action.payload }
		case 'SET_USER':
			return {
				...state,
				user: action.payload,
				isAuthenticated: !!action.payload,
				isLoading: false,
				error: null,
			}
		case 'SET_ERROR':
			return { ...state, error: action.payload, isLoading: false }
		case 'LOGIN_SUCCESS':
			return {
				...state,
				user: action.payload.user,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			}
		case 'LOGOUT':
			return {
				...state,
				user: null,
				isAuthenticated: false,
				isLoading: false,
				error: null,
			}
		default:
			return state
	}
}

// Context type
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
	const [state, dispatch] = useReducer(authReducer, initialState)

	// Logout function
	const logout = async (): Promise<void> => {
		try {
			await authApi.logout()
			await appStateManager.clearSession()
			dispatch({ type: 'LOGOUT' })
		} catch (error) {
			console.error('Error during logout:', error)
			// Even if logout fails, clear the local state
			dispatch({ type: 'LOGOUT' })
		}
	}

	// Auto-logout handler for app state manager
	const handleAutoLogout = async () => {
		console.log('Auto-logout triggered by app state manager')
		await logout()
	}

	// App background handler
	const handleAppBackground = () => {
		console.log('App going to background')
		// Additional background handling if needed
	}

	// App foreground handler
	const handleAppForeground = () => {
		console.log('App coming to foreground')
		// Additional foreground handling if needed
	}

	// Check authentication status on app start
	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				dispatch({ type: 'SET_LOADING', payload: true })

				const response = await authApi.checkAuthStatus()

				if (response.success && response.user) {
					dispatch({ type: 'SET_USER', payload: response.user })

					// Initialize app state manager for authenticated users
					appStateManager.initialize({
						onAutoLogout: handleAutoLogout,
						onAppBackground: handleAppBackground,
						onAppForeground: handleAppForeground,
					})
				} else {
					dispatch({ type: 'SET_USER', payload: null })
				}
			} catch (error) {
				console.error('Error checking auth status:', error)
				dispatch({
					type: 'SET_ERROR',
					payload: 'Failed to check authentication status',
				})
			} finally {
				dispatch({ type: 'SET_LOADING', payload: false })
			}
		}

		checkAuthStatus()

		// Cleanup on unmount
		return () => {
			appStateManager.cleanup()
		}
	}, [])

	// Login function
	const login = async (credentials: LoginCredentials): Promise<boolean> => {
		try {
			dispatch({ type: 'SET_LOADING', payload: true })
			dispatch({ type: 'SET_ERROR', payload: null })

			const response = await authApi.login(credentials)

			if (response.success && response.user) {
				dispatch({
					type: 'LOGIN_SUCCESS',
					payload: { user: response.user, token: response.token || '' },
				})

				// Initialize app state manager after successful login
				appStateManager.initialize({
					onAutoLogout: handleAutoLogout,
					onAppBackground: handleAppBackground,
					onAppForeground: handleAppForeground,
				})

				return true
			} else {
				dispatch({
					type: 'SET_ERROR',
					payload: response.error || 'Login failed',
				})
				return false
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Login failed'
			dispatch({ type: 'SET_ERROR', payload: errorMessage })
			return false
		} finally {
			dispatch({ type: 'SET_LOADING', payload: false })
		}
	}

	// Register function
	const register = async (data: RegisterData): Promise<boolean> => {
		try {
			dispatch({ type: 'SET_LOADING', payload: true })
			dispatch({ type: 'SET_ERROR', payload: null })

			const response = await authApi.register(data)

			if (response.success && response.user) {
				dispatch({
					type: 'LOGIN_SUCCESS',
					payload: { user: response.user, token: response.token || '' },
				})

				// Initialize app state manager after successful registration
				appStateManager.initialize({
					onAutoLogout: handleAutoLogout,
					onAppBackground: handleAppBackground,
					onAppForeground: handleAppForeground,
				})

				return true
			} else {
				dispatch({
					type: 'SET_ERROR',
					payload: response.error || 'Registration failed',
				})
				return false
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Registration failed'
			dispatch({ type: 'SET_ERROR', payload: errorMessage })
			return false
		} finally {
			dispatch({ type: 'SET_LOADING', payload: false })
		}
	}

	const value: AuthContextType = {
		...state,
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
