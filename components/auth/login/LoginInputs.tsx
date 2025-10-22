import React from 'react'
import { TextInput } from 'react-native'
import { LoginCredentials } from '../../../types'
import { useAuthContext } from '../../../context'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createLoginStyles } from '../../../styles/auth'

interface LoginInputsProps {
	children?: React.ReactNode
	credentials: LoginCredentials
	setCredentials: React.Dispatch<React.SetStateAction<LoginCredentials>>
}

const LoginInputs: React.FC<LoginInputsProps> = ({
	credentials,
	setCredentials,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const loginStyles = createLoginStyles(colors, responsive)
	const { isLoading } = useAuthContext()
	const disabledInputStyle = {
		opacity: 0.6,
		backgroundColor: colors.surface,
	}
	const mergedDisabled = isLoading ? disabledInputStyle : undefined

	const handleEmailChange = (email: string) => {
		if (setCredentials) {
			setCredentials((prev) => ({ ...prev, email }))
		}
	}

	const handlePasswordChange = (password: string) => {
		if (setCredentials) {
			setCredentials((prev) => ({ ...prev, password }))
		}
	}

	return (
		<>
			<TextInput
				style={[loginStyles.input, mergedDisabled]}
				placeholder="Email (yourEmail@example.com)"
				value={credentials.email}
				onChangeText={handleEmailChange}
				keyboardType="email-address"
				autoCapitalize="none"
				autoCorrect={false}
				textContentType="none"
				importantForAutofill="no"
				contextMenuHidden={true}
				editable={!isLoading}
			/>

			<TextInput
				style={[loginStyles.input, mergedDisabled]}
				placeholder="Password"
				value={credentials.password}
				onChangeText={handlePasswordChange}
				secureTextEntry
				autoCapitalize="none"
				textContentType="none"
				importantForAutofill="no"
				contextMenuHidden={true}
				passwordRules=""
				editable={!isLoading}
			/>
		</>
	)
}

export default LoginInputs
