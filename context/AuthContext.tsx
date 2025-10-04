import React, {
	createContext,
	useContext,
	useReducer,
	useEffect,
	ReactNode,
} from 'react'
import { AuthState, User, LoginCredentials, RegisterData } from '../types/auth'
import {
	checkAuthStatus as checkAuthStatusBackend,
	handleLogin,
	handleRegister,
	handleLogout,
} from '../backend/auth'
import { appStateManager } from '../backend/auth/appStateManager'

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
				error: null,
			}
		default:
			return state
	}
}

// Context type
type AuthContextType = {
	state: AuthState
	login: (credentials: LoginCredentials) => Promise<boolean>
	register: (data: RegisterData) => Promise<boolean>
	logout: () => Promise<void>
	clearError: () => void
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
interface AuthProviderProps {
	children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState)

	// Check for existing token on app start and setup app state monitoring
	useEffect(() => {
		const initializeAuth = async () => {
			// Set up logout callback for app state manager
			appStateManager.setLogoutCallback(async () => {
				dispatch({ type: 'LOGOUT' })
			})

			// FIRST: Check for app termination before loading any auth state
			await appStateManager.checkTerminationAndClearAuth()

			// THEN: Load auth status (which will be cleared if app was terminated)
			await checkAuthStatusBackend(dispatch)

			// FINALLY: Start monitoring app state for future terminations
			await appStateManager.start()
		}

		initializeAuth()

		// Cleanup on unmount
		return () => {
			appStateManager.stop()
		}
	}, [])

	const login = async (credentials: LoginCredentials): Promise<boolean> => {
		return await handleLogin(credentials, dispatch)
	}

	const register = async (data: RegisterData): Promise<boolean> => {
		return await handleRegister(data, dispatch)
	}

	const logout = async (): Promise<void> => {
		await handleLogout(dispatch)
	}

	const clearError = () => {
		dispatch({ type: 'SET_ERROR', payload: null })
	}

	const value: AuthContextType = {
		state,
		login,
		register,
		logout,
		clearError,
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
