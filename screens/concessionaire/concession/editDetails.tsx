import React, { useState, useEffect } from 'react'
import {
	View,
	Text,
	ScrollView,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	Image,
	Platform,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'
import {
	useThemeContext,
	useConcessionContext,
	useAuthContext,
} from '../../../context'
import { useAlertModal } from '../../../hooks'
import { createEditConcessionStyles } from '../../../styles/themedStyles'
import { AlertModal } from '../../../components/modals'
import { UpdateConcessionData } from '../../../types'

const EditConcessionDetailsScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const { user } = useAuthContext()
	const { concession, loading, updateConcession } = useConcessionContext()
	const navigation = useNavigation()
	const styles = createEditConcessionStyles(colors)

	const { visible, title, message, showAlert, hideAlert } = useAlertModal()
	const [isSaving, setIsSaving] = useState(false)

	// Form state
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [imageUrl, setImageUrl] = useState('')

	// Initialize form with current concession data
	useEffect(() => {
		if (concession) {
			setName(concession.name || '')
			setDescription(concession.description || '')
			setImageUrl(concession.image_url || '')
		}
	}, [concession])

	// Hide system navigation buttons on Android when screen mounts
	useEffect(() => {
		const hideNavigationBar = async () => {
			if (Platform.OS === 'android') {
				try {
					// Hide the navigation bar (system buttons)
					await NavigationBar.setVisibilityAsync('hidden')
					// Note: setBehaviorAsync is not needed with edge-to-edge mode
					// The system automatically handles swipe-to-show behavior
				} catch (error) {
					console.log('Error hiding navigation bar:', error)
				}
			}
		}

		const showNavigationBar = async () => {
			if (Platform.OS === 'android') {
				try {
					// Show the navigation bar when leaving the screen
					await NavigationBar.setVisibilityAsync('visible')
				} catch (error) {
					console.log('Error showing navigation bar:', error)
				}
			}
		}

		hideNavigationBar()

		// Cleanup: show navigation bar when component unmounts
		return () => {
			showNavigationBar()
		}
	}, [])

	const handleSave = async () => {
		// Validation
		if (!name.trim()) {
			showAlert({
				title: 'Validation Error',
				message: 'Concession name is required',
			})
			return
		}

		if (!concession?.id) {
			showAlert({
				title: 'Error',
				message: 'No concession found to update',
			})
			return
		}

		setIsSaving(true)

		try {
			const updateData: UpdateConcessionData = {
				name: name.trim(),
				description: description.trim() || null,
				image_url: imageUrl.trim() || null,
			}

			const result = await updateConcession(concession.id, updateData)

			if (result.success) {
				showAlert({
					title: 'Success',
					message: 'Concession details updated successfully',
				})
				// Navigate back after a short delay
				setTimeout(() => {
					navigation.goBack()
				}, 1500)
			} else {
				showAlert({
					title: 'Error',
					message: result.error || 'Failed to update concession details',
				})
			}
		} catch (err) {
			showAlert({
				title: 'Error',
				message:
					err instanceof Error ? err.message : 'An unexpected error occurred',
			})
		} finally {
			setIsSaving(false)
		}
	}

	const handleCancel = () => {
		navigation.goBack()
	}

	// Loading state
	if (loading && !concession) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator
					size="large"
					color={colors.primary}
				/>
				<Text style={styles.loadingText}>Loading concession...</Text>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}>
				{/* Image Preview Section */}
				{imageUrl ? (
					<View style={styles.imagePreviewContainer}>
						<Image
							source={{ uri: imageUrl }}
							style={styles.imagePreview}
							resizeMode="cover"
						/>
						<TouchableOpacity
							style={styles.removeImageButton}
							onPress={() => setImageUrl('')}>
							<MaterialCommunityIcons
								name="close-circle"
								size={24}
								color="#fff"
							/>
						</TouchableOpacity>
					</View>
				) : (
					<View style={styles.imagePlaceholder}>
						<MaterialCommunityIcons
							name="image-plus"
							size={48}
							color={colors.placeholder}
						/>
						<Text style={styles.imagePlaceholderText}>No image selected</Text>
					</View>
				)}

				{/* Form Fields */}
				<View style={styles.formSection}>
					{/* Name Field */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>
							Concession Name <Text style={styles.required}>*</Text>
						</Text>
						<TextInput
							style={styles.input}
							placeholder="Enter concession name"
							placeholderTextColor={colors.placeholder}
							value={name}
							onChangeText={setName}
							maxLength={100}
						/>
					</View>

					{/* Description Field */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Description</Text>
						<TextInput
							style={[styles.input, styles.textArea]}
							placeholder="Describe your concession..."
							placeholderTextColor={colors.placeholder}
							value={description}
							onChangeText={setDescription}
							multiline
							numberOfLines={7}
							textAlignVertical="top"
							maxLength={1500}
						/>
						<Text style={styles.charCount}>
							{description.length}/1500 characters
						</Text>
					</View>

					{/* Schedule Section - Placeholder */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Operating Schedule</Text>
						<TouchableOpacity
							style={styles.scheduleButton}
							onPress={() =>
								showAlert({
									title: 'Coming Soon',
									message: 'Schedule management feature is under development',
								})
							}>
							<MaterialCommunityIcons
								name="calendar-clock"
								size={24}
								color={colors.primary}
								style={styles.scheduleIcon}
							/>
							<Text style={styles.scheduleButtonText}>
								Configure Operating Hours
							</Text>
							<MaterialCommunityIcons
								name="chevron-right"
								size={24}
								color={colors.placeholder}
							/>
						</TouchableOpacity>
						<Text style={styles.hint}>
							Set your daily operating hours and breaks
						</Text>
					</View>
				</View>
			</ScrollView>

			{/* Action Buttons */}
			<View style={styles.actionButtonsContainer}>
				<TouchableOpacity
					style={styles.cancelButton}
					onPress={handleCancel}
					disabled={isSaving}>
					<Text style={styles.cancelButtonText}>Cancel</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
					onPress={handleSave}
					disabled={isSaving}>
					{isSaving ? (
						<ActivityIndicator
							size="small"
							color="#fff"
						/>
					) : (
						<>
							<MaterialCommunityIcons
								name="content-save"
								size={20}
								color="#fff"
								style={styles.saveButtonIcon}
							/>
							<Text style={styles.saveButtonText}>Save Changes</Text>
						</>
					)}
				</TouchableOpacity>
			</View>

			<AlertModal
				visible={visible}
				onClose={hideAlert}
				title={title}
				message={message}
			/>
		</View>
	)
}

export default EditConcessionDetailsScreen
