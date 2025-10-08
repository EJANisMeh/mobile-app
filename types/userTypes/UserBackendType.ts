import { UserData } from '.'

export interface UserBackendType {
	user: UserData | null
	setUser: React.Dispatch<React.SetStateAction<UserData | null>>
}
