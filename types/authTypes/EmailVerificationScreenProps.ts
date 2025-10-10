import type { AuthStackParamList } from '../navigation'
import type { StackScreenProps } from '@react-navigation/stack'

export type EmailVerificationScreenProps = StackScreenProps<
	AuthStackParamList,
	'EmailVerification'
>
