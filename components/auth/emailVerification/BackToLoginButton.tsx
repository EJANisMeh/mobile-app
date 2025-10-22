import React from 'react'
import { TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle } from 'react-native'
import { UseAlertModalType } from '../../../hooks/useModals/types'
import { AuthStackParamList } from '../../../types/navigation'
import { useAuthNavigation } from '../../../hooks/useNavigation'

interface BackToLoginButtonProps {
	emailVerificationStyles: {
		backToLoginButton: StyleProp<ViewStyle>
		backToLoginButtonText: StyleProp<TextStyle>
	}
	handlePress: () => void
	purpose: AuthStackParamList['EmailVerification']['purpose']
}

const BackToLoginButton: React.FC<BackToLoginButtonProps> = ({
	emailVerificationStyles,
	purpose,
	handlePress,
}) => {
  const navigation = useAuthNavigation()


  
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
