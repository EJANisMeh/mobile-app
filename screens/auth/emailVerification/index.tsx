import React, { useState, useEffect, useRef } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native'
import { useAuthContext, useThemeContext } from '../../../context'
import { AlertModal } from '../../../components'
import { useAlertModal, useResponsiveDimensions } from '../../../hooks'
import { createEmailVerificationStyles } from '../../../styles/themedStyles'
import { EmailVerificationScreenProps } from '../../../types/authTypes'
import DynamicScrollView from '../../../components/DynamicScrollView'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { CodeInput } from '../../../components/auth/emailVerification'
import { VerifyCodeButton } from '../../../components/auth/emailVerification'

const VERIFICATION_CODE = '123456'

const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({
	navigation,
	route,
}) => {
	const { purpose, userId } = route.params
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const emailVerificationStyles = createEmailVerificationStyles(
		colors,
		responsive
	)
	const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
	const [isVerifying, setIsVerifying] = useState(false)
	const [isResending, setIsResending] = useState(false)
	const [canResend, setCanResend] = useState(false)
	const [countdown, setCountdown] = useState(30)
	const { visible, title, message, showAlert, hideAlert, handleClose } =
		useAlertModal()
	const { verifyEmail } = useAuthContext()

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
			<DynamicScrollView
				styles={emailVerificationStyles.container}
				autoCenter="center"
				fallbackAlign="flex-start">
				<View style={emailVerificationStyles.content}>
					<View style={emailVerificationStyles.iconContainer}>
						<Text style={emailVerificationStyles.icon}>
							<MaterialCommunityIcons
								name="email-check-outline"
								size={48}
								color={colors.primary}
							/>
						</Text>
					</View>

					<Text style={emailVerificationStyles.title}>{getScreenTitle()}</Text>
					<Text style={emailVerificationStyles.description}>
						{getScreenDescription()}
					</Text>

					{/* 6-digit code input */}
					<CodeInput
						code={code}
						setCode={setCode}
						isVerifying={isVerifying}
						inputRefs={inputRefs}
						emailVerificationStyles={emailVerificationStyles}
					/>

					<View style={emailVerificationStyles.actionsContainer}>
						<VerifyCodeButton
							purpose={purpose}
							userId={userId}
							code={code}
							emailVerificationStyles={emailVerificationStyles}
							isVerifying={isVerifying}
							setIsVerifying={setIsVerifying}
							showAlert={showAlert}
							hideAlert={hideAlert}
						/>

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
							style={emailVerificationStyles.backToLoginButton}
							onPress={handleBackToLogin}>
							<Text style={emailVerificationStyles.backToLoginButtonText}>
								{purpose === 'password-reset'
									? 'Back to Forgot Password'
									: 'Back to Login'}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</DynamicScrollView>

			<AlertModal
				visible={visible}
				onClose={hideAlert}
				title={title}
				message={message}
				buttons={[{ text: 'OK', onPress: handleClose }]}
			/>
		</>
	)
}

export default EmailVerificationScreen
