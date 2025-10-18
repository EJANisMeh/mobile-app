import React from 'react'
import { TextInput, StyleProp, TextStyle } from 'react-native'
import type { RegisterData } from '../../../types'
import { useAuthContext } from '../../../context'

interface RegisterInputsProps {
	formData: RegisterData
	inputStyle: StyleProp<TextStyle>
	updateField: (field: keyof RegisterData, value: string) => void
}

const RegisterInputs: React.FC<RegisterInputsProps> = ({
	formData,
	inputStyle,
	updateField,
}) =>
{
  const { isLoading } = useAuthContext()

	return (
		<>
			<TextInput
				style={inputStyle}
				placeholder="Email (yourEmail@example.com)"
				value={formData.email}
				onChangeText={(value) => updateField('email', value)}
				keyboardType="email-address"
				autoCapitalize="none"
				autoCorrect={false}
				editable={!isLoading}
			/>

			<TextInput
				style={inputStyle}
				placeholder="Password"
				value={formData.password}
				onChangeText={(value) => updateField('password', value)}
				secureTextEntry
				autoCapitalize="none"
				editable={!isLoading}
			/>

			<TextInput
				style={inputStyle}
				placeholder="Confirm Password"
				value={formData.confirmPassword}
				onChangeText={(value) => updateField('confirmPassword', value)}
				secureTextEntry
				autoCapitalize="none"
				editable={!isLoading}
			/>
		</>
	)
}

export default RegisterInputs
