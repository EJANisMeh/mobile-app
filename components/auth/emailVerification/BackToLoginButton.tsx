import React from 'react'
import { TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle } from 'react-native'
import { AuthStackParamList } from '../../../types/navigation'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createEmailVerificationStyles } from '../../../styles/auth'

interface BackToLoginButtonProps {
	handlePress: () => void
	purpose: AuthStackParamList['EmailVerification']['purpose']
}

const BackToLoginButton: React.FC<BackToLoginButtonProps> = ({
	purpose,
	handlePress,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const emailVerificationStyles = createEmailVerificationStyles(colors, responsive)

	return (
		<TouchableOpacity
			style={emailVerificationStyles.backToLoginButton}
			onPress={handlePress}>
			<Text style={emailVerificationStyles.backToLoginButtonText}>
				{purpose === 'password-reset'
					? 'Back to Forgot Password'
					: 'Back to Login'}
			</Text>
		</TouchableOpacity>
	)
}

export default BackToLoginButton
