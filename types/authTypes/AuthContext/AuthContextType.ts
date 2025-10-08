import { AuthState, LoginCredentials, RegisterData } from '..'

export interface AuthContextType extends AuthState {
	login: (credentials: LoginCredentials) => Promise<boolean>
	register: (data: RegisterData) => Promise<boolean>
	logout: () => Promise<void>
}
