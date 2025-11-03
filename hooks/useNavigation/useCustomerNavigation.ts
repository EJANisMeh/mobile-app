import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { CustomerStackParamList } from '../../types/navigation'

export const useCustomerNavigation = () => {
	return useNavigation<StackNavigationProp<CustomerStackParamList>>()
}
