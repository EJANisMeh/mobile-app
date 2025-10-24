import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { createChangePasswordStyles } from '../../../styles/auth'
import { useThemeContext, useAuthContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { useAuthNavigation } from '../../../hooks/useNavigation'
import {
	UseAlertModalType,
	UseConfirmationModalType,
} from '../../../hooks/useModals/types'

interface ChangePassSubmitButtonProps {
	userId: number
	formData: {
		currentPassword: string
		newPassword: string
		confirmPassword: string
	}
	updateField: (field: string, value: string) => void
	showAlert: UseAlertModalType['showAlert']
	showConfirmation: UseConfirmationModalType['showConfirmation']
}

const ChangePassInputs: React.FC<ChangePassSubmitButtonProps> = ({
	userId,
	formData,
	updateField,
	showAlert,
	showConfirmation,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const changePasswordStyles = createChangePasswordStyles(colors, responsive)
	const { isLoading, resetPassword } = useAuthContext()
	const navigation = useAuthNavigation()

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

	const handleResetPassword = async () => {
		try {
			// Call resetPassword with email or userId and new password
			const identifier = userId
			const result = await resetPassword(
				identifier as string | number,
				formData.newPassword
			)

			if (!result.success) {
				showAlert({
					title: 'Error',
					message:
						result.error || 'Failed to reset password. Please try again.',
				})
				return
			}

			showAlert({
				title: 'Success',
				message: result.message || 'Password changed successfully.',
				onClose: () => {
					// reset to empty fields
					updateField('newPassword', '')
					updateField('confirmPassword', '')

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
		}
	}

	const onPress = () =>
	{
		if (!validateForm()) return
		showConfirmation({
			title: 'Change Password?',
			message: 'Confirm the password change?',
			confirmText: 'Yes',
			cancelText: 'No',
			onConfirm: handleResetPassword,
		})
	}

	return (
		<TouchableOpacity
			style={[
				changePasswordStyles.submitButton,
				isLoading && changePasswordStyles.disabledButton,
			]}
			onPress={onPress}
			disabled={isLoading}>
			<Text style={changePasswordStyles.submitButtonText}>
				{isLoading ? 'Changing Password...' : 'Change Password'}
			</Text>
		</TouchableOpacity>
	)
}

export default ChangePassInputs
