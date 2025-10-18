import React from 'react'
import { TextInput, StyleProp, TextStyle } from 'react-native'
import { LoginCredentials } from '../../../types'
import { useAuthContext } from '../../../context'

interface LoginInputsProps {
	children?: React.ReactNode
	credentials: LoginCredentials
	setCredentials: React.Dispatch<React.SetStateAction<LoginCredentials>>
	inputStyle: StyleProp<TextStyle>
	disabledInputStyle: StyleProp<TextStyle>
}

const LoginInputs: React.FC<LoginInputsProps> = ({
	credentials,
	setCredentials,
	inputStyle,
	disabledInputStyle,
}) =>
{
  const { isLoading } = useAuthContext()
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
				style={[inputStyle, mergedDisabled]}
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
				style={[inputStyle, mergedDisabled]}
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
