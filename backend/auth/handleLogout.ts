import AsyncStorage from '@react-native-async-storage/async-storage'
import { logoutUser } from './logout'

export const handleLogout = async (dispatch: any): Promise<void> => {
	try {
		// Call backend logout (optional for JWT)
		await logoutUser()

		// Remove stored data
		await AsyncStorage.removeItem('authToken')
		await AsyncStorage.removeItem('user')

		dispatch({ type: 'LOGOUT' })
	} catch (error) {
		console.error('Logout handler error:', error)

		// Even if backend call fails, still logout locally
		try {
			await AsyncStorage.removeItem('authToken')
			await AsyncStorage.removeItem('user')
			dispatch({ type: 'LOGOUT' })
		} catch (storageError) {
			console.error('Storage cleanup error:', storageError)
			dispatch({ type: 'LOGOUT' }) // Force logout even if storage fails
		}
	}
}
