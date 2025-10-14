import { AuthState, LoginCredentials, RegisterData, RegisterResult } from '..'

export interface AuthContextType extends AuthState {
	login: (credentials: LoginCredentials) => Promise<{
		success: boolean
		needsProfileCreation?: boolean
		userId?: number
		token?: string
	}>
	register: (data: RegisterData) => Promise<RegisterResult>
	logout: () => Promise<void>
	requestPasswordReset: (email: string) => Promise<boolean>
	resetPassword: (
		emailOrUserId: string | number,
		newPassword: string
	) => Promise<boolean>
	verifyEmail: (data: {
		userId: number
		verificationCode: string
	}) => Promise<boolean>
	completeProfile: (data: {
		userId: number
		fname: string
		lname: string
		image_url?: string
		contact_details?: string[]
	}) => Promise<boolean>
}
