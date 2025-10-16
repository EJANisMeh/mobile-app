/**
 * Request password reset email
 */
import { AuthBackendType } from '../../../../types'
import { authApi } from '../../../../services/api'

export const requestPasswordReset = (): AuthBackendType['requestPasswordReset'] =>
{
  return async (email) =>
  {
    try
    {
      const response = await authApi.requestPasswordReset(email)
      if (!response.success)
      {
        return {
          success: false,
          error: response.error || 'Password reset request failed',
        }
      }

      return {
        success: response.success,
        message: response.message,
      }
    } catch (error)
    {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Password reset request failed',
      }
    }
  }
}
