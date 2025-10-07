import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	ScrollView,
	Dimensions,
	ActivityIndicator,
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

		if (!success) {
			// Error is already set in AuthContext, show it in alert
			showAlert({
				title: 'Login Failed',
				message: error || 'Invalid email or password. Please try again.',
			})
		}
		// If success, RootNavigator will handle navigation automatically
	}

	const handleEmailChange = (email: string) => {
		setCredentials((prev: LoginCredentials) => ({ ...prev, email }))
	}

	const handlePasswordChange = (password: string) => {
		setCredentials((prev: LoginCredentials) => ({ ...prev, password }))
	}

	const handleForgotPassword = () => {
		Keyboard.dismiss()
		setTimeout(() => {
			navigation.navigate('ForgotPassword')
		}, 100)
	}

	const handleRegisterNavigation = () => {
		Keyboard.dismiss()
		setTimeout(() => {
			navigation.navigate('Register')
		}, 100)
	}

	return (
		<>
			<KeyboardAvoidingView
				key={responsive.isLandscape ? 'landscape' : 'portrait'}
				style={dynamicStyles.container}
				behavior="padding"
				enabled={true}
				keyboardVerticalOffset={Platform.OS === 'android' ? -100 : 0}>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					keyboardShouldPersistTaps="handled"
					bounces={false}
					showsVerticalScrollIndicator={false}>
					<View style={dynamicStyles.content}>
						<Text style={dynamicStyles.title}>Hello User</Text>
						<Text style={dynamicStyles.subtitle}>Sign in to your account</Text>

						<View style={dynamicStyles.form}>
							<TextInput
								style={[
									loginStyles.input,
									isLoading && {
										opacity: 0.6,
										backgroundColor: colors.surface,
									},
								]}
								placeholder="Email (yourEmail@example.com)"
								value={credentials.email}
								onChangeText={handleEmailChange}
								keyboardType="email-address"
								autoCapitalize="none"
								autoCorrect={false}
								textContentType="none"
								importantForAutofill="no"
								contextMenuHidden={true}
								editable={!isLoading}
							/>

							<TextInput
								style={[
									loginStyles.input,
									isLoading && {
										opacity: 0.6,
										backgroundColor: colors.surface,
									},
								]}
								placeholder="Password"
								value={credentials.password}
								onChangeText={handlePasswordChange}
								secureTextEntry
								autoCapitalize="none"
								textContentType="none"
								importantForAutofill="no"
								contextMenuHidden={true}
								passwordRules=""
								editable={!isLoading}
							/>

							<TouchableOpacity
								style={[
									loginStyles.loginButton,
									isLoading && loginStyles.disabledButton,
								]}
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
										<Text style={loginStyles.loginButtonText}>
											Signing In...
										</Text>
									</View>
								) : (
									<Text style={loginStyles.loginButtonText}>Sign In</Text>
								)}
							</TouchableOpacity>

							<TouchableOpacity
								style={loginStyles.forgotPassword}
								onPress={handleForgotPassword}
								disabled={isLoading}
								activeOpacity={isLoading ? 1 : 0.7}>
								<Text
									style={[
										loginStyles.forgotPasswordText,
										isLoading && { opacity: 0.5 },
									]}>
									Forgot Password?
								</Text>
							</TouchableOpacity>
						</View>

						<View style={loginStyles.footer}>
							<Text style={loginStyles.footerText}>
								Don't have an account?{' '}
							</Text>
							<TouchableOpacity
								onPress={handleRegisterNavigation}
								disabled={isLoading}
								activeOpacity={isLoading ? 1 : 0.7}>
								<Text
									style={[
										loginStyles.signUpText,
										isLoading && { opacity: 0.5 },
									]}>
									Sign Up
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
			/>
		</>
	)
}

export default LoginScreen
