import AsyncStorage from '@react-native-async-storage/async-storage'

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
