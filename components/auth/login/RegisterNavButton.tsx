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

const RegisterButton: React.FC = () => {
	const {colors} = useThemeContext()
	const responsive = useResponsiveDimensions()
	const loginStyles = createLoginStyles(colors, responsive)
	const { isLoading } = useAuthContext()
	const navigation = useAuthNavigation()

	const handleRegisterNavigation = () => {
		Keyboard.dismiss()
		setTimeout(() => {
			navigation.navigate('Register')
		}, 100)
	}

	return (
		<TouchableOpacity
			onPress={handleRegisterNavigation}
			disabled={isLoading}
			activeOpacity={isLoading ? 1 : 0.7}>
			<Text style={[loginStyles.signUpText, isLoading && { opacity: 0.5 }]}>
				Sign Up
			</Text>
		</TouchableOpacity>
	)
}

export default RegisterButton
