import React from 'react'
import {
	TouchableOpacity,
	Text,
	StyleProp,
} from 'react-native'
import { useAuthContext } from '../../../context'

interface BackToLoginButtonProps {
	registerStyles: Record<string, StyleProp<any>>
	handlePress: () => void
}

const BackToLoginButton: React.FC<BackToLoginButtonProps> = ({
	registerStyles,
	handlePress,
}) => {
	const { isLoading } = useAuthContext()

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
