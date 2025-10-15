import React, { useState, useEffect, useRef } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from 'react-native'
import { useAuthContext, useThemeContext } from '../../../context'
import { AlertModal } from '../../../components'
import { useAlertModal, useResponsiveDimensions } from '../../../hooks'
import { createEmailVerificationStyles } from '../../../styles/themedStyles'
import { EmailVerificationScreenProps } from '../../../types/authTypes'

const VERIFICATION_CODE = '123456'

const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({
	navigation,
	route,
}) => {
	const { email, purpose, userId } = route.params
	const { colors } = useThemeContext()
	const emailVerificationStyles = createEmailVerificationStyles(colors)
	const responsive = useResponsiveDimensions()
	const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
	const [isVerifying, setIsVerifying] = useState(false)
	const [isResending, setIsResending] = useState(false)
	const [canResend, setCanResend] = useState(false)
	const [countdown, setCountdown] = useState(30)
	const { visible, title, message, showAlert, hideAlert, handleConfirm } =
		useAlertModal()
	const { user, logout, verifyEmail } = useAuthContext()

	// Refs for input fields
	const inputRefs = useRef<(TextInput | null)[]>([])

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

	const handleCodeChange = (text: string, index: number) => {
		// Only allow numbers
		if (text && !/^\d$/.test(text)) return

		const newCode = [...code]
		newCode[index] = text
		setCode(newCode)

		// Auto-focus next input
		if (text && index < 5) {
			inputRefs.current[index + 1]?.focus()
		}
	}

	const handleKeyPress = (
		e: { nativeEvent: { key: string } },
		index: number
	) => {
		if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
			inputRefs.current[index - 1]?.focus()
		}
	}

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
							onConfirm: () => {
								hideAlert()
								navigation.navigate('ChangePassword', { email: email! })
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
						onConfirm: () => {
							hideAlert()
							navigation.navigate('Login')
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

	const handleResendCode = async () => {
		if (!canResend) return

		setIsResending(true)
		try {
			// TODO: Implement actual code resend when backend is ready
			// await resendVerificationCode(email)

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500))

			showAlert({
				title: 'Success',
				message: 'A new verification code has been sent to your email.',
			})

			// Reset countdown
			setCanResend(false)
			setCountdown(30)

			// Clear code inputs
			setCode(['', '', '', '', '', ''])
			inputRefs.current[0]?.focus()
		} catch (error) {
			showAlert({
				title: 'Error',
				message: 'Failed to resend verification code. Please try again.',
			})
		} finally {
			setIsResending(false)
		}
	}

	const handleBackToLogin = async () => {
		if (purpose === 'password-reset') {
			navigation.goBack()
		} else {
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
	}

	const getScreenTitle = () => {
		return purpose === 'password-reset'
			? 'Verify Your Identity'
			: 'Verify Your Email'
	}

	const getScreenDescription = () => {
		return purpose === 'password-reset'
			? 'Enter the 6-digit verification code sent to your email to reset your password.'
			: 'Enter the 6-digit verification code sent to your email to verify your account.'
	}

	return (
		<>
			<KeyboardAvoidingView
				key={responsive.isLandscape ? 'landscape' : 'portrait'}
				style={emailVerificationStyles.container}
				behavior="padding"
				enabled={true}
				keyboardVerticalOffset={Platform.OS === 'android' ? -100 : 0}>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					keyboardShouldPersistTaps="handled"
					bounces={false}
					showsVerticalScrollIndicator={false}>
					<View style={emailVerificationStyles.content}>
						<View style={emailVerificationStyles.iconContainer}>
							<Text style={emailVerificationStyles.icon}>🔐</Text>
						</View>

						<Text style={emailVerificationStyles.title}>
							{getScreenTitle()}
						</Text>
						<Text style={emailVerificationStyles.description}>
							{getScreenDescription()}
						</Text>

						{/* 6-digit code input */}
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								gap: 10,
								marginVertical: 30,
							}}>
							{code.map((digit, index) => (
								<TextInput
									key={index}
									ref={(ref) => {
										inputRefs.current[index] = ref
									}}
									style={{
										width: 50,
										height: 60,
										borderWidth: 2,
										borderColor: digit ? colors.primary : colors.border,
										borderRadius: 8,
										fontSize: 24,
										fontWeight: 'bold',
										textAlign: 'center',
										color: colors.text,
										backgroundColor: colors.background,
									}}
									value={digit}
									onChangeText={(text) => handleCodeChange(text, index)}
									onKeyPress={(e) => handleKeyPress(e, index)}
									keyboardType="number-pad"
									maxLength={1}
									editable={!isVerifying}
									autoFocus={index === 0}
								/>
							))}
						</View>

						<View style={emailVerificationStyles.actions}>
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

							<TouchableOpacity
								style={[
									emailVerificationStyles.secondaryButton,
									(!canResend || isResending) &&
										emailVerificationStyles.disabledButton,
								]}
								onPress={handleResendCode}
								disabled={!canResend || isResending}>
								{isResending ? (
									<ActivityIndicator
										color="#007bff"
										size="small"
									/>
								) : (
									<Text style={emailVerificationStyles.secondaryButtonText}>
										{canResend ? 'Resend Code' : `Resend in ${countdown}s`}
									</Text>
								)}
							</TouchableOpacity>

							<TouchableOpacity
								style={emailVerificationStyles.logoutButton}
								onPress={handleBackToLogin}>
								<Text style={emailVerificationStyles.logoutButtonText}>
									{purpose === 'password-reset'
										? 'Back to Forgot Password'
										: 'Back to Login'}
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
				buttons={[{ text: 'OK', onPress: handleConfirm }]}
			/>
		</>
	)
}

export default EmailVerificationScreen
