import AsyncStorage from '@react-native-async-storage/async-storage'
import { loginUser } from './login'
import { LoginCredentials } from '../../types/auth'

export const handleLogin = async (
	credentials: LoginCredentials,
	dispatch: any
): Promise<boolean> => {
	try {
		dispatch({ type: 'SET_LOADING', payload: true })
		dispatch({ type: 'SET_ERROR', payload: null })

		const response = await loginUser(credentials)

		if (response.success && response.user && response.token) {
			// Store token and user data
			await AsyncStorage.setItem('authToken', response.token)
			await AsyncStorage.setItem('user', JSON.stringify(response.user))

			dispatch({
				type: 'LOGIN_SUCCESS',
				payload: { user: response.user, token: response.token },
			})
			return true
		} else {
			dispatch({
				type: 'SET_ERROR',
				payload: response.error || 'Login failed',
			})
			return false
		}
	} catch (error) {
		console.error('Login handler error:', error)
		dispatch({
			type: 'SET_ERROR',
			payload: 'Login failed. Please try again.',
		})
		return false
	}
}
