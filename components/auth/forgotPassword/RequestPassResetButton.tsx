import React from 'react'
import { TouchableOpacity, Text, Keyboard, StyleProp } from 'react-native'
import { UseAlertModalType } from '../../../hooks/useModals/useAlertModal'

import { useAuthContext } from '../../../context'
import { useAuthNavigation } from '../../../hooks/useNavigation'

interface RequestPassResetButtonProps {
	email: string
	forgotPasswordStyles: Record<string, StyleProp<any>>
	showAlert: UseAlertModalType['showAlert']
	hideAlert: UseAlertModalType['hideAlert']
}

const RequestPassResetButton: React.FC<RequestPassResetButtonProps> = ({
	email,
	forgotPasswordStyles,
	showAlert,
	hideAlert,
}) => {
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
			const success = await requestPasswordReset(email)
			const resetTitle = 'Password Reset'
			const resetMsg = 'Password reset request sent to the email'

			if (!success) {
				showAlert({
					title: resetTitle,
					message: resetMsg,
				})
				return
			}

			showAlert({
				title: resetTitle,
				message: resetMsg,
				onClose: () => {
					hideAlert()
					// Navigate to EmailVerification with password-reset purpose
					navigation.navigate('EmailVerification', {
						email,
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
