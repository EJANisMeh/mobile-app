import { UserData } from '../userTypes'
import { ConcessionData } from '../concessionTypes'

// Type for API responses
export interface AuthApiResponse<T = any> {
  success: boolean
  data?: T
  user?: UserData
  userId?: number
  token?: string
  message?: string
  error?: string
  needsEmailVerification?: boolean
  needsProfileCreation?: boolean
}
