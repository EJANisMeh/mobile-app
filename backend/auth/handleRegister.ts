import { registerUser } from './register'
import { RegisterData } from '../../types/auth'

export const handleRegister = async (
	data: RegisterData,
	dispatch: any
): Promise<boolean> => {
	try {
		dispatch({ type: 'SET_LOADING', payload: true })
		dispatch({ type: 'SET_ERROR', payload: null })

		const response = await registerUser(data)

		if (response.success) {
			dispatch({ type: 'SET_LOADING', payload: false })
			return true
		} else {
			dispatch({
				type: 'SET_ERROR',
				payload: response.error || 'Registration failed',
			})
			return false
		}
	} catch (error) {
		console.error('Registration handler error:', error)
		dispatch({
			type: 'SET_ERROR',
			payload: 'Registration failed. Please try again.',
		})
		return false
	}
}
