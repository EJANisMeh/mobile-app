import React from 'react'
import {
	Keyboard,
	TouchableOpacity,
	Text,
	StyleProp,
} from 'react-native'
import { useAuthContext } from '../../../context'
import { useAuthNavigation } from '../../../hooks/useNavigation'

interface RegisteNavButtonProps {
	loginStyles: Record<string, StyleProp<any>>
}

const RegisterButton: React.FC<RegisteNavButtonProps> = ({ loginStyles }) => {
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
