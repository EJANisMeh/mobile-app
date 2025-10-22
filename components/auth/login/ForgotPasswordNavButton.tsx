import React from 'react'
import {
	Keyboard,
	TouchableOpacity,
	Text,
} from 'react-native'
import { useAuthContext } from '../../../context'
import { useAuthNavigation } from '../../../hooks/useNavigation'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createLoginStyles } from '../../../styles/auth'

const ForgotPasswordButton: React.FC = () => {
	const {colors} = useThemeContext()
	const responsive = useResponsiveDimensions()
	const loginStyles = createLoginStyles(colors, responsive)
	const { isLoading } = useAuthContext()
	const navigation = useAuthNavigation()

	const handleForgotPassword = () => {
		Keyboard.dismiss()
		setTimeout(() => {
			navigation.navigate('ForgotPassword')
		}, 100)
	}

	return (
		<TouchableOpacity
			style={loginStyles.forgotPassword}
			onPress={handleForgotPassword}
			disabled={isLoading}
			activeOpacity={isLoading ? 1 : 0.7}>
			<Text
				style={[loginStyles.forgotPasswordText, isLoading && { opacity: 0.5 }]}>
				Forgot Password?
			</Text>
		</TouchableOpacity>
	)
}

export default ForgotPasswordButton
