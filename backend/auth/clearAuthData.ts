import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Debug function to clear all stored authentication data
 * Use this for testing when you want to reset the auth state
 */
export const clearAuthData = async (): Promise<void> => {
	try {
		await AsyncStorage.removeItem('authToken')
		await AsyncStorage.removeItem('user')
		await AsyncStorage.removeItem('app_last_active_timestamp')
		console.log('Auth data cleared successfully')
	} catch (error) {
		console.error('Error clearing auth data:', error)
	}
}

/**
 * Debug function to log what's currently stored in AsyncStorage
 */
export const logStoredAuthData = async (): Promise<void> => {
	try {
		const token = await AsyncStorage.getItem('authToken')
		const userString = await AsyncStorage.getItem('user')
		const lastActiveString = await AsyncStorage.getItem(
			'app_last_active_timestamp'
		)

		console.log('=== Stored Auth Data ===')
		console.log('Token:', token)
		console.log('User:', userString ? JSON.parse(userString) : null)
		console.log(
			'Last Active:',
			lastActiveString
				? new Date(parseInt(lastActiveString)).toISOString()
				: null
		)
		if (lastActiveString) {
			const timeDiff = Date.now() - parseInt(lastActiveString)
			console.log(
				'Time since last active:',
				Math.round(timeDiff / 1000),
				'seconds'
			)
		}
		console.log('========================')
	} catch (error) {
		console.error('Error reading stored auth data:', error)
	}
}

/**
 * Debug function to simulate app termination by setting an old timestamp
 */
export const simulateAppTermination = async (): Promise<void> => {
	try {
		// Set timestamp to 60 seconds ago to simulate termination
		const oldTimestamp = (Date.now() - 60000).toString()
		await AsyncStorage.setItem('app_last_active_timestamp', oldTimestamp)
		console.log('Simulated app termination - set timestamp to 60 seconds ago')
		console.log('Restart the app to test termination detection')
	} catch (error) {
		console.error('Error simulating app termination:', error)
	}
}
