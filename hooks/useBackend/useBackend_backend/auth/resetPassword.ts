/**
 * Reset password with email
 */
import { AuthBackendType } from '../../../../types'
import { authApi } from '../../../../services/api'

export const resetPassword = (): AuthBackendType['resetPassword'] =>
{
  return async (data) =>
  {
    try
    {
      const response = await authApi.resetPassword(data)
      if (!response.success)
      {
        return {
          success: false,
          error: response.error || 'Password reset failed',
        }
      }

      return {
        success: true,
        message: response.message || 'Password reset successful',
      }
    } catch (error)
    {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset failed',
      }
    }
  }
}
