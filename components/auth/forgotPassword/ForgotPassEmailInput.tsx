import React from 'react'
import { TextInput, StyleProp, TextStyle } from 'react-native'
import { useAuthContext } from '../../../context'

interface ForgotPassEmailInputProps {
	email: string
	setEmail: (email: string) => void
	forgotPasswordStyles: Record<string, StyleProp<any>>
}

const ForgotPassEmailInput: React.FC<ForgotPassEmailInputProps> = ({
	email,
	setEmail,
	forgotPasswordStyles,
}) => {
	const { isLoading } = useAuthContext()

	return (
		<TextInput
			style={forgotPasswordStyles.input}
			placeholder="Email Address"
			value={email}
			onChangeText={setEmail}
			keyboardType="email-address"
			autoCapitalize="none"
			autoCorrect={false}
			editable={!isLoading}
		/>
	)
}

export default ForgotPassEmailInput
