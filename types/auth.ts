import { UserData } from './user'

export type AuthState = {
	user: Omit<UserData, 'passwordHash'> | null
	isAuthenticated: boolean
	isLoading: boolean
	error: string | null
}

export type LoginCredentials = {
	email: string
	password: string
}

export type RegisterData = {
	fname: string
	lname: string
	email: string
	contact_details?: any
	password: string
	confirmPassword: string
	role: string
}

export type AuthResponse = {
	success: boolean
	user?: Omit<UserData, 'passwordHash'>
	token?: string
	error?: string
	message?: string
	needsEmailVerification?: boolean
}

export type ResetPasswordData = {
	email: string
}

export type ChangePasswordData = {
	currentPassword: string
	newPassword: string
	confirmPassword: string
}

export type EmailVerificationData = {
	token: string
	email: string
}

export interface AuthBackendType {
	user: UserData | null
	login: (credentials: LoginCredentials) => Promise<{
		success: boolean
		error?: string
		user?: UserData
		token?: string
		needsEmailVerification?: boolean
		needsProfileCreation?: boolean
	}>
	register: (data: RegisterData) => Promise<{
		success: boolean
		error?: string
		user?: UserData
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
		token: string
		newPassword: string
	}) => Promise<{ success: boolean; error?: string }>
}
