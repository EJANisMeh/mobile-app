import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserData } from '../../../types/user'
import { USER_DATA_KEY } from './constants'

/**
 * Get stored user data from AsyncStorage
 * This is a frontend utility that retrieves cached user data
 *
 * Process:
 * 1. Retrieve user data from AsyncStorage
 * 2. Parse JSON string to User object
 * 3. Return user data or null if not found
 */
export const getStoredUser = async (): Promise<UserData | null> => {
	try {
		const userData = await AsyncStorage.getItem(USER_DATA_KEY)

		if (!userData) {
			return null
		}

		const user: UserData = JSON.parse(userData)
		return user
	} catch (error) {
		console.error('Error getting stored user:', error)
		return null
	}
}
