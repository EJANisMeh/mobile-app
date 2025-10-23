import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { useThemeContext, useAuthContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createProfileCreationStyles } from '../../../styles/auth'
import { ProfileCreationData } from '../../../types/authTypes'
import {
	UseAlertModalType,
	UseConfirmationModalType,
} from '../../../hooks/useModals/types'

interface SubmitButtonProps {
	userId: number
	formData: ProfileCreationData
	showAlert: UseAlertModalType['showAlert']
	showConfirmation: UseConfirmationModalType['showConfirmation']
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
	userId,
	formData,
	showAlert,
	showConfirmation,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const profileCreationStyles = createProfileCreationStyles(colors, responsive)
	const { isLoading, completeProfile } = useAuthContext()

	const handleSubmit = async () => {
		// Validate required fields
		if (!formData.fname.trim() || !formData.lname.trim()) {
			showAlert({
				title: 'Missing Information',
				message: 'Please enter your first name and last name.',
			})
			return
		}

		showConfirmation({
			title: 'Confirm Profile Creation',
			message:
				'Are you sure with the profile information you have provided?',
			confirmText: 'Confirm',
			cancelText: 'Cancel',
			onConfirm: async () => {
				try {
					const result = await completeProfile({
						userId,
						fname: formData.fname,
						lname: formData.lname,
						image_url: formData.image_url,
						contact_details: formData.contact_details,
					})

					if (!result.success) {
						showAlert({
							title: 'Error',
							message: 'Failed to create profile. Please try again.',
						})
					}
				} catch (error) {
					showAlert({
						title: 'Error',
						message: 'An unexpected error occurred. Please try again.',
					})
				}
			},
		})
	}

	return (
		<TouchableOpacity
			style={[
				profileCreationStyles.submitButton,
				isLoading && profileCreationStyles.disabledButton,
			]}
			onPress={handleSubmit}
			disabled={isLoading}
			activeOpacity={isLoading ? 1 : 0.7}>
			{isLoading ? (
				<ActivityIndicator
					size="small"
					color={colors.textOnPrimary}
				/>
			) : (
				<Text style={profileCreationStyles.submitButtonText}>
					Complete Profile
				</Text>
			)}
		</TouchableOpacity>
	)
}

export default SubmitButton
