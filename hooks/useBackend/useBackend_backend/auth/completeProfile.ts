/**
 * Complete user profile
 * Updates user data and sets new_login to false
 */
import { AuthBackendType } from '../../../../types'
import { UserData } from '../../../../types/userTypes'
import { authApi } from '../../../../services/api'
import {
	storeAuthToken,
	storeUser,
} from '../../../../backend/auth/authAsyncData'

export const completeProfile = (
	setUser: (u: UserData) => void,
	setIsLoading: (v: boolean) => void,
	setError: (v: string | null) => void
): AuthBackendType['completeProfile'] => {
	return async (data) => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await authApi.completeProfile(data)

			if (!response.success || !response.user || !response.token) {
				setError(response.error || 'Profile completion failed')
				return {
					success: false,
					error: response.error || 'Profile completion failed',
				}
			}

			// Store new token (with updated new_login=false)
			await storeAuthToken(response.token)

			// Update local user state with new profile data
			const updatedUser = response.user as UserData
			setUser(updatedUser)
			await storeUser(updatedUser)

			return {
				success: true,
				user: updatedUser,
			}
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : 'Profile completion failed'
			setError(errorMsg)
			return {
				success: false,
				error: errorMsg,
			}
		} finally {
			setIsLoading(false)
		}
	}
}
