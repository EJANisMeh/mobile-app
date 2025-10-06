import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	ScrollView,
	Dimensions,
} from 'react-native'
import { useTheme } from '../../../context'
import { AlertModal } from '../../../components'
import { useAlertModal, useResponsiveDimensions } from '../../../hooks'
import type { AuthStackParamList } from '../../../types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'
import { createForgotPasswordStyles } from '../../../styles/auth/themedStyles'

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
	const { colors } = useTheme()
	const forgotPasswordStyles = createForgotPasswordStyles(colors)
	const responsive = useResponsiveDimensions()
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const { visible, title, message, showAlert, hideAlert } = useAlertModal()

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
			// TODO: Implement actual password reset when backend is ready
			// await resetPassword(email)

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500))

			showAlert({
				title: 'Success',
				message: 'Password reset instructions have been sent to your email.',
				onConfirm: () => {
					hideAlert()
					// Auto-navigate to EmailVerification since we're using test accounts without email API
					navigation.navigate('EmailVerification', { email })
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
			<KeyboardAvoidingView
				key={responsive.isLandscape ? 'landscape' : 'portrait'}
				style={forgotPasswordStyles.container}
				behavior="padding"
				enabled={true}
				keyboardVerticalOffset={Platform.OS === 'android' ? -100 : 0}>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					keyboardShouldPersistTaps="handled"
					bounces={false}
					showsVerticalScrollIndicator={false}>
					<View style={forgotPasswordStyles.content}>
						<Text style={forgotPasswordStyles.title}>Reset Password</Text>
						<Text style={forgotPasswordStyles.subtitle}>
							Enter your email address and we'll send you instructions to reset
							your password.
						</Text>

						<View style={forgotPasswordStyles.form}>
							<TextInput
								style={forgotPasswordStyles.input}
								placeholder="Email Address"
								value={email}
								onChangeText={setEmail}
								keyboardType="email-address"
								autoCapitalize="none"
								autoCorrect={false}
								editable={!isLoading}
							/>

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

							<TouchableOpacity
								style={forgotPasswordStyles.backButton}
								onPress={() => navigation.goBack()}>
								<Text style={forgotPasswordStyles.backButtonText}>
									Back to Login
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>

			<AlertModal
				visible={visible}
				onClose={hideAlert}
				title={title}
				message={message}
			/>
		</>
	)
}

export default ForgotPasswordScreen
