import { UserData } from '../userTypes'
export type AuthResponse = {
	success: boolean
	user?: Omit<UserData, 'passwordHash'>
	token?: string
	error?: string
	message?: string
	needsEmailVerification?: boolean
}
