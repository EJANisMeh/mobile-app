import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
} from 'react-native'
import { useAuth, useTheme } from '../../../context'
import { LoginCredentials } from '../../../types'
import { AlertModal } from '../../../components'
import { useAlertModal } from '../../../hooks'
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
	const [credentials, setCredentials] = useState<LoginCredentials>({
		email: '',
		password: '',
	})

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

	return (
		<>
			<KeyboardAvoidingView
				style={loginStyles.container}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
				<View style={loginStyles.content}>
					<Text style={loginStyles.title}>Welcome Back</Text>
					<Text style={loginStyles.subtitle}>Sign in to your account</Text>

					<View style={loginStyles.form}>
						<TextInput
							style={loginStyles.input}
							placeholder="Email"
							value={credentials.email}
							onChangeText={handleEmailChange}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
						/>

						<TextInput
							style={loginStyles.input}
							placeholder="Password"
							value={credentials.password}
							onChangeText={handlePasswordChange}
							secureTextEntry
							autoCapitalize="none"
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
							onPress={() => navigation.navigate('ForgotPassword')}>
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
