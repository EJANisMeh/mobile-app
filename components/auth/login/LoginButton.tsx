import React from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native'
import { LoginCredentials } from '../../../types'
import { UseAlertModalType } from '../../../hooks/useModals/types'
import { useAuthContext } from '../../../context'
import { useAuthNavigation } from '../../../hooks/useNavigation'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createLoginStyles } from '../../../styles/auth'

interface LoginButtonProps {
	credentials: LoginCredentials
	setCredentials: React.Dispatch<React.SetStateAction<LoginCredentials>>
	showAlert: UseAlertModalType['showAlert']
}

const LoginButton: React.FC<LoginButtonProps> = ({
	credentials,
	setCredentials,
	showAlert,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const loginStyles = createLoginStyles(colors, responsive)
	const { isLoading, error, login } = useAuthContext()
	const navigation = useAuthNavigation()

	const handleLogin = async () => {
		if (!credentials.email || !credentials.password) {
			showAlert({
				title: 'Missing Information',
				message: 'Please enter both email and password.',
			})
			return
		}

		const result = await login(credentials)

		if (!result.success) {
			showAlert({
				title: 'Login Failed',
				message: error || 'Invalid email or password. Please try again.',
			})
		}

		if (result.needsEmailVerification && result.userId) {
			showAlert({
				title: 'Email Verification Required',
				message: result.message,
				onClose: () => {
					// clear credentials and navigate when the alert is closed (button or back)
					setCredentials({ email: '', password: '' })
					navigation.navigate('EmailVerification', {
						userId: result.userId!,
						purpose: 'email-verification',
					})
				},
			})
		}
		
		// Check if user needs to complete profile
		if (result.needsProfileCreation && result.userId && result.token)
		{
			showAlert({
				title: 'Welcome!',
				message: 'Please complete your profile to continue.',
				onClose: () => {
					setCredentials({ email: '', password: '' })
					navigation.navigate('ProfileCreation', {
						userId: result.userId!,
					})
				},
			})
		}

		// Successful authentication will be handled by RootNavigator
	}

	return (
		<TouchableOpacity
			style={[loginStyles.loginButton, isLoading && loginStyles.disabledButton]}
			onPress={handleLogin}
			disabled={isLoading}
			activeOpacity={isLoading ? 1 : 0.7}>
			{isLoading ? (
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<ActivityIndicator
						size="small"
						color={colors.textOnPrimary}
						style={{ marginRight: 8 }}
					/>
					<Text style={loginStyles.loginButtonText}>Signing In...</Text>
				</View>
			) : (
				<Text style={loginStyles.loginButtonText}>Sign In</Text>
			)}
		</TouchableOpacity>
	)
}

export default LoginButton
