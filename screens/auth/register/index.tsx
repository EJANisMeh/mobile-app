import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
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
		fname: '',
		lname: '',
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
		// Basic validation
		if (
			!formData.fname ||
			!formData.lname ||
			!formData.email ||
			!formData.password
		) {
			showAlert({
				title: 'Missing Information',
				message: 'Please fill in all required fields.',
			})
			return
		}

		if (formData.password !== formData.confirmPassword) {
			showAlert({
				title: 'Password Mismatch',
				message: 'Passwords do not match.',
			})
			return
		}

		if (formData.password.length < 6) {
			showAlert({
				title: 'Weak Password',
				message: 'Password must be at least 6 characters long.',
			})
			return
		}

		const success = await register(formData)

		if (!success && error) {
			showAlert({
				title: 'Registration Failed',
				message: error,
			})
		}
	}

	const updateField = (field: keyof RegisterData, value: string) => {
		setFormData((prev: RegisterData) => ({ ...prev, [field]: value }))
	}

	return (
		<>
			<KeyboardAvoidingView
				style={dynamicStyles.container}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
				<ScrollView contentContainerStyle={dynamicStyles.scrollContent}>
					<View style={registerStyles.content}>
						<Text style={dynamicStyles.title}>Create Account</Text>

						<View style={registerStyles.form}>
							<View style={registerStyles.nameRow}>
								<TextInput
									style={[registerStyles.input, registerStyles.nameInput]}
									placeholder="First Name"
									value={formData.fname}
									onChangeText={(value) => updateField('fname', value)}
									autoCapitalize="words"
								/>
								<TextInput
									style={[registerStyles.input, registerStyles.nameInput]}
									placeholder="Last Name"
									value={formData.lname}
									onChangeText={(value) => updateField('lname', value)}
									autoCapitalize="words"
								/>
							</View>

							<TextInput
								style={registerStyles.input}
								placeholder="Email"
								value={formData.email}
								onChangeText={(value) => updateField('email', value)}
								keyboardType="email-address"
								autoCapitalize="none"
								autoCorrect={false}
							/>

							<TextInput
								style={registerStyles.input}
								placeholder="Password"
								value={formData.password}
								onChangeText={(value) => updateField('password', value)}
								secureTextEntry
								autoCapitalize="none"
							/>

							<TextInput
								style={registerStyles.input}
								placeholder="Confirm Password"
								value={formData.confirmPassword}
								onChangeText={(value) => updateField('confirmPassword', value)}
								secureTextEntry
								autoCapitalize="none"
							/>

							<TouchableOpacity
								style={[
									registerStyles.registerButton,
									isLoading && registerStyles.disabledButton,
								]}
								onPress={handleRegister}
								disabled={isLoading}>
								<Text style={registerStyles.registerButtonText}>
									{isLoading ? 'Creating Account...' : 'Create Account'}
								</Text>
							</TouchableOpacity>
						</View>

						<View style={registerStyles.footer}>
							<Text style={registerStyles.footerText}>
								Already have an account?{' '}
							</Text>
							<TouchableOpacity onPress={() => navigation.navigate('Login')}>
								<Text style={registerStyles.signInText}>Sign In</Text>
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
