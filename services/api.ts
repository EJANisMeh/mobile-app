import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import { User, LoginCredentials, RegisterData } from '../types/auth'

// API Configuration
// For React Native development:
// - Web and iOS simulator can use localhost
// - Android emulator (AVD) should use 10.0.2.2
// - Physical devices should use your machine IP (phoneIp)
const phoneIp: string = '192.168.100.35'
const getApiBaseUrl = () => {
	// Development mode helpers
	if (__DEV__) {
		// Web (Expo web / react-native-web)
		if (Platform.OS === 'web') {
			return 'http://localhost:3000/api'
		}

		// iOS simulator (can access localhost of host machine)
		if (Platform.OS === 'ios') {
			return 'http://localhost:3000/api'
		}

		// Android (emulator vs device)
		if (Platform.OS === 'android') {
			// Most Android emulators (AVD) map host localhost to 10.0.2.2
			// If you're on a physical Android device use phoneIp instead.
			return 'http://10.0.2.2:3000/api'
		}

		// Fallback to local network IP for any other platform
		return `http://${phoneIp}:3000/api`
	}

	// Production API URL (replace with your actual production URL)
	return 'https://your-production-api.com/api'
}

const API_BASE_URL = getApiBaseUrl()

// Type for API responses
interface ApiResponse<T = any> {
	success: boolean
	data?: T
	user?: User
	token?: string
	message?: string
	error?: string
}

// Helper function to make API calls
const apiCall = async <T = any>(
	endpoint: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> => {
	try {
		const url = `${API_BASE_URL}${endpoint}`

		const defaultHeaders = {
			'Content-Type': 'application/json',
		}

		const config: RequestInit = {
			...options,
			headers: {
				...defaultHeaders,
				...options.headers,
			},
		}

		const response = await fetch(url, config)
		const data = await response.json()

		// Don't throw errors, return them as part of the response
		if (!response.ok) {
			return {
				success: false,
				error: data.error || `Request failed with status ${response.status}`,
			}
		}

		return data
	} catch (error) {
		console.error('API call failed:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error occurred',
		}
	}
}

// Auth API functions
export const authApi = {
	// Register new user
	register: async (userData: RegisterData): Promise<ApiResponse> => {
		const response = await apiCall('/auth/register', {
			method: 'POST',
			body: JSON.stringify(userData),
		})

		if (response.success && response.token) {
			await AsyncStorage.setItem('authToken', response.token)
			await AsyncStorage.setItem('user', JSON.stringify(response.user))
		}

		return response
	},

	// Login user
	login: async (credentials: LoginCredentials): Promise<ApiResponse> => {
		const response = await apiCall('/auth/login', {
			method: 'POST',
			body: JSON.stringify(credentials),
		})

		if (response.success && response.token) {
			await AsyncStorage.setItem('authToken', response.token)
			await AsyncStorage.setItem('user', JSON.stringify(response.user))
		}

		return response
	},

	// Verify token
	verifyToken: async (token: string): Promise<ApiResponse> => {
		return await apiCall('/auth/verify-token', {
			method: 'POST',
			body: JSON.stringify({ token }),
		})
	},

	// Check auth status from stored token
	checkAuthStatus: async (): Promise<{
		user: User | null
		isAuthenticated: boolean
	}> => {
		try {
			const token = await AsyncStorage.getItem('authToken')

			if (!token) {
				return { user: null, isAuthenticated: false }
			}

			const response = await authApi.verifyToken(token)

			if (response.success && response.user) {
				return { user: response.user, isAuthenticated: true }
			} else {
				// Token is invalid, remove it
				await AsyncStorage.multiRemove(['authToken', 'user'])
				return { user: null, isAuthenticated: false }
			}
		} catch (error) {
			console.error('Error checking auth status:', error)
			return { user: null, isAuthenticated: false }
		}
	},

	// Logout user
	logout: async (): Promise<void> => {
		try {
			await AsyncStorage.multiRemove(['authToken', 'user'])
		} catch (error) {
			console.error('Error during logout:', error)
		}
	},

	// Get stored user data
	getStoredUser: async (): Promise<User | null> => {
		try {
			const userData = await AsyncStorage.getItem('user')
			return userData ? JSON.parse(userData) : null
		} catch (error) {
			console.error('Error getting stored user:', error)
			return null
		}
	},

	// Clear all auth data
	clearAuthData: async (): Promise<void> => {
		try {
			await AsyncStorage.multiRemove(['authToken', 'user'])
		} catch (error) {
			console.error('Error clearing auth data:', error)
		}
	},
}

// User API functions
export const userApi = {
	// Get all users (for testing/debug)
	getUsers: async (): Promise<ApiResponse> => {
		return await apiCall('/users')
	},

	// Seed test users
	seedTestUsers: async (): Promise<ApiResponse> => {
		return await apiCall('/users/seed-test-users', {
			method: 'POST',
		})
	},
}

// Health check
export const healthApi = {
	checkHealth: async (): Promise<ApiResponse> => {
		return await apiCall('/health')
	},

	testDatabase: async (): Promise<ApiResponse> => {
		return await apiCall('/test-db')
	},
}
