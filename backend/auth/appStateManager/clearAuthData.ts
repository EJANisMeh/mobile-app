/**
 * Clear all authentication data from AsyncStorage
 * Called when:
 * - User manually logs out
 * - Session expires due to inactivity
 * - App is terminated and restarted after timeout
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import { AUTH_TOKEN_KEY, USER_DATA_KEY, LAST_ACTIVE_KEY } from './constants'

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
