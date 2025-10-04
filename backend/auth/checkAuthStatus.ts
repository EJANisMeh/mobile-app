import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '../../types/auth'

export const checkAuthStatus = async (
	dispatch?: any
): Promise<{
	user: Omit<User, 'passwordHash'> | null
	token: string | null
}> => {
	try {
		const token = await AsyncStorage.getItem('authToken')
		const userString = await AsyncStorage.getItem('user')

		if (token && userString) {
			const user = JSON.parse(userString)

			// If dispatch is provided, update the state
			if (dispatch) {
				dispatch({ type: 'SET_USER', payload: user })
			}

			return { user, token }
		}

		// If dispatch is provided, set loading to false
		if (dispatch) {
			dispatch({ type: 'SET_LOADING', payload: false })
		}

		return { user: null, token: null }
	} catch (error) {
		console.error('Error checking auth status:', error)

		// If dispatch is provided, set loading to false
		if (dispatch) {
			dispatch({ type: 'SET_LOADING', payload: false })
		}

		return { user: null, token: null }
	}
}
