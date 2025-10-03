import React, {
	createContext,
	useContext,
	useReducer,
	useEffect,
	ReactNode,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthState, User, LoginCredentials, RegisterData } from '../types/auth'
import { loginUser, registerUser, logoutUser } from '../backend/auth'

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

	// Check for existing token on app start
	useEffect(() => {
		checkAuthStatus()
	}, [])

	const checkAuthStatus = async () => {
		try {
			const token = await AsyncStorage.getItem('authToken')
			const userString = await AsyncStorage.getItem('user')

			if (token && userString) {
				const user = JSON.parse(userString)
				dispatch({ type: 'SET_USER', payload: user })
			} else {
				dispatch({ type: 'SET_LOADING', payload: false })
			}
		} catch (error) {
			console.error('Error checking auth status:', error)
			dispatch({ type: 'SET_LOADING', payload: false })
		}
	}

	const login = async (credentials: LoginCredentials): Promise<boolean> => {
		try {
			dispatch({ type: 'SET_LOADING', payload: true })
			dispatch({ type: 'SET_ERROR', payload: null })

			const response = await loginUser(credentials)

			if (response.success && response.user && response.token) {
				// Store token and user data
				await AsyncStorage.setItem('authToken', response.token)
				await AsyncStorage.setItem('user', JSON.stringify(response.user))

				dispatch({
					type: 'LOGIN_SUCCESS',
					payload: { user: response.user, token: response.token },
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
			console.error('Login error:', error)
			dispatch({
				type: 'SET_ERROR',
				payload: 'Login failed. Please try again.',
			})
			return false
		}
	}

	const register = async (data: RegisterData): Promise<boolean> => {
		try {
			dispatch({ type: 'SET_LOADING', payload: true })
			dispatch({ type: 'SET_ERROR', payload: null })

			const response = await registerUser(data)

			if (response.success) {
				dispatch({ type: 'SET_LOADING', payload: false })
				return true
			} else {
				dispatch({
					type: 'SET_ERROR',
					payload: response.error || 'Registration failed',
				})
				return false
			}
		} catch (error) {
			console.error('Registration error:', error)
			dispatch({
				type: 'SET_ERROR',
				payload: 'Registration failed. Please try again.',
			})
			return false
		}
	}

	const logout = async (): Promise<void> => {
		try {
			// Call backend logout (optional for JWT)
			await logoutUser()

			// Remove stored data
			await AsyncStorage.removeItem('authToken')
			await AsyncStorage.removeItem('user')

			dispatch({ type: 'LOGOUT' })
		} catch (error) {
			console.error('Logout error:', error)
			// Even if backend call fails, still logout locally
			await AsyncStorage.removeItem('authToken')
			await AsyncStorage.removeItem('user')
			dispatch({ type: 'LOGOUT' })
		}
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
