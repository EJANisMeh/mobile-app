import React from 'react'
import { TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle } from 'react-native'
import { UseAlertModalType } from '../../../hooks/useModals/types'
import { AuthStackParamList } from '../../../types/navigation'
import { useAuthNavigation } from '../../../hooks/useNavigation'

interface BackToLoginButtonProps
{
  emailVerificationStyles: {
    backToLoginButton: StyleProp<ViewStyle>
    backToLoginButtonText: StyleProp<TextStyle>
  }
  purpose: AuthStackParamList['EmailVerification']['purpose']
  showAlert: UseAlertModalType['showAlert']
}

const BackToLoginButton: React.FC<BackToLoginButtonProps> = ({
	emailVerificationStyles,
	purpose,
	showAlert,
}) => {
  const navigation = useAuthNavigation()

	const handleBackToLogin = async () => {
		if (purpose === 'password-reset') {
			navigation.goBack()
		} else {
			try {
				navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
			} catch (error) {
				showAlert({
					title: 'Error',
					message: 'Failed to logout. Please try again.',
				})
			}
		}
  }
  
	return (
		<TouchableOpacity
			style={emailVerificationStyles.backToLoginButton}
			onPress={handleBackToLogin}>
			<Text style={emailVerificationStyles.backToLoginButtonText}>
				{purpose === 'password-reset'
					? 'Back to Forgot Password'
					: 'Back to Login'}
			</Text>
		</TouchableOpacity>
	)
}

export default BackToLoginButton
