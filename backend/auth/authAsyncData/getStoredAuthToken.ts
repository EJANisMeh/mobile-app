import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Get stored auth token from AsyncStorage
 */
export const getStoredAuthToken = async (): Promise<string | null> => {
	try {
		return await AsyncStorage.getItem('authToken')
	} catch (error) {
		console.error('Error getting stored token:', error)
		return null
	}
}
