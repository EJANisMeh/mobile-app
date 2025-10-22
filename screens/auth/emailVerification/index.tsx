import React, { useState, useEffect, useRef } from 'react'
import {
	View,
	Text,
	TextInput,
	BackHandler,
} from 'react-native'
import { useThemeContext } from '../../../context'
import { AlertModal, ConfirmationModal } from '../../../components'
import {
	useAlertModal,
	useResponsiveDimensions,
	useConfirmationModal,
} from '../../../hooks'
import { createEmailVerificationStyles } from '../../../styles/themedStyles'
import { EmailVerificationScreenProps } from '../../../types/authTypes'
import DynamicScrollView from '../../../components/DynamicScrollView'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
	CodeInput,
	ResendCodeButton,
} from '../../../components/auth/emailVerification'
import { VerifyCodeButton } from '../../../components/auth/emailVerification'
import BackToLoginButton from '../../../components/auth/emailVerification/BackToLoginButton'
import { useAuthNavigation } from '../../../hooks/useNavigation'

const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({
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
	const inputRefs = useRef<(TextInput | null)[]>([])
	const {
		visible: alertVisible,
		title,
		message,
		showAlert,
		hideAlert,
		handleClose,
	} = useAlertModal()
	const {
		visible: confirmVisible,
		props: confirmProps,
		showConfirmation,
		hideConfirmation,
	} = useConfirmationModal()

	const navigation = useAuthNavigation()

	// Countdown timer for resending code
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

	// Handle Android hardware back button
	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				handleBackToLogin()
				return true // Prevent default back behavior
			}
		)

		return () => backHandler.remove()
	}, [purpose])

	const handleBackToLogin = async () => {
		showConfirmation({
			title: 'Leave Verification?',
			message:
				purpose === 'password-reset'
					? 'Are you sure you want to go back? You will need to request a new verification code.'
					: 'Are you sure you want to leave? Your verification progress will be lost.',
			confirmText: 'Leave',
			cancelText: 'Stay',
			confirmStyle: 'destructive',
			onConfirm: () => {
				if (purpose === 'password-reset') {
					navigation.goBack()
				} else {
					navigation.reset({
						index: 0,
						routes: [{ name: 'Login' }],
					})
				}
			},
		})
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

						<ResendCodeButton
							emailVerificationStyles={emailVerificationStyles}
							inputRefs={inputRefs}
							setCode={setCode}
							canResend={canResend}
							setCanResend={setCanResend}
							isResending={isResending}
							setIsResending={setIsResending}
							countdown={countdown}
							setCountdown={setCountdown}
							showAlert={showAlert}
						/>

						<BackToLoginButton
							emailVerificationStyles={emailVerificationStyles}
							handlePress={handleBackToLogin}
							purpose={purpose}
						/>
					</View>
				</View>
			</DynamicScrollView>

			<AlertModal
				visible={alertVisible}
				onClose={hideAlert}
				title={title}
				message={message}
				buttons={[{ text: 'OK', onPress: handleClose }]}
			/>

			<ConfirmationModal
				visible={confirmVisible}
				onClose={hideConfirmation}
				title={confirmProps.title}
				message={confirmProps.message}
				confirmText={confirmProps.confirmText}
				cancelText={confirmProps.cancelText}
				confirmStyle={confirmProps.confirmStyle}
				onConfirm={confirmProps.onConfirm}
			/>
		</>
	)
}

export default EmailVerificationScreen
