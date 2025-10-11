import { UserData } from '../userTypes'
// Type for API responses
export interface ApiResponse<T = any> {
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