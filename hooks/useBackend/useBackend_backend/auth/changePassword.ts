/**
 * Change user password
 */
import { AuthBackendType } from '../../../../types'
import { authApi } from '../../../../services/api'

export const changePassword = (): AuthBackendType['changePassword'] => {
	return async (data) => {
		try {
      const response = await authApi.changePassword(data)
      if (!response.success)
      {
        return {
          success: false,
          error: response.error || 'Password change failed',
        }
      }

			return {
				success: response.success,
				message: response.message,
			}
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Password change failed',
			}
		}
	}
}
