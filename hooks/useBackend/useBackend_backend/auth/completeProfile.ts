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
	setUser: (u: UserData) => void
): AuthBackendType['completeProfile'] => {
	return async (data) => {
		try {
			const response = await authApi.completeProfile(data)

			if (!response.success || !response.user || !response.token) {
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
			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Profile completion failed',
			}
		}
	}
}
