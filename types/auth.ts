// Authentication related type definitions
export type User = {
	id: number
	role: string
	fname: string | null
	lname: string | null
	email: string
	passwordHash: string
	new_login: boolean
	emailVerified: boolean
	contact_details: any // JsonValue from Prisma
	image_url: string | null
	concession_id: number | null
	createdAt: Date
	updatedAt: Date
}

export type UserType =
	| 'CUSTOMER'
	| 'CAFETERIA_ADMIN'
	| 'CONCESSION_OWNER'
	| 'SYSTEM_ADMIN'

export type AuthState = {
	user: Omit<User, 'passwordHash'> | null
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
	user?: Omit<User, 'passwordHash'>
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
