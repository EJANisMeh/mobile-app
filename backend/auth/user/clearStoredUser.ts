/**
 * Clear stored user data
 * Called during logout
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { USER_DATA_KEY } from './constants'

export const clearStoredUser = async (): Promise<{ success: boolean }> => {
	try {
		await AsyncStorage.removeItem(USER_DATA_KEY)
		return { success: true }
	} catch (error) {
		console.error('Error clearing stored user:', error)
		return { success: false }
	}
}
