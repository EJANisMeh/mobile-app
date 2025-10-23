import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { useThemeContext, useAuthContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createProfileCreationStyles } from '../../../styles/auth'
import { ProfileCreationData } from '../../../types'
import { UseAlertModalType } from '../../../hooks/useModals/types'

interface ImagePickerProps {
	formData: ProfileCreationData
	showAlert: UseAlertModalType['showAlert']
}

const ImagePicker: React.FC<ImagePickerProps> = ({ formData, showAlert }) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const profileCreationStyles = createProfileCreationStyles(colors, responsive)
	const { isLoading } = useAuthContext()

	return (
		<TouchableOpacity
			style={[
				profileCreationStyles.imagePickerButton,
				isLoading && { opacity: 0.6 },
			]}
			disabled={isLoading}
			onPress={() => {
				// TODO: Implement image picker
				showAlert({
					title: 'Coming Soon',
					message: 'Image upload feature will be available soon.',
				})
			}}>
			<Text style={profileCreationStyles.imagePickerText}>
				{formData.image_url
					? 'Profile Picture Selected'
					: 'Add Profile Picture (Optional)'}
			</Text>
			{formData.image_url && (
				<Text style={profileCreationStyles.selectedImageText}>
					Tap to change
				</Text>
			)}
		</TouchableOpacity>
	)
}

export default ImagePicker
