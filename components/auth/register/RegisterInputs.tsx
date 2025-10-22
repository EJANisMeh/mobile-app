import React from 'react'
import { TextInput } from 'react-native'
import type { RegisterData } from '../../../types'
import { useAuthContext } from '../../../context'
import { createRegisterStyles } from '../../../styles/auth'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'

interface RegisterInputsProps {
	formData: RegisterData
	updateField: (field: keyof RegisterData, value: string) => void
}

const RegisterInputs: React.FC<RegisterInputsProps> = ({
	formData,
	updateField,
}) =>
{
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const registerStyles = createRegisterStyles(colors, responsive)
  const { isLoading } = useAuthContext()

	return (
		<>
			<TextInput
				style={registerStyles.input}
				placeholder="Email (yourEmail@example.com)"
				value={formData.email}
				onChangeText={(value) => updateField('email', value)}
				keyboardType="email-address"
				autoCapitalize="none"
				autoCorrect={false}
				editable={!isLoading}
			/>

			<TextInput
				style={registerStyles.input}
				placeholder="Password"
				value={formData.password}
				onChangeText={(value) => updateField('password', value)}
				secureTextEntry
				autoCapitalize="none"
				editable={!isLoading}
			/>

			<TextInput
				style={registerStyles.input}
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
