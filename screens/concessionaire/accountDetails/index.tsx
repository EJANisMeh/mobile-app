import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'
import { AlertModal } from '../../../components/modals'
import { useThemeContext, useAuthContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { useConcessionaireNavigation } from '../../../hooks/useNavigation'
import { createConcessionaireAccountDetailsStyles } from '../../../styles/concessionaire'
import { authApi } from '../../../services/api'

const AccountDetailsScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const { user } = useAuthContext()
	const responsive = useResponsiveDimensions()
	const navigation = useConcessionaireNavigation()
	const styles = createConcessionaireAccountDetailsStyles(colors, responsive)

	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [errors, setErrors] = useState<{
		currentPassword?: string
		newPassword?: string
		confirmPassword?: string
	}>({})
	const [saving, setSaving] = useState(false)
	const [showAlert, setShowAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState('')
	const [alertTitle, setAlertTitle] = useState('')

	const hasChanges =
		currentPassword.length > 0 ||
		newPassword.length > 0 ||
		confirmPassword.length > 0

	const validateInputs = (): boolean => {
		const newErrors: typeof errors = {}

		if (!currentPassword) {
			newErrors.currentPassword = 'Current password is required'
		}

		if (!newPassword) {
			newErrors.newPassword = 'New password is required'
		} else if (newPassword.length < 6) {
			newErrors.newPassword = 'Password must be at least 6 characters'
		} else if (newPassword === currentPassword) {
			newErrors.newPassword = 'New password must be different from current'
		}

		if (!confirmPassword) {
			newErrors.confirmPassword = 'Please confirm your new password'
		} else if (confirmPassword !== newPassword) {
			newErrors.confirmPassword = 'Passwords do not match'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSaveChanges = async () => {
		if (!validateInputs() || !user?.id) {
			return
		}

		setSaving(true)
		try {
			const response = await authApi.changePassword({
				userId: user.id,
				currentPassword,
				newPassword,
			})

			if (response.success) {
				setAlertTitle('Success')
				setAlertMessage('Password changed successfully')
				setShowAlert(true)
				// Clear form
				setCurrentPassword('')
				setNewPassword('')
				setConfirmPassword('')
				setErrors({})
			} else {
				setAlertTitle('Error')
				setAlertMessage(response.error || 'Failed to change password')
				setShowAlert(true)
			}
		} catch (err) {
			console.error('Change password error:', err)
			setAlertTitle('Error')
			setAlertMessage('An error occurred. Please try again.')
			setShowAlert(true)
		} finally {
			setSaving(false)
		}
	}

	const isSaveDisabled = !hasChanges || saving

	return (
		<DynamicKeyboardView style={styles.container}>
			<DynamicScrollView
				styles={styles.scrollContent}
				autoCenter={false}>
				<Text style={styles.title}>Account Details</Text>

				{/* Change Password Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Change Password</Text>

					{/* Current Password */}
					<Text style={styles.inputLabel}>Current Password</Text>
					<TextInput
						style={[styles.input, errors.currentPassword && styles.inputError]}
						value={currentPassword}
						onChangeText={(text) => {
							setCurrentPassword(text)
							if (errors.currentPassword) {
								setErrors({ ...errors, currentPassword: undefined })
							}
						}}
						placeholder="Enter current password"
						placeholderTextColor={colors.textSecondary}
						secureTextEntry
						autoCapitalize="none"
					/>
					{errors.currentPassword && (
						<Text style={styles.errorText}>{errors.currentPassword}</Text>
					)}

					{/* New Password */}
					<Text style={styles.inputLabel}>New Password</Text>
					<TextInput
						style={[styles.input, errors.newPassword && styles.inputError]}
						value={newPassword}
						onChangeText={(text) => {
							setNewPassword(text)
							if (errors.newPassword) {
								setErrors({ ...errors, newPassword: undefined })
							}
						}}
						placeholder="Enter new password"
						placeholderTextColor={colors.textSecondary}
						secureTextEntry
						autoCapitalize="none"
					/>
					{errors.newPassword && (
						<Text style={styles.errorText}>{errors.newPassword}</Text>
					)}

					{/* Confirm Password */}
					<Text style={styles.inputLabel}>Confirm New Password</Text>
					<TextInput
						style={[styles.input, errors.confirmPassword && styles.inputError]}
						value={confirmPassword}
						onChangeText={(text) => {
							setConfirmPassword(text)
							if (errors.confirmPassword) {
								setErrors({ ...errors, confirmPassword: undefined })
							}
						}}
						placeholder="Confirm new password"
						placeholderTextColor={colors.textSecondary}
						secureTextEntry
						autoCapitalize="none"
					/>
					{errors.confirmPassword && (
						<Text style={styles.errorText}>{errors.confirmPassword}</Text>
					)}

					{/* Save Button */}
					<TouchableOpacity
						style={[
							styles.saveButton,
							isSaveDisabled && styles.saveButtonDisabled,
						]}
						onPress={handleSaveChanges}
						disabled={isSaveDisabled}>
						{saving ? (
							<ActivityIndicator
								size="small"
								color={colors.background}
							/>
						) : (
							<Text
								style={[
									styles.saveButtonText,
									isSaveDisabled && styles.saveButtonTextDisabled,
								]}>
								Save Changes
							</Text>
						)}
					</TouchableOpacity>
				</View>
			</DynamicScrollView>

			<AlertModal
				visible={showAlert}
				title={alertTitle}
				message={alertMessage}
				onClose={() => {
					setShowAlert(false)
					if (alertTitle === 'Success') {
						navigation.goBack()
					}
				}}
			/>
		</DynamicKeyboardView>
	)
}

export default AccountDetailsScreen
