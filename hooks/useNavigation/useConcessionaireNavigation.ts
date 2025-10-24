import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ConcessionaireStackParamList } from '../../types/navigation'

export const useConcessionaireNavigation = () => {
  return useNavigation<StackNavigationProp<ConcessionaireStackParamList>>()
}
