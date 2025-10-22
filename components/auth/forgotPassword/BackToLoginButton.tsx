import React from 'react'
import { TouchableOpacity, Text, Keyboard } from 'react-native'
import { useAuthNavigation } from '../../../hooks/useNavigation'
import { createForgotPasswordStyles } from '../../../styles/auth'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'

const BackToLoginButton: React.FC = () => {
	const navigation = useAuthNavigation()
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const forgotPasswordStyles = createForgotPasswordStyles(colors, responsive)

	const handlePress = () => {
		Keyboard.dismiss()
		setTimeout(() => navigation.goBack(), 100)
	}

	return (
		<TouchableOpacity
			style={forgotPasswordStyles.backButton}
			onPress={handlePress}>
			<Text style={forgotPasswordStyles.backButtonText}>Back to Login</Text>
		</TouchableOpacity>
	)
}

export default BackToLoginButton
