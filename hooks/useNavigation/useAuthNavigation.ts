import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { AuthStackParamList } from '../../types/navigation'

export const useAuthNavigation = () => {
	return useNavigation<StackNavigationProp<AuthStackParamList>>()
}
