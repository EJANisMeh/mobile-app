import { UserData } from '../userTypes'
import { LoginCredentials, RegisterData } from '.'

export interface AuthBackendType {
	user: UserData | null
	isAuthenticated: boolean
	isLoading: boolean
	error: string | null
	login: (credentials: LoginCredentials) => Promise<{
		success: boolean
		error?: string
		user?: UserData
		token?: string
		needsEmailVerification?: boolean
		needsProfileCreation?: boolean
		message?: string
	}>
	register: (data: RegisterData) => Promise<{
		success: boolean
		error?: string
		userId?: number
		token?: string
		needsEmailVerification?: boolean
	}>
	logout: () => Promise<{ success: boolean }>
	checkAuthStatus: () => Promise<{
		success: boolean
		user?: UserData
		error?: string
	}>
	changePassword: (data: {
		currentPassword: string
		newPassword: string
		userId: number
	}) => Promise<{ success: boolean; error?: string }>
	completeProfile: (data: {
		userId: number
		fname: string
		lname: string
		image_url?: string
		contact_details?: string[]
	}) => Promise<{ success: boolean; error?: string; user?: UserData }>
	verifyEmail: (data: {
		userId: number
		verificationCode: string
	}) => Promise<{ success: boolean; error?: string }>
	resendVerification: (userId: number) => Promise<{
		success: boolean
		error?: string
	}>
	requestPasswordReset: (email: string) => Promise<{
		success: boolean
		error?: string
	}>
	resetPassword: (data: {
		email?: string
		userId?: number
		newPassword: string
	}) => Promise<{ success: boolean; error?: string }>
}
