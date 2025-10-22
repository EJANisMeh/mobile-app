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
import { useAuthContext, useThemeContext } from '../../../context'
import { AlertModal } from '../../../components'
import { useAlertModal, useResponsiveDimensions } from '../../../hooks'
import type { AuthStackParamList } from '../../../types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'
import { createChangePasswordStyles } from '../../../styles/themedStyles'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import DynamicScrollView from '../../../components/DynamicScrollView'

type ChangePasswordScreenNavigationProp = StackNavigationProp<
	AuthStackParamList,
	'ChangePassword'
>

interface ChangePasswordScreenProps {
	navigation: ChangePasswordScreenNavigationProp
	route: { params: { email?: string; userId?: number } }
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({
	navigation,
	route,
}) => {
	const { userId } = route.params
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const changePasswordStyles = createChangePasswordStyles(colors, responsive)
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
	const { visible, title, message, showAlert, hideAlert, handleClose } =
		useAlertModal()
	const { resetPassword, error } = useAuthContext()
	const [localIsLoading, setLocalIsLoading] = useState(false)

	const updateField = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
	}

	const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
		setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
	}

	const validateForm = () => {
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
			// Call resetPassword with email or userId and new password
			const identifier = userId
			const success = await resetPassword(
				identifier as string | number,
				formData.newPassword
			)

			if (!success) {
				showAlert({
					title: 'Error',
					message: error || 'Failed to reset password. Please try again.',
				})
				return
			}

			showAlert({
				title: 'Success',
				message: 'Your password has been changed successfully.',
				onClose: () => {
					navigation.reset({
						index: 0,
						routes: [{ name: 'Login' }],
					})
				},
			})
		} catch (error) {
			showAlert({
				title: 'Error',
				message: 'Failed to change password. Please try again.',
			})
		} finally {
			setLocalIsLoading(false)
		}
	}

	return (
		<>
			<DynamicScrollView
				styles={changePasswordStyles.container}
				autoCenter="center"
				fallbackAlign="flex-start">
				<View style={changePasswordStyles.content}>
					<Text style={changePasswordStyles.title}>Change Password</Text>
					<Text style={changePasswordStyles.subtitle}>
						Enter your new password
					</Text>

					<View style={changePasswordStyles.form}>
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
								<MaterialCommunityIcons
									name={showPasswords.new ? 'eye-off' : 'eye'}
									size={24}
									color={colors.text}
								/>
							</TouchableOpacity>
						</View>

						<View style={changePasswordStyles.inputContainer}>
							<TextInput
								style={changePasswordStyles.input}
								placeholder="Confirm New Password"
								value={formData.confirmPassword}
								onChangeText={(value) => updateField('confirmPassword', value)}
								secureTextEntry={!showPasswords.confirm}
								autoCapitalize="none"
							/>
							<TouchableOpacity
								style={changePasswordStyles.eyeButton}
								onPress={() => togglePasswordVisibility('confirm')}>
								<MaterialCommunityIcons
									name={showPasswords.confirm ? 'eye-off' : 'eye'}
									size={24}
									color={colors.text}
								/>
							</TouchableOpacity>
						</View>

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
							<Text style={changePasswordStyles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</DynamicScrollView>

			<AlertModal
				visible={visible}
				onClose={hideAlert}
				title={title}
				message={message}
				buttons={[{ text: 'OK', onPress: handleClose }]}
			/>
		</>
	)
}

export default ChangePasswordScreen
