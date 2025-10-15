/**
 * Authentication API Endpoints
 * Pure HTTP client - all business logic is in backend/auth/*
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthApiResponse, LoginCredentials, RegisterData } from '../../types'
import { apiCall } from './api'

export const authApi = {
	/**
	 * Register new user
	 * Backend handles: validation, email check, password hashing, creating user with new_login=true & emailVerified=false
	 */
	register: async (userData: RegisterData): Promise<AuthApiResponse> => {
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
	login: async (credentials: LoginCredentials): Promise<AuthApiResponse> => {
		return await apiCall('/auth/login', {
			method: 'POST',
			body: JSON.stringify(credentials),
		})
	},

	/**
	 * Check authentication status
	 * Backend handles: JWT verification, user lookup
	 */
	checkAuthStatus: async (): Promise<AuthApiResponse> => {
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
	logout: async (): Promise<AuthApiResponse> => {
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
	}): Promise<AuthApiResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall('/auth/change-password', {
			method: 'POST',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			body: JSON.stringify(data),
		})
	},

	/**
	 * Complete user profile
	 * Backend handles: updating fname, lname, image_url, contact_details, setting new_login to false
	 */
	completeProfile: async (data: {
		userId: number
		fname: string
		lname: string
		image_url?: string
		contact_details?: string[]
	}): Promise<AuthApiResponse> => {
		return await apiCall('/auth/complete-profile', {
			method: 'POST',
			body: JSON.stringify(data),
		})
	},

	/**
	 * Request password reset email
	 * Backend handles: user lookup, token generation, email sending
	 */
	requestPasswordReset: async (email: string): Promise<AuthApiResponse> => {
		return await apiCall('/auth/request-reset', {
			method: 'POST',
			body: JSON.stringify({ email }),
		})
	},

	/**
	 * Reset password with email
	 * Backend handles: user lookup by email, password hashing, updating user
	 */
	resetPassword: async (data: {
		email?: string
		userId?: number
		newPassword: string
	}): Promise<AuthApiResponse> => {
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
	}): Promise<AuthApiResponse> => {
		return await apiCall('/auth/verify-email', {
			method: 'POST',
			body: JSON.stringify(data),
		})
	},

	/**
	 * Resend email verification
	 * Backend handles: user lookup, sending verification email
	 */
	resendVerification: async (userId: number): Promise<AuthApiResponse> => {
		return await apiCall('/auth/resend-verification', {
			method: 'POST',
			body: JSON.stringify({ userId }),
		})
	},

	/**
	 * Check email verification status
	 * Backend handles: user lookup, returning emailVerified status
	 */
	checkEmailStatus: async (userId: number): Promise<AuthApiResponse> => {
		return await apiCall('/auth/email-status', {
			method: 'POST',
			body: JSON.stringify({ userId }),
		})
	},
}
