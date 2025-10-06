/**
 * Get stored authentication token
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AUTH_TOKEN_KEY } from './constants'

export const getStoredAuthToken = async (): Promise<string | null> => {
	try {
		return await AsyncStorage.getItem(AUTH_TOKEN_KEY)
	} catch (error) {
		console.error('Error getting auth token:', error)
		return null
	}
}
