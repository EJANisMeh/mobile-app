import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
} from 'react-native'
import { useAuth, useTheme } from '../../../context'
import { LoginCredentials } from '../../../types'
import { AlertModal } from '../../../components'
import { useAlertModal, useResponsiveDimensions } from '../../../hooks'
import type { AuthStackParamList } from '../../../types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'
import { createLoginStyles } from '../../../styles/auth/themedStyles'

type LoginScreenNavigationProp = StackNavigationProp<
	AuthStackParamList,
	'Login'
>

interface LoginScreenProps {
	navigation: LoginScreenNavigationProp
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
	const { isLoading, error, login } = useAuth()
	const { colors } = useTheme()
	const loginStyles = createLoginStyles(colors)
	const { visible, title, message, showAlert, hideAlert } = useAlertModal()
	const responsive = useResponsiveDimensions()
	const [credentials, setCredentials] = useState<LoginCredentials>({
		email: '',
		password: '',
	})

	// Get responsive styles based on orientation
	const dynamicStyles = {
		container: {
			...loginStyles.container,
			paddingHorizontal: responsive.getResponsivePadding().horizontal,
		},
		content: {
			...loginStyles.content,
			paddingVertical: responsive.getResponsivePadding().vertical,
			// In landscape, reduce vertical spacing
			justifyContent: responsive.isLandscape
				? ('flex-start' as const)
				: ('center' as const),
			paddingTop: responsive.isLandscape ? 40 : undefined,
		},
		title: {
			...loginStyles.title,
			fontSize: responsive.getResponsiveFontSize(32),
			marginBottom: responsive.getResponsiveMargin().small,
		},
		subtitle: {
			...loginStyles.subtitle,
			fontSize: responsive.getResponsiveFontSize(16),
			marginBottom: responsive.getResponsiveMargin().medium,
		},
		form: {
			...loginStyles.form,
			marginBottom: responsive.getResponsiveMargin().medium,
		},
	}

	const handleLogin = async () => {
		if (!credentials.email || !credentials.password) {
			showAlert({
				title: 'Missing Information',
				message: 'Please enter both email and password.',
			})
			return
		}

		const success = await login(credentials)

		if (!success && error) {
			showAlert({
				title: 'Login Failed',
				message: error,
			})
		}
	}

	const handleEmailChange = (email: string) => {
		setCredentials((prev: LoginCredentials) => ({ ...prev, email }))
	}

	const handlePasswordChange = (password: string) => {
		setCredentials((prev: LoginCredentials) => ({ ...prev, password }))
	}

	const handleForgotPassword = () => {
		Keyboard.dismiss()
		navigation.navigate('ForgotPassword')
	}

	return (
		<>
			<KeyboardAvoidingView
				style={dynamicStyles.container}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
				<View style={dynamicStyles.content}>
					<Text style={dynamicStyles.title}>Welcome Back</Text>
					<Text style={dynamicStyles.subtitle}>Sign in to your account</Text>

					<View style={dynamicStyles.form}>
						<TextInput
							style={loginStyles.input}
							placeholder="Email"
							value={credentials.email}
							onChangeText={handleEmailChange}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
							textContentType="none"
							importantForAutofill="no"
							contextMenuHidden={true}
						/>

						<TextInput
							style={loginStyles.input}
							placeholder="Password"
							value={credentials.password}
							onChangeText={handlePasswordChange}
							secureTextEntry
							autoCapitalize="none"
							textContentType="none"
							importantForAutofill="no"
							contextMenuHidden={true}
							passwordRules=""
						/>

						<TouchableOpacity
							style={[
								loginStyles.loginButton,
								isLoading && loginStyles.disabledButton,
							]}
							onPress={handleLogin}
							disabled={isLoading}>
							<Text style={loginStyles.loginButtonText}>
								{isLoading ? 'Signing In...' : 'Sign In'}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={loginStyles.forgotPassword}
							onPress={handleForgotPassword}>
							<Text style={loginStyles.forgotPasswordText}>
								Forgot Password?
							</Text>
						</TouchableOpacity>
					</View>

					<View style={loginStyles.footer}>
						<Text style={loginStyles.footerText}>Don't have an account? </Text>
						<TouchableOpacity onPress={() => navigation.navigate('Register')}>
							<Text style={loginStyles.signUpText}>Sign Up</Text>
						</TouchableOpacity>
					</View>
				</View>
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

export default LoginScreen
