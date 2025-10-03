import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Alert,
	KeyboardAvoidingView,
	Platform,
} from 'react-native'
import { useAuth } from '../../../context'
import { LoginCredentials } from '../../../types'
import { loginStyles } from '../../../styles'

const LoginScreen: React.FC = () => {
	const { state, login, clearError } = useAuth()
	const [credentials, setCredentials] = useState<LoginCredentials>({
		email: '',
		password: '',
	})

	const handleLogin = async () => {
		if (!credentials.email || !credentials.password) {
			Alert.alert('Error', 'Please fill in all fields')
			return
		}

		const success = await login(credentials)
		if (!success && state.error) {
			Alert.alert('Login Failed', state.error)
		}
	}

	const handleEmailChange = (email: string) => {
		setCredentials((prev: LoginCredentials) => ({ ...prev, email }))
		if (state.error) clearError()
	}

	const handlePasswordChange = (password: string) => {
		setCredentials((prev: LoginCredentials) => ({ ...prev, password }))
		if (state.error) clearError()
	}

	return (
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
							state.isLoading && loginStyles.disabledButton,
						]}
						onPress={handleLogin}
						disabled={state.isLoading}>
						<Text style={loginStyles.loginButtonText}>
							{state.isLoading ? 'Signing In...' : 'Sign In'}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity style={loginStyles.forgotPassword}>
						<Text style={loginStyles.forgotPasswordText}>Forgot Password?</Text>
					</TouchableOpacity>
				</View>

				<View style={loginStyles.footer}>
					<Text style={loginStyles.footerText}>Don't have an account? </Text>
					<TouchableOpacity>
						<Text style={loginStyles.signUpText}>Sign Up</Text>
					</TouchableOpacity>
				</View>
			</View>
		</KeyboardAvoidingView>
	)
}

export default LoginScreen
