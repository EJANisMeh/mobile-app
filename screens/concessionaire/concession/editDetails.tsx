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
let NavigationBar: any = null
try {
	// lazy require so TypeScript doesn't fail if module not installed in some environments
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	NavigationBar = require('expo-navigation-bar')
} catch (e) {
	NavigationBar = null
}
import { StatusBar as RNStatusBar } from 'react-native'
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
	const [isFullscreen, setIsFullscreen] = useState(false)

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

	// Cleanup: ensure system UI is restored when leaving the screen
	useEffect(() => {
		return () => {
			// restore status and navigation bars
			try {
				RNStatusBar.setHidden(false)
				if (Platform.OS === 'android' && NavigationBar && NavigationBar.setVisibilityAsync) {
					NavigationBar.setVisibilityAsync('visible')
				}
			} catch (e) {
				// ignore
			}
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

	const toggleFullscreen = async () => {
		const next = !isFullscreen
		setIsFullscreen(next)
		try {
			RNStatusBar.setHidden(next)
			if (Platform.OS === 'android' && NavigationBar && NavigationBar.setVisibilityAsync) {
				// set behavior so the nav can be revealed with a swipe
				if (NavigationBar.setBehaviorAsync) await NavigationBar.setBehaviorAsync('overlay-swipe')
				await NavigationBar.setVisibilityAsync(next ? 'hidden' : 'visible')
			}
		} catch (err) {
			// ignore errors on unsupported platforms
		}
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

					{/* Image URL Field */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Image URL</Text>
						<TextInput
							style={styles.input}
							placeholder="https://example.com/image.jpg"
							placeholderTextColor={colors.placeholder}
							value={imageUrl}
							onChangeText={setImageUrl}
							autoCapitalize="none"
							keyboardType="url"
						/>
						<Text style={styles.hint}>
							Enter a direct link to an image (optional)
						</Text>
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
							numberOfLines={4}
							textAlignVertical="top"
							maxLength={500}
						/>
						<Text style={styles.charCount}>
							{description.length}/500 characters
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
