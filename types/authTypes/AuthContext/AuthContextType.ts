import { AuthState, LoginCredentials, RegisterData, RegisterResult } from '..'

export interface AuthContextType extends AuthState {
	login: (credentials: LoginCredentials) => Promise<boolean>
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
}
