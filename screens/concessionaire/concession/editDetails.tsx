import React, { useState, useEffect } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'
import {
	useThemeContext,
	useConcessionContext,
} from '../../../context'
import { useAlertModal, useResponsiveDimensions } from '../../../hooks'
import { createEditConcessionStyles } from '../../../styles/concessionaire'
import { AlertModal } from '../../../components/modals'
import DynamicScrollView from '../../../components/DynamicScrollView'
import {
	LoadingEditConcession,
	EditConcessionImage,
	EditConcessionForm,
	EditConcessionSaveButton,
} from '../../../components/concessionaire/concession/editDetails'

const EditConcessionDetailsScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const { concession, loading, updateConcession } = useConcessionContext()
	const navigation = useNavigation()
	const styles = createEditConcessionStyles(colors, responsive)

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



	const handleCancel = () => {
		navigation.goBack()
	}

	// Loading state
	if (loading && !concession) {
		return (
			<LoadingEditConcession />
		)
	}

	return (
		<>
			<DynamicScrollView
				styles={styles.container}
				autoCenter={false}
				showsVerticalScrollIndicator={true}>
				<View style={styles.scrollContent}>
					{/* Image Preview Section */}
					<EditConcessionImage
						imageUrl={imageUrl}
						setImageUrl={setImageUrl}
					/>

					{/* Form Fields */}
					<EditConcessionForm
						name={name}
						setName={setName}
						description={description}
						setDescription={setDescription}
						showAlert={showAlert}
					/>

					{/* Action Buttons */}
					<View style={styles.actionButtonsContainer}>
						{/* Cancel Button */}
						<TouchableOpacity
							style={styles.cancelButton}
							onPress={handleCancel}
							disabled={isSaving}>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>

						{/* Save Button */}
						<EditConcessionSaveButton
							name={name}
							description={description}
							imageUrl={imageUrl}
							isSaving={isSaving}
							setIsSaving={setIsSaving}
							showAlert={showAlert}
						/>
					</View>
				</View>
			</DynamicScrollView>

			<AlertModal
				visible={visible}
				onClose={hideAlert}
				title={title}
				message={message}
			/>
		</>
	)
}

export default EditConcessionDetailsScreen
