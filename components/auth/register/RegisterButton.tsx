import React from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	ActivityIndicator,
	StyleProp,
} from 'react-native'
import type { RegisterData } from '../../../types'
import { useAuthNavigation } from '../../../hooks/useNavigation'
import { useAuthContext } from '../../../context'
import { UseAlertModalProps } from '../../../hooks/useModals/types'
  
interface RegisterButtonProps {
	formData: RegisterData
	colors: { textOnPrimary: string }
	buttonStyles: Record<string, StyleProp<any>>
	showAlert: (opts: UseAlertModalProps) => void
	hideAlert?: () => void
}

const RegisterButton: React.FC<RegisterButtonProps> = ({
	formData,
	colors,
	buttonStyles,
	showAlert,
}) => {
	const { isLoading, error, register } = useAuthContext()
  const navigation = useAuthNavigation()
  
	const handleRegister = async () => {
		// Validate all fields
		if (!formData.email || !formData.password || !formData.confirmPassword) {
			showAlert({
				title: 'Missing Information',
				message: 'All fields are required',
			})
			return
		}

		// Validate password match
		if (formData.password !== formData.confirmPassword) {
			showAlert({
				title: 'Password Mismatch',
				message: 'Passwords do not match',
			})
			return
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(formData.email)) {
			showAlert({
				title: 'Invalid Email',
				message: 'Email format is incorrect',
			})
			return
		}

		// Validate password length
		if (formData.password.length < 8) {
			showAlert({
				title: 'Weak Password',
				message: 'Password must be at least 8 characters long',
			})
			return
    }
    
    const complexityRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
		console.log(
			`Complexity test for password: ${formData.password} :`,
			complexityRegex.test(formData.password)
		)
    if (!complexityRegex.test(formData.password))
    {
      showAlert({
				title: 'Weak Password',
				message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      })
      return
    }


		try {
			const result = await register(formData)

			if (!result.success) {
				// Handle specific backend errors
				showAlert({
					title: 'Registration Failed',
					message: error || 'Failed to create account. Please try again.',
				})
				return
			}

			if (result.message) {
				showAlert({
					title: 'Registration Successful',
					message: result.message,
				})
			}

			// Navigate to email verification screen on success
			navigation.navigate('EmailVerification', {
				userId: result.userId,
				purpose: 'email-verification',
			})
		} catch (err) {
			showAlert({
				title: 'Registration Error',
				message:
					'An unexpected error occurred. Please check your internet connection or try again later.',
			})
		}
	}

	return (
		<TouchableOpacity
			style={[
				buttonStyles.registerButton,
				isLoading && buttonStyles.disabledButton,
			]}
			onPress={handleRegister}
			disabled={isLoading}
			activeOpacity={isLoading ? 1 : 0.7}>
			{isLoading ? (
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<ActivityIndicator
						size="small"
						color={colors.textOnPrimary}
						style={{ marginRight: 8 }}
					/>
					<Text style={buttonStyles.registerButtonText}>
						Creating Account...
					</Text>
				</View>
			) : (
				<Text style={buttonStyles.registerButtonText}>Create Account</Text>
			)}
		</TouchableOpacity>
	)
}

export default RegisterButton
