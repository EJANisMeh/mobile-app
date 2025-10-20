import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from 'react-native'
import { useAuthContext, useThemeContext } from '../../../context'
import { AlertModal } from '../../../components'
import { useAlertModal, useResponsiveDimensions } from '../../../hooks'
import type { AuthStackParamList } from '../../../types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'
import { createForgotPasswordStyles } from '../../../styles/themedStyles'
import DynamicScrollView from '../../../components/DynamicScrollView'

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
	AuthStackParamList,
	'ForgotPassword'
>

interface ForgotPasswordScreenProps {
	navigation: ForgotPasswordScreenNavigationProp
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
	navigation,
}) => {
	const { colors } = useThemeContext()
	const { error, requestPasswordReset } = useAuthContext()
	const forgotPasswordStyles = createForgotPasswordStyles(colors)
	const responsive = useResponsiveDimensions()
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const { visible, title, message, showAlert, hideAlert, handleClose } =
		useAlertModal()

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

		setIsLoading(true)
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
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<DynamicScrollView
				styles={forgotPasswordStyles.container}
				autoCenter="center"
				fallbackAlign="flex-start">
				<View style={forgotPasswordStyles.content}>
					<Text style={forgotPasswordStyles.title}>Reset Password</Text>
					<Text style={forgotPasswordStyles.subtitle}>
						Enter your email address and we'll send you instructions to reset
						your password.
					</Text>

					{/* Form */}
					<TouchableOpacity
						style={forgotPasswordStyles.backButton}
						onPress={() => navigation.goBack()}>
						<Text style={forgotPasswordStyles.backButtonText}>
							Back to Login
						</Text>
					</TouchableOpacity>
				</View>
			</DynamicScrollView>

			<AlertModal
				visible={visible}
				onClose={hideAlert}
				title={title}
				message={message}
				buttons={[{ text: 'Confirm', onPress: handleClose }]}
			/>
		</>
	)
}

export default ForgotPasswordScreen
