import React from 'react'
import {
	ActivityIndicator,
	TouchableOpacity,
	Text,
	StyleProp,
	ViewStyle,
	TextStyle,
} from 'react-native'

import { AuthStackParamList } from '../../../types/navigation'
import { UseAlertModalType } from '../../../hooks/useModals/types'
import { useAuthNavigation } from '../../../hooks/useNavigation'
import { useAuthContext, useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createEmailVerificationStyles } from '../../../styles/auth'


interface VerifyCodeButtonProps {
  purpose: AuthStackParamList['EmailVerification']['purpose']
  userId: number
	code: string[]
	isVerifying: boolean
	setIsVerifying: React.Dispatch<React.SetStateAction<boolean>>
  showAlert: UseAlertModalType['showAlert']
  hideAlert: UseAlertModalType['hideAlert']
}

const VERIFICATION_CODE = '123456'

const VerifyCodeButton: React.FC<VerifyCodeButtonProps> = ({
  purpose,
  userId,
	code,
	isVerifying,
	setIsVerifying,
  showAlert,
  hideAlert
}) =>
{
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const emailVerificationStyles = createEmailVerificationStyles(colors, responsive)
  const navigation = useAuthNavigation()
  const { verifyEmail } = useAuthContext()

	const handleVerifyCode = async () => {
		const enteredCode = code.join('')

		if (enteredCode.length !== 6) {
			showAlert({
				title: 'Error',
				message: 'Please enter the complete 6-digit verification code.',
			})
			return
		}

		if (enteredCode !== VERIFICATION_CODE) {
			showAlert({
				title: 'Error',
				message: 'Invalid verification code. Please try again.',
			})
			return
		}

		setIsVerifying(true)
		try {
			if (purpose === 'password-reset') {
				// Navigate to change password screen for password reset
				showAlert({
					title: 'Success',
					message: 'Email verified! You can now reset your password.',
					onClose: () => {
						hideAlert()
						navigation.navigate('ChangePassword', { userId: userId! })
					},
				})
			} else {
				// Email verification purpose - update email_verified field
				if (!userId) {
					showAlert({
						title: 'Error',
						message: 'User ID is missing. Please try registering again.',
					})
					return
				}

				const success = await verifyEmail({
					userId,
					verificationCode: enteredCode,
				})

				if (success) {
					showAlert({
						title: 'Success',
						message: 'Your email has been verified successfully!',
						onClose: () => {
							hideAlert()
							navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
						},
					})
				} else {
					showAlert({
						title: 'Error',
						message: 'Failed to verify email. Please try again.',
					})
				}
			}
		} catch (error) {
			showAlert({
				title: 'Error',
				message: 'Failed to verify code. Please try again.',
			})
		} finally {
			setIsVerifying(false)
		}
	}

	return (
		<TouchableOpacity
			style={[
				emailVerificationStyles.primaryButton,
				isVerifying && emailVerificationStyles.disabledButton,
			]}
			onPress={handleVerifyCode}
			disabled={isVerifying}>
			{isVerifying ? (
				<ActivityIndicator
					color="#fff"
					size="small"
				/>
			) : (
				<Text style={emailVerificationStyles.primaryButtonText}>
					Verify Code
				</Text>
			)}
		</TouchableOpacity>
	)
}

export default VerifyCodeButton
