import React from 'react'
import {
	TouchableOpacity,
	Text,
} from 'react-native'
import { useAuthContext } from '../../../context'
import { createRegisterStyles } from '../../../styles/auth'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'

interface BackToLoginButtonProps {
	handlePress: () => void
}

const BackToLoginButton: React.FC<BackToLoginButtonProps> = ({
	handlePress,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const registerStyles = createRegisterStyles(colors, responsive)
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
