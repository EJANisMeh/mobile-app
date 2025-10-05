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
import { AlertModal } from '../../../components'
import { useAlertModal } from '../../../hooks'
import type { AuthStackParamList } from '../../../types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'
import { createChangePasswordStyles } from '../../../styles/auth/themedStyles'

type ChangePasswordScreenNavigationProp = StackNavigationProp<
	AuthStackParamList,
	'ChangePassword'
>

interface ChangePasswordScreenProps {
	navigation: ChangePasswordScreenNavigationProp
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({
	navigation,
}) => {
	const { colors } = useTheme()
	const changePasswordStyles = createChangePasswordStyles(colors)
	const [formData, setFormData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	})
	const [showPasswords, setShowPasswords] = useState({
		current: false,
		new: false,
		confirm: false,
	})
	const { visible, title, message, showAlert, hideAlert } = useAlertModal()
	const { user, error } = useAuth()
	const [localIsLoading, setLocalIsLoading] = useState(false)

	const updateField = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
	}

	const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
		setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
	}

	const validateForm = () => {
		if (!formData.currentPassword) {
			showAlert({
				title: 'Error',
				message: 'Please enter your current password',
			})
			return false
		}

		if (!formData.newPassword) {
			showAlert({
				title: 'Error',
				message: 'Please enter a new password',
			})
			return false
		}

		if (formData.newPassword.length < 6) {
			showAlert({
				title: 'Error',
				message: 'New password must be at least 6 characters long',
			})
			return false
		}

		if (formData.newPassword !== formData.confirmPassword) {
			showAlert({
				title: 'Error',
				message: 'New passwords do not match',
			})
			return false
		}

		if (formData.currentPassword === formData.newPassword) {
			showAlert({
				title: 'Error',
				message: 'New password must be different from current password',
			})
			return false
		}

		return true
	}

	const handleChangePassword = async () => {
		if (!validateForm()) return

		setLocalIsLoading(true)
		try {
			// TODO: Implement actual password change when backend is ready
			// await changePassword(formData.currentPassword, formData.newPassword)

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500))

			showAlert({
				title: 'Success',
				message: 'Your password has been changed successfully.',
				onConfirm: () => navigation.goBack(),
			})
		} catch (error) {
			showAlert({
				title: 'Error',
				message:
					'Failed to change password. Please check your current password and try again.',
			})
		} finally {
			setLocalIsLoading(false)
		}
	}

	return (
		<>
			<KeyboardAvoidingView
				style={changePasswordStyles.container}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
				<ScrollView contentContainerStyle={changePasswordStyles.scrollContent}>
					<View style={changePasswordStyles.content}>
						<Text style={changePasswordStyles.title}>Change Password</Text>
						<Text style={changePasswordStyles.subtitle}>
							Enter your current password and choose a new one
						</Text>

						<View style={changePasswordStyles.form}>
							<View style={changePasswordStyles.inputContainer}>
								<TextInput
									style={changePasswordStyles.input}
									placeholder="Current Password"
									value={formData.currentPassword}
									onChangeText={(value) =>
										updateField('currentPassword', value)
									}
									secureTextEntry={!showPasswords.current}
									autoCapitalize="none"
								/>
								<TouchableOpacity
									style={changePasswordStyles.eyeButton}
									onPress={() => togglePasswordVisibility('current')}>
									<Text style={changePasswordStyles.eyeText}>
										{showPasswords.current ? '🙈' : '👁️'}
									</Text>
								</TouchableOpacity>
							</View>

							<View style={changePasswordStyles.inputContainer}>
								<TextInput
									style={changePasswordStyles.input}
									placeholder="New Password"
									value={formData.newPassword}
									onChangeText={(value) => updateField('newPassword', value)}
									secureTextEntry={!showPasswords.new}
									autoCapitalize="none"
								/>
								<TouchableOpacity
									style={changePasswordStyles.eyeButton}
									onPress={() => togglePasswordVisibility('new')}>
									<Text style={changePasswordStyles.eyeText}>
										{showPasswords.new ? '🙈' : '👁️'}
									</Text>
								</TouchableOpacity>
							</View>

							<View style={changePasswordStyles.inputContainer}>
								<TextInput
									style={changePasswordStyles.input}
									placeholder="Confirm New Password"
									value={formData.confirmPassword}
									onChangeText={(value) =>
										updateField('confirmPassword', value)
									}
									secureTextEntry={!showPasswords.confirm}
									autoCapitalize="none"
								/>
								<TouchableOpacity
									style={changePasswordStyles.eyeButton}
									onPress={() => togglePasswordVisibility('confirm')}>
									<Text style={changePasswordStyles.eyeText}>
										{showPasswords.confirm ? '🙈' : '👁️'}
									</Text>
								</TouchableOpacity>
							</View>

							<Text style={changePasswordStyles.requirements}>
								Password requirements:
								{'\n'}• At least 6 characters long
								{'\n'}• Different from current password
							</Text>

							<TouchableOpacity
								style={[
									changePasswordStyles.submitButton,
									localIsLoading && changePasswordStyles.disabledButton,
								]}
								onPress={handleChangePassword}
								disabled={localIsLoading}>
								<Text style={changePasswordStyles.submitButtonText}>
									{localIsLoading ? 'Changing Password...' : 'Change Password'}
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={changePasswordStyles.cancelButton}
								onPress={() => navigation.goBack()}>
								<Text style={changePasswordStyles.cancelButtonText}>
									Cancel
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

export default ChangePasswordScreen
