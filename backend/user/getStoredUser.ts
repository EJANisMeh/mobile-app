import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '../../types/auth'

const USER_DATA_KEY = 'user'

/**
 * Get stored user data from AsyncStorage
 * This is a frontend utility that retrieves cached user data
 *
 * Process:
 * 1. Retrieve user data from AsyncStorage
 * 2. Parse JSON string to User object
 * 3. Return user data or null if not found
 */
export const getStoredUser = async (): Promise<User | null> => {
	try {
		const userData = await AsyncStorage.getItem(USER_DATA_KEY)

		if (!userData) {
			return null
		}

		const user: User = JSON.parse(userData)
		return user
	} catch (error) {
		console.error('Error getting stored user:', error)
		return null
	}
}

/**
 * Store user data in AsyncStorage
 * Called after successful login or registration
 */
export const storeUser = async (
	user: Omit<User, 'passwordHash'>
): Promise<{ success: boolean }> => {
	try {
		await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
		return { success: true }
	} catch (error) {
		console.error('Error storing user:', error)
		return { success: false }
	}
}

/**
 * Clear stored user data
 * Called during logout
 */
export const clearStoredUser = async (): Promise<{ success: boolean }> => {
	try {
		await AsyncStorage.removeItem(USER_DATA_KEY)
		return { success: true }
	} catch (error) {
		console.error('Error clearing stored user:', error)
		return { success: false }
	}
}

/**
 * Get stored auth token from AsyncStorage
 */
export const getStoredToken = async (): Promise<string | null> => {
	try {
		return await AsyncStorage.getItem('authToken')
	} catch (error) {
		console.error('Error getting stored token:', error)
		return null
	}
}

/**
 * Store auth token in AsyncStorage
 */
export const storeAuthToken = async (
	token: string
): Promise<{ success: boolean }> => {
	try {
		await AsyncStorage.setItem('authToken', token)
		return { success: true }
	} catch (error) {
		console.error('Error storing auth token:', error)
		return { success: false }
	}
}

/**
 * Clear all authentication data from AsyncStorage
 * Removes: authToken, user, lastActiveTimestamp
 */
export const clearAuthData = async (): Promise<{ success: boolean }> => {
	try {
		await AsyncStorage.multiRemove(['authToken', 'user', 'lastActiveTimestamp'])
		return { success: true }
	} catch (error) {
		console.error('Error clearing auth data:', error)
		return { success: false }
	}
}

/**
 * Store complete authentication data (token + user)
 * Called after successful login/register
 */
export const storeAuthData = async (
	token: string,
	user: User
): Promise<{ success: boolean }> => {
	try {
		await AsyncStorage.setItem('authToken', token)
		await AsyncStorage.setItem('user', JSON.stringify(user))
		await AsyncStorage.setItem('lastActiveTimestamp', Date.now().toString())
		return { success: true }
	} catch (error) {
		console.error('Error storing auth data:', error)
		return { success: false }
	}
}
