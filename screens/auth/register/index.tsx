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
import { RegisterData } from '../../../types'
import { AlertModal } from '../../../components'
import { useAlertModal, useResponsiveDimensions } from '../../../hooks'
import type { AuthStackParamList } from '../../../types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'
import { createRegisterStyles } from '../../../styles/auth/themedStyles'

type RegisterScreenNavigationProp = StackNavigationProp<
	AuthStackParamList,
	'Register'
>

interface RegisterScreenProps {
	navigation: RegisterScreenNavigationProp
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
	const { isLoading, error, register } = useAuth()
	const { colors } = useTheme()
	const registerStyles = createRegisterStyles(colors)
	const { visible, title, message, showAlert, hideAlert } = useAlertModal()
	const responsive = useResponsiveDimensions()
	const [formData, setFormData] = useState<RegisterData>({
		email: '',
		password: '',
		confirmPassword: '',
		role: 'customer',
	})

	// Get responsive styles
	const dynamicStyles = {
		container: {
			...registerStyles.container,
		},
		scrollContent: {
			...registerStyles.scrollContent,
			paddingHorizontal: responsive.getResponsivePadding().horizontal,
			paddingVertical: responsive.getResponsivePadding().vertical,
		},
		title: {
			...registerStyles.title,
			fontSize: responsive.getResponsiveFontSize(32),
			marginBottom: responsive.getResponsiveMargin().small,
		},
		subtitle: {
			...registerStyles.subtitle,
			fontSize: responsive.getResponsiveFontSize(16),
			marginBottom: responsive.getResponsiveMargin().medium,
		},
	}

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
		if (formData.password.length < 6) {
			showAlert({
				title: 'Weak Password',
				message: 'Password must be at least 6 characters long',
			})
			return
		}

		const success = await register(formData)

		if (!success) {
			// Handle specific backend errors
			if (error?.includes('already exists')) {
				showAlert({
					title: 'Email Already Exists',
					message: 'Email already exists',
				})
			} else {
				showAlert({
					title: 'Registration Failed',
					message: error || 'Failed to create account. Please try again.',
				})
			}
		} else {
			// Navigate to email verification screen on success
			navigation.navigate('EmailVerification', { email: formData.email })
		}
	}

	const updateField = (field: keyof RegisterData, value: string) => {
		setFormData((prev: RegisterData) => ({ ...prev, [field]: value }))
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
					<View style={registerStyles.content}>
						<Text style={dynamicStyles.title}>Create Account</Text>
						<Text style={dynamicStyles.subtitle}>Sign up to get started</Text>

						<View style={registerStyles.form}>
							<TextInput
								style={registerStyles.input}
								placeholder="Email (yourEmail@example.com)"
								value={formData.email}
								onChangeText={(value) => updateField('email', value)}
								keyboardType="email-address"
								autoCapitalize="none"
								autoCorrect={false}
								editable={!isLoading}
							/>

							<TextInput
								style={registerStyles.input}
								placeholder="Password"
								value={formData.password}
								onChangeText={(value) => updateField('password', value)}
								secureTextEntry
								autoCapitalize="none"
								editable={!isLoading}
							/>

							<TextInput
								style={registerStyles.input}
								placeholder="Confirm Password"
								value={formData.confirmPassword}
								onChangeText={(value) => updateField('confirmPassword', value)}
								secureTextEntry
								autoCapitalize="none"
								editable={!isLoading}
							/>

							<TouchableOpacity
								style={[
									registerStyles.registerButton,
									isLoading && registerStyles.disabledButton,
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
										<Text style={registerStyles.registerButtonText}>
											Creating Account...
										</Text>
									</View>
								) : (
									<Text style={registerStyles.registerButtonText}>
										Create Account
									</Text>
								)}
							</TouchableOpacity>
						</View>

						<View style={registerStyles.footer}>
							<Text style={registerStyles.footerText}>
								Already have an account?{' '}
							</Text>
							<TouchableOpacity
								onPress={() => navigation.navigate('Login')}
								disabled={isLoading}
								activeOpacity={isLoading ? 1 : 0.7}>
								<Text
									style={[
										registerStyles.signInText,
										isLoading && { opacity: 0.5 },
									]}>
									Sign In
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

export default RegisterScreen
