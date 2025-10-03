import { AuthResponse } from '../../types/auth'

export const logoutUser = async (): Promise<AuthResponse> => {
	try {
		// In a JWT-based system, logout is typically handled on the client side
		// by removing the token from storage. No server-side action is needed.
		// However, you could implement token blacklisting here if needed.

		return {
			success: true,
			message: 'Logout successful',
		}
	} catch (error) {
		console.error('Logout error:', error)
		return {
			success: false,
			error: 'Logout failed. Please try again.',
		}
	}
}
