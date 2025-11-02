import React from 'react'
import { Text, ScrollView, Image, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionaireAddMenuItemStyles } from '../../../../styles/concessionaire/addMenuItem'
import { AddMenuItemFormData } from '../../../../types'
import { UseAlertModalType } from '../../../../hooks/useModals/types'
import * as ImagePicker from 'expo-image-picker'

interface ImagePickerSectionProps {
	formData: AddMenuItemFormData
	setFormData: React.Dispatch<React.SetStateAction<AddMenuItemFormData>>
	showAlert: UseAlertModalType['showAlert']
}

const ImagePickerSection: React.FC<ImagePickerSectionProps> = ({
	formData,
	setFormData,
	showAlert,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireAddMenuItemStyles(colors, responsive)

	const handleRemoveImage = (index: number) => {
		setFormData((prev) => {
			const newImages = prev.images.filter((_, i) => i !== index)
			let newDisplayIndex = prev.displayImageIndex

			// Adjust displayImageIndex if needed
			if (newImages.length === 0) {
				newDisplayIndex = 0
			} else if (prev.displayImageIndex >= newImages.length) {
				newDisplayIndex = newImages.length - 1
			} else if (prev.displayImageIndex > index) {
				newDisplayIndex = prev.displayImageIndex - 1
			}

			return {
				...prev,
				images: newImages,
				displayImageIndex: newDisplayIndex,
			}
		})
	}

	const handlePickImage = async () => {
		if (formData.images.length >= 3) {
			showAlert({
				title: 'Image Limit',
				message: 'You can only add up to 3 images',
			})
			return
		}

		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
		if (status !== 'granted') {
			showAlert({
				title: 'Permission Required',
				message: 'Please grant permission to access photos',
			})
			return
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: 'images' as ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 0.8,
		})

		if (!result.canceled && result.assets[0]) {
			setFormData((prev) => ({
				...prev,
				images: [...prev.images, result.assets[0].uri],
			}))
		}
	}

	return (
		<>
			<Text style={styles.sectionTitle}>Images (Max 3)</Text>
			{formData.images.length > 0 && (
				<Text style={styles.imagePickerHint}>
					Tap an image to set as display image
				</Text>
			)}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={true}
				style={styles.imageScrollView}>
				<View style={styles.imageContainer}>
					{formData.images.map((uri, index) => (
						<TouchableOpacity
							key={index}
							onPress={() =>
								setFormData((prev) => ({ ...prev, displayImageIndex: index }))
							}
							style={[
								styles.imageWrapper,
								formData.displayImageIndex === index && {
									borderWidth: 3,
									borderColor: colors.primary,
								},
							]}>
							<Image
								source={{ uri }}
								style={styles.image}
							/>
							{formData.displayImageIndex === index && (
								<View style={styles.displayImageBadge}>
									<Text style={styles.displayImageBadgeText}>
										DISPLAY
									</Text>
								</View>
							)}
							<TouchableOpacity
								style={styles.imageRemoveButton}
								onPress={() => handleRemoveImage(index)}>
								<Ionicons
									name="close"
									size={16}
									color="#fff"
								/>
							</TouchableOpacity>
						</TouchableOpacity>
					))}
					{formData.images.length < 3 && (
						<TouchableOpacity
							style={styles.addImageButton}
							onPress={handlePickImage}>
							<Ionicons
								name="add"
								size={32}
								color={colors.textSecondary}
							/>
							<Text style={styles.addImageButtonText}>
								Add Image
							</Text>
						</TouchableOpacity>
					)}
				</View>
			</ScrollView>
		</>
	)
}

export default ImagePickerSection
