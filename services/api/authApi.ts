/**
 * Authentication API Endpoints
 * Pure HTTP client - all business logic is in backend/auth/*
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ApiResponse, LoginCredentials, RegisterData } from '../../types'
import { apiCall } from './api'

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
