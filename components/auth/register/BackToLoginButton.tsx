import React from 'react'
import {
	TouchableOpacity,
	Text,
	Keyboard,
	StyleProp,
} from 'react-native'
import { useAuthContext } from '../../../context'
import { useAuthNavigation } from '../../../hooks/useNavigation/useAuthNavigation'

interface BackToLoginButtonProps {
	registerStyles: Record<string, StyleProp<any>>
}

const BackToLoginButton: React.FC<BackToLoginButtonProps> = ({
	registerStyles,
}) => {
	const { isLoading } = useAuthContext()
	const navigation = useAuthNavigation()

	const handlePress = () => {
		Keyboard.dismiss()
		setTimeout(() => navigation.navigate('Login'), 100)
	}

	return (
		<TouchableOpacity
			onPress={handlePress}
			disabled={isLoading}
			activeOpacity={isLoading ? 1 : 0.7}>
			<Text style={[registerStyles.signInText, isLoading && { opacity: 0.5 }]}>
				Sign In
			</Text>
		</TouchableOpacity>
	)
}

export default BackToLoginButton
