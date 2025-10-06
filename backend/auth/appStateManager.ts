/**
 * Backend App State Manager
 *
 * This module contains backend-related functions for managing authentication state
 * when the app goes to background, foreground, or gets terminated.
 *
 * The frontend app state manager (utils/appStateManager.ts) handles React Native
 * AppState events and calls these backend functions when needed.
 *
 * Functions:
 * - clearAuthData: Clear all authentication data from AsyncStorage
 * - validateSessionTimeout: Check if session has expired based on last active timestamp
 * - logSessionEvent: Log session events for analytics/debugging
 */

import AsyncStorage from '@react-native-async-storage/async-storage'

// Constants
const AUTH_TOKEN_KEY = 'authToken'
const USER_DATA_KEY = 'user'
const LAST_ACTIVE_KEY = 'lastActiveTimestamp'
const SESSION_TIMEOUT_MINUTES = 30 // Auto-logout after 30 minutes
const SESSION_TIMEOUT_MS = SESSION_TIMEOUT_MINUTES * 60 * 1000

/**
 * Clear all authentication data from AsyncStorage
 * Called when:
 * - User manually logs out
 * - Session expires due to inactivity
 * - App is terminated and restarted after timeout
 */
export const clearAuthData = async (): Promise<{
	success: boolean
	error?: string
}> => {
	try {
		await AsyncStorage.multiRemove([
			AUTH_TOKEN_KEY,
			USER_DATA_KEY,
			LAST_ACTIVE_KEY,
		])
		console.log('Auth data cleared successfully')
		return { success: true }
	} catch (error) {
		console.error('Error clearing auth data:', error)
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'Failed to clear auth data',
		}
	}
}

/**
 * Validate if the session has expired based on last active timestamp
 * Returns true if session is still valid, false if expired
 */
export const validateSessionTimeout = async (): Promise<{
	isValid: boolean
	timeSinceLastActive?: number
	lastActive?: Date
}> => {
	try {
		const lastActiveStr = await AsyncStorage.getItem(LAST_ACTIVE_KEY)

		if (!lastActiveStr) {
			// No session data found
			return { isValid: false }
		}

		const lastActive = parseInt(lastActiveStr)
		const now = Date.now()
		const timeDiff = now - lastActive

		const isValid = timeDiff <= SESSION_TIMEOUT_MS

		return {
			isValid,
			timeSinceLastActive: timeDiff,
			lastActive: new Date(lastActive),
		}
	} catch (error) {
		console.error('Error validating session timeout:', error)
		return { isValid: false }
	}
}

/**
 * Update the last active timestamp
 * Called whenever user interacts with the app
 */
export const updateLastActive = async (): Promise<{ success: boolean }> => {
	try {
		const timestamp = Date.now().toString()
		await AsyncStorage.setItem(LAST_ACTIVE_KEY, timestamp)
		return { success: true }
	} catch (error) {
		console.error('Error updating last active timestamp:', error)
		return { success: false }
	}
}

/**
 * Log session events for debugging/analytics
 */
export const logSessionEvent = (
	event: 'background' | 'foreground' | 'logout' | 'expired',
	userId?: number
): void => {
	const timestamp = new Date().toISOString()
	console.log(
		`[Session Event] ${event.toUpperCase()} - User: ${
			userId || 'N/A'
		} - Time: ${timestamp}`
	)

	// TODO: In production, send this to analytics service
	// TODO: Store session events in database for security auditing
}

/**
 * Get stored authentication token
 */
export const getStoredAuthToken = async (): Promise<string | null> => {
	try {
		return await AsyncStorage.getItem(AUTH_TOKEN_KEY)
	} catch (error) {
		console.error('Error getting auth token:', error)
		return null
	}
}

/**
 * Get stored user data
 */
export const getStoredUserData = async (): Promise<any | null> => {
	try {
		const userData = await AsyncStorage.getItem(USER_DATA_KEY)
		return userData ? JSON.parse(userData) : null
	} catch (error) {
		console.error('Error getting user data:', error)
		return null
	}
}
