import React from 'react'
import { TouchableOpacity, Text, Keyboard, StyleProp } from 'react-native'
import { useAuthNavigation } from '../../../hooks/useNavigation'

interface BackToLoginButtonProps {
	forgotPasswordStyles: Record<string, StyleProp<any>>
}

const BackToLoginButton: React.FC<BackToLoginButtonProps> = ({
	forgotPasswordStyles,
}) => {
	const navigation = useAuthNavigation()

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
