// Navigation related type definitions
import { UserType } from './userTypes'

export type RootStackParamList = {
	Auth: undefined
	Customer: undefined
	Concessionaire: undefined
}

export type AuthStackParamList = {
	Login: undefined
	Register: undefined
	ForgotPassword: undefined
	EmailVerification: {
		userId: number
		purpose: 'password-reset' | 'email-verification'
	}
	ChangePassword: { userId: number }
	ProfileCreation: { userId: number }
}

export type CustomerStackParamList = {
	Menu: undefined
	Cart: undefined
	Orders: undefined
	Notifications: undefined
	Profile: undefined
}

export type ConcessionaireStackParamList = {
	MainTabs: undefined
	Menu: undefined
	Orders: undefined
	Concession: undefined
	EditConcessionDetails: undefined
	ManagePaymentMethods: undefined
	CategoryManagement: undefined
	ScanQR: undefined
	Notifications: undefined
	Profile: undefined
	AddMenuItem: undefined
	EditMenuItem: { itemId: string }
}

export type NavigationProps = {
	userType?: UserType
}
