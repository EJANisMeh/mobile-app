import React, { useState, useEffect } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Platform,
	BackHandler,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'
import { useThemeContext, useConcessionContext } from '../../../context'
import {
	useAlertModal,
	useResponsiveDimensions,
	useConfirmationModal,
} from '../../../hooks'
import { createEditConcessionStyles } from '../../../styles/concessionaire'
import { AlertModal, ConfirmationModal } from '../../../components/modals'
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
	const { concession, loading } = useConcessionContext()
	const navigation = useNavigation()
	const styles = createEditConcessionStyles(colors, responsive)

	const { visible, title, message, showAlert, hideAlert } = useAlertModal()
	const {
		visible: confirmVisible,
		props: confirmProps,
		showConfirmation,
		hideConfirmation,
	} = useConfirmationModal()
	const [isSaving, setIsSaving] = useState(false)

	// Form state
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [imageUrl, setImageUrl] = useState('')
	const [edited, setEdited] = useState(false)

	// Store initial values to compare against
	const [initialValues, setInitialValues] = useState({
		name: '',
		description: '',
		imageUrl: '',
	})

	// Initialize form with current concession data
	useEffect(() => {
		if (concession) {
			const initialName = concession.name || ''
			const initialDescription = concession.description || ''
			const initialImageUrl = concession.image_url || ''

			setName(initialName)
			setDescription(initialDescription)
			setImageUrl(initialImageUrl)

			// Store initial values
			setInitialValues({
				name: initialName,
				description: initialDescription,
				imageUrl: initialImageUrl,
			})
		}
	}, [concession])

	// Check if form has been edited
	useEffect(() => {
		const hasChanges =
			name !== initialValues.name ||
			description !== initialValues.description ||
			imageUrl !== initialValues.imageUrl

		setEdited(hasChanges)
	}, [name, description, imageUrl, initialValues])

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
		if (edited) {
			showConfirmation({
				title: 'Discard Changes?',
				message:
					'You have unsaved changes. Are you sure you want to cancel? Your changes will be lost.',
				confirmText: 'Confirm cancel',
				cancelText: 'Keep Editing',
				confirmStyle: 'destructive',
				onConfirm: () => {
					navigation.goBack()
				},
			})
			return
		}

		navigation.goBack()
	}

	// Handle Android hardware back button
	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				handleCancel()
				return true // Prevent default back behavior
			}
		)

		return () => backHandler.remove() // Remove backhandler function after unmounting
	}, [edited])

	// Loading state
	if (loading && !concession) {
		return <LoadingEditConcession />
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
							edited={edited}
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

			<ConfirmationModal
				visible={confirmVisible}
				onClose={hideConfirmation}
				title={confirmProps.title}
				message={confirmProps.message}
				confirmText={confirmProps.confirmText}
				cancelText={confirmProps.cancelText}
				confirmStyle={confirmProps.confirmStyle}
				onConfirm={confirmProps.onConfirm}
			/>
		</>
	)
}

export default EditConcessionDetailsScreen
