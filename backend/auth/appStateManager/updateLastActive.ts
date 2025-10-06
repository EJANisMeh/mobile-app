/**
 * Update the last active timestamp
 * Called whenever user interacts with the app
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LAST_ACTIVE_KEY } from './constants'

export const updateLastActive = async (): Promise<{ success: boolean }> => {
	try {
		const timestamp = Date.now().toString()
		await AsyncStorage.setItem(LAST_ACTIVE_KEY, timestamp)
		return { success: true }
	} catch (error) {
		console.error('Error updating last active timestamp:', error)
		return { success: false }
	}
}
