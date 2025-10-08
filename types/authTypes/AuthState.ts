import { UserData } from '../userTypes'

export type AuthState = {
	user: Omit<UserData, 'passwordHash'> | null
	isAuthenticated: boolean
	isLoading: boolean
	error: string | null
}
