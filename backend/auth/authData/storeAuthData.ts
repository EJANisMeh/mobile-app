/**
 * Store complete authentication data (token + user)
 * Called after successful login/register
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserData } from '../../../types/userTypes'

export const storeAuthData = async (
	token: string,
	user: UserData
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
