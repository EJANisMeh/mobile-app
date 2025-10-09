import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useAuth, useTheme } from '../../../context'
import { AlertModal } from '../../../components'
import { useAlertModal } from '../../../hooks'
import type { AuthStackParamList } from '../../../types/navigation'
import type { StackScreenProps } from '@react-navigation/stack'
import { createEmailVerificationStyles } from '../../../styles/themedStyles'

type EmailVerificationScreenProps = StackScreenProps<
	AuthStackParamList,
	'EmailVerification'
>

const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({
	navigation,
	route,
}) => {
	const { email } = route.params
	const { colors } = useTheme()
	const emailVerificationStyles = createEmailVerificationStyles(colors)
	const [isResending, setIsResending] = useState(false)
	const [canResend, setCanResend] = useState(false)
	const [countdown, setCountdown] = useState(60)
	const { visible, title, message, showAlert, hideAlert } = useAlertModal()
	const { user, isLoading, error, logout } = useAuth()

	useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					setCanResend(true)
					clearInterval(timer)
					return 0
				}
				return prev - 1
			})
		}, 1000)

		return () => clearInterval(timer)
	}, [])

	const handleResendEmail = async () => {
		if (!canResend) return

		setIsResending(true)
		try {
			// TODO: Implement actual email resend when backend is ready
			// await resendVerificationEmail(state.user?.email)

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500))

			showAlert({
				title: 'Success',
				message: 'Verification email has been resent to your email address.',
			})

			// Reset countdown
			setCanResend(false)
			setCountdown(60)
		} catch (error) {
			showAlert({
				title: 'Error',
				message: 'Failed to resend verification email. Please try again.',
			})
		} finally {
			setIsResending(false)
		}
	}

	const handleLogout = async () => {
		try {
			await logout()
			navigation.navigate('Login')
		} catch (error) {
			showAlert({
				title: 'Error',
				message: 'Failed to logout. Please try again.',
			})
		}
	}

	const handleCheckVerification = async () => {
		// TODO: Implement verification check when backend is ready
		// This would typically check if the user's email has been verified
		// and update the auth state accordingly
		showAlert({
			title: 'Info',
			message:
				'Please check your email and click the verification link. Then try logging in again.',
			onConfirm: () => navigation.navigate('Login'),
		})
	}

	return (
		<>
			<View style={emailVerificationStyles.container}>
				<View style={emailVerificationStyles.content}>
					<View style={emailVerificationStyles.iconContainer}>
						<Text style={emailVerificationStyles.icon}>📧</Text>
					</View>

					<Text style={emailVerificationStyles.title}>Verify Your Email</Text>
					<Text style={emailVerificationStyles.subtitle}>
						We've sent a verification email to:
					</Text>
					<Text style={emailVerificationStyles.email}>{email}</Text>
					<Text style={emailVerificationStyles.description}>
						Please check your email and click the verification link to activate
						your account.
					</Text>

					<View style={emailVerificationStyles.actions}>
						<TouchableOpacity
							style={emailVerificationStyles.primaryButton}
							onPress={handleCheckVerification}>
							<Text style={emailVerificationStyles.primaryButtonText}>
								I've Verified My Email
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								emailVerificationStyles.secondaryButton,
								(!canResend || isResending) &&
									emailVerificationStyles.disabledButton,
							]}
							onPress={handleResendEmail}
							disabled={!canResend || isResending}>
							{isResending ? (
								<ActivityIndicator
									color="#007bff"
									size="small"
								/>
							) : (
								<Text style={emailVerificationStyles.secondaryButtonText}>
									{canResend ? 'Resend Email' : `Resend in ${countdown}s`}
								</Text>
							)}
						</TouchableOpacity>

						<TouchableOpacity
							style={emailVerificationStyles.logoutButton}
							onPress={handleLogout}>
							<Text style={emailVerificationStyles.logoutButtonText}>
								Back to Login
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>

			<AlertModal
				visible={visible}
				onClose={hideAlert}
				title={title}
				message={message}
			/>
		</>
	)
}

export default EmailVerificationScreen
