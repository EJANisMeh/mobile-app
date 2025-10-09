/**
 * Store user data in AsyncStorage
 * Called after successful login or registration
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserData } from '../../../types/userTypes'
export const storeUser = async (
	user: Omit<UserData, 'passwordHash'>
): Promise<{ success: boolean }> => {
	try {
		await AsyncStorage.setItem('user', JSON.stringify(user))
		return { success: true }
	} catch (error) {
		console.error('Error storing user:', error)
		return { success: false }
	}
}
