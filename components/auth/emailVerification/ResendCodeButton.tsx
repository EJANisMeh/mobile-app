import React from 'react'
import { ActivityIndicator, Text, TextInput, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native'
import { UseAlertModalType } from '../../../hooks/useModals/types'

interface ResendCodeButtonProps
{
  emailVerificationStyles: {
    secondaryButton: StyleProp<ViewStyle>
    disabledButton: StyleProp<ViewStyle>
    secondaryButtonText: StyleProp<TextStyle>
  }
  inputRefs: React.RefObject<(TextInput | null)[]>
  setCode: React.Dispatch<React.SetStateAction<string[]>>
  canResend: boolean
  setCanResend: React.Dispatch<React.SetStateAction<boolean>>
  isResending: boolean
  setIsResending: React.Dispatch<React.SetStateAction<boolean>>
  countdown: number
  setCountdown: React.Dispatch<React.SetStateAction<number>>
  showAlert: UseAlertModalType["showAlert"]
}

const ResendCodeButton: React.FC<ResendCodeButtonProps> = ({
  emailVerificationStyles,
  inputRefs,
  setCode,
  canResend,
  setCanResend,
  isResending,
  setIsResending,
  countdown,
  setCountdown,
  showAlert
}) =>
{
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

	return (
		<TouchableOpacity
			style={[
				emailVerificationStyles.secondaryButton,
				(!canResend || isResending) && emailVerificationStyles.disabledButton,
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
	)
}

export default ResendCodeButton
