import AsyncStorage from '@react-native-async-storage/async-storage'

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
