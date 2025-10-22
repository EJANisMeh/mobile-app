import React from 'react'
import { TouchableOpacity, Text, Keyboard, StyleProp } from 'react-native'
import { UseAlertModalType } from '../../../hooks/useModals/useAlertModal'
import { useAuthContext } from '../../../context'
import { useAuthNavigation } from '../../../hooks/useNavigation'
import { createForgotPasswordStyles } from '../../../styles/auth'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'

interface RequestPassResetButtonProps {
	email: string
	showAlert: UseAlertModalType['showAlert']
	hideAlert: UseAlertModalType['hideAlert']
}

const RequestPassResetButton: React.FC<RequestPassResetButtonProps> = ({
	email,
	showAlert,
	hideAlert,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const forgotPasswordStyles = createForgotPasswordStyles(colors, responsive)
	const { isLoading, requestPasswordReset } = useAuthContext()
	const navigation = useAuthNavigation()

	const handleSendResetEmail = async () => {
		if (!email) {
			showAlert({
				title: 'Error',
				message: 'Please enter your email address',
			})
			return
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			showAlert({
				title: 'Error',
				message: 'Please enter a valid email address',
			})
			return
		}

		try {
			// Call backend to check if email exists and send reset email
			const result = await requestPasswordReset(email)
			const resetTitle = 'Password Reset'

			if (!result.success) {
				showAlert({
					title: resetTitle,
					message: result.message || 'Failed to send reset email',
				})
				return
			}

			if (!result.userId) {
				showAlert({
					title: 'Error',
					message: 'User ID not found for the provided email.',
				})
				return
			}

			showAlert({
				title: resetTitle,
				message: result.message,
				onClose: () => {
					hideAlert()
					// Navigate to EmailVerification with password-reset purpose
					navigation.navigate('EmailVerification', {
						userId: result.userId,
						purpose: 'password-reset',
					})
				},
			})
		} catch (error) {
			showAlert({
				title: 'Error',
				message: 'Failed to send reset email. Please try again.',
			})
		}
	}

	return (
		<TouchableOpacity
			style={[
				forgotPasswordStyles.submitButton,
				isLoading && forgotPasswordStyles.disabledButton,
			]}
			onPress={handleSendResetEmail}
			disabled={isLoading}>
			<Text style={forgotPasswordStyles.submitButtonText}>
				{isLoading ? 'Sending...' : 'Send Reset Instructions'}
			</Text>
		</TouchableOpacity>
	)
}

export default RequestPassResetButton
