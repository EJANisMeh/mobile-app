import React from 'react'
import { TextInput} from 'react-native'
import { useAuthContext } from '../../../context'
import { createForgotPasswordStyles } from '../../../styles/auth'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'

interface ForgotPassEmailInputProps {
	email: string
	setEmail: (email: string) => void
}

const ForgotPassEmailInput: React.FC<ForgotPassEmailInputProps> = ({
	email,
	setEmail,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const forgotPasswordStyles = createForgotPasswordStyles(colors, responsive)
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
