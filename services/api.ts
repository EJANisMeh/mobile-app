import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import { User, LoginCredentials, RegisterData } from '../types/auth'

/**
 * API Service - Thin HTTP Client Layer
 *
 * This file contains ONLY HTTP client code for making API requests.
 * All business logic is in the backend modules (backend/auth/, backend/user/, backend/debug/)
 *
 * Responsibilities:
 * - Configure API base URL based on platform
 * - Make HTTP requests to backend endpoints
 * - Handle AsyncStorage for tokens (frontend caching only)
 * - Return responses to callers
 *
 * Does NOT contain:
 * - Validation logic (belongs in backend)
 * - Database operations (belongs in backend/db)
 * - Business rules (belongs in backend)
 */

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

/**
 * Authentication API Endpoints
 * Pure HTTP client - all business logic is in backend/auth/*
 */
export const authApi = {
	/**
	 * Register new user
	 * Backend handles: validation, email check, password hashing, creating user with new_login=true & emailVerified=false
	 */
	register: async (userData: RegisterData): Promise<ApiResponse> => {
		return await apiCall('/auth/register', {
			method: 'POST',
			body: JSON.stringify(userData),
		})
	},

	/**
	 * Login user
	 * Backend handles: validation, user lookup, password verification, email_verify check, new_login check, JWT generation
	 * Returns: { token, user, needsEmailVerification?, needsProfileCreation? }
	 */
	login: async (credentials: LoginCredentials): Promise<ApiResponse> => {
		return await apiCall('/auth/login', {
			method: 'POST',
			body: JSON.stringify(credentials),
		})
	},

	/**
	 * Check authentication status
	 * Backend handles: JWT verification, user lookup
	 */
	checkAuthStatus: async (): Promise<ApiResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		if (!token) {
			return { success: false, error: 'No token found' }
		}

		return await apiCall('/auth/check-status', {
			method: 'POST',
			headers: { Authorization: `Bearer ${token}` },
		})
	},

	/**
	 * Logout user
	 * Backend handles: logging (future: token blacklist)
	 * Frontend handles: clearing AsyncStorage
	 */
	logout: async (): Promise<ApiResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		const response = await apiCall('/auth/logout', {
			method: 'POST',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		})

		// Clear local storage regardless of backend response
		await AsyncStorage.multiRemove(['authToken', 'user', 'lastActiveTimestamp'])

		return response
	},

	/**
	 * Change password
	 * Backend handles: validation, current password verification, password hashing, updating user
	 */
	changePassword: async (data: {
		currentPassword: string
		newPassword: string
		userId: number
	}): Promise<ApiResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall('/auth/change-password', {
			method: 'POST',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			body: JSON.stringify(data),
		})
	},

	/**
	 * Request password reset email
	 * Backend handles: user lookup, token generation, email sending
	 */
	requestPasswordReset: async (email: string): Promise<ApiResponse> => {
		return await apiCall('/auth/request-reset', {
			method: 'POST',
			body: JSON.stringify({ email }),
		})
	},

	/**
	 * Reset password with token
	 * Backend handles: token verification, password hashing, updating user
	 */
	resetPassword: async (data: {
		token: string
		newPassword: string
	}): Promise<ApiResponse> => {
		return await apiCall('/auth/reset-password', {
			method: 'POST',
			body: JSON.stringify(data),
		})
	},

	/**
	 * Verify email address
	 * Backend handles: user lookup, updating emailVerified status
	 */
	verifyEmail: async (data: {
		userId: number
		verificationCode: string
	}): Promise<ApiResponse> => {
		return await apiCall('/auth/verify-email', {
			method: 'POST',
			body: JSON.stringify(data),
		})
	},

	/**
	 * Resend email verification
	 * Backend handles: user lookup, sending verification email
	 */
	resendVerification: async (userId: number): Promise<ApiResponse> => {
		return await apiCall('/auth/resend-verification', {
			method: 'POST',
			body: JSON.stringify({ userId }),
		})
	},

	/**
	 * Check email verification status
	 * Backend handles: user lookup, returning emailVerified status
	 */
	checkEmailStatus: async (userId: number): Promise<ApiResponse> => {
		return await apiCall('/auth/email-status', {
			method: 'POST',
			body: JSON.stringify({ userId }),
		})
	},
}

/**
 * User Data API Endpoints
 * Note: User storage in AsyncStorage is handled by backend/user/getStoredUser.ts
 * These are HTTP endpoints if needed for server-side user operations
 */
export const userApi = {
	/**
	 * Update user profile
	 */
	updateProfile: async (data: Partial<User>): Promise<ApiResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall('/user/update-profile', {
			method: 'POST',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			body: JSON.stringify(data),
		})
	},

	/**
	 * Get user profile
	 */
	getProfile: async (userId: number): Promise<ApiResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall(`/user/profile/${userId}`, {
			method: 'GET',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		})
	},
}

/**
 * Debug/Testing API Endpoints
 * These call backend/debug/* modules for development testing
 */
export const debugApi = {
	/**
	 * Seed test users
	 * Backend handles: creating 6 test users with various states
	 */
	seedTestUsers: async (): Promise<ApiResponse> => {
		return await apiCall('/debug/seed-users', {
			method: 'POST',
		})
	},

	/**
	 * Clear test users
	 * Backend handles: deleting test users from database
	 */
	clearTestUsers: async (): Promise<ApiResponse> => {
		return await apiCall('/debug/clear-users', {
			method: 'POST',
		})
	},

	/**
	 * Test database connection
	 * Backend handles: running test queries
	 */
	testDatabase: async (): Promise<ApiResponse> => {
		return await apiCall('/debug/test-db', {
			method: 'GET',
		})
	},

	/**
	 * Get database statistics
	 * Backend handles: counting users by role and verification status
	 */
	getDatabaseStats: async (): Promise<ApiResponse> => {
		return await apiCall('/debug/db-stats', {
			method: 'GET',
		})
	},

	/**
	 * Health check
	 * Backend handles: server status, uptime, environment info
	 */
	healthCheck: async (): Promise<ApiResponse> => {
		return await apiCall('/debug/health', {
			method: 'GET',
		})
	},
}
