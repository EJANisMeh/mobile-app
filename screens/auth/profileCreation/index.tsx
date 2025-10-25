import React, { useEffect, useState } from 'react'
import { View, Text, BackHandler, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../../../context'
import { AlertModal, ConfirmationModal } from '../../../components'
import {
	useAlertModal,
	useConfirmationModal,
	useResponsiveDimensions,
	useAuthNavigation,
} from '../../../hooks'
import { createProfileCreationStyles } from '../../../styles/auth'
import { ProfileCreationData } from '../../../types'
import DynamicScrollView from '../../../components/DynamicScrollView'
import {
	NameInputs,
	ContactDetails,
	SubmitButton,
	ImagePicker,
} from '../../../components/auth/profileCreation'

interface ProfileCreationScreenProps {
	route: {
		params: {
			userId: number
		}
	}
}

const ProfileCreationScreen: React.FC<ProfileCreationScreenProps> = ({
	route,
}) => {
	const { userId } = route.params
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const profileCreationStyles = createProfileCreationStyles(colors, responsive)
	const { visible, title, message, showAlert, hideAlert } = useAlertModal()
	const {
		visible: confirmVisible,
		props: confirmProps,
		showConfirmation,
		hideConfirmation,
	} = useConfirmationModal()
	const navigation = useAuthNavigation()

	const [formData, setFormData] = useState<ProfileCreationData>({
		fname: '',
		lname: '',
		image_url: undefined,
		contact_details: [],
	})

	const updateField = (field: keyof ProfileCreationData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
	}

	const updateImageUrl = (url: string | undefined) => {
		setFormData((prev) => ({ ...prev, image_url: url }))
	}

	const addContactDetail = () => {
		setFormData((prev) => ({
			...prev,
			contact_details: [...(prev.contact_details || []), ''],
		}))
	}

	const updateContactDetail = (index: number, value: string) => {
		const newContacts = [...(formData.contact_details || [])]
		newContacts[index] = value
		setFormData((prev) => ({ ...prev, contact_details: newContacts }))
	}

	const removeContactDetail = (index: number) => {
		const newContacts = (formData.contact_details || []).filter(
			(_, i) => i !== index
		)
		setFormData((prev) => ({ ...prev, contact_details: newContacts }))
	}

	const handleCancel = () => {
		showConfirmation({
			title: 'Cancel Profile Creation?',
			message:
				'Are you sure you want to cancel profile creation? Your current input will not be saved.',
			confirmText: 'Yes',
			cancelText: 'No',
			onConfirm: () =>
			{
				updateField('fname', '')
				updateField('lname', '')
				updateImageUrl(undefined)
				setFormData((prev) => ({ ...prev, contact_details: [] }))
				// Handle cancellation logic
				navigation.reset({
					index: 0,
					routes: [{ name: 'Login' }],
				})
			},
		})
	}

	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				handleCancel()
				return true // Prevent default back behavior
			}
		)

		return () => backHandler.remove() // Remove backhandler function after unmounting
	}, [])

	return (
		<>
			<DynamicScrollView
				styles={profileCreationStyles.container}
				autoCenter="center">
				<View style={profileCreationStyles.content}>
					<Text style={profileCreationStyles.title}>Complete Your Profile</Text>
					<Text style={profileCreationStyles.subtitle}>
						Enter your details to get started
					</Text>

					<ImagePicker
						formData={formData}
						showAlert={showAlert}
					/>

					<View style={profileCreationStyles.form}>
						<NameInputs
							formData={formData}
							updateField={updateField}
						/>

						<ContactDetails
							formData={formData}
							updateContactDetail={updateContactDetail}
							removeContactDetail={removeContactDetail}
							addContactDetail={addContactDetail}
						/>

						<SubmitButton
							userId={userId}
							formData={formData}
							showAlert={showAlert}
							showConfirmation={showConfirmation}
						/>

						<TouchableOpacity
							style={profileCreationStyles.cancelButton}
							onPress={handleCancel}>
							<Text style={profileCreationStyles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>
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
				onCancel={confirmProps.onCancel}
			/>
		</>
	)
}

export default ProfileCreationScreen
