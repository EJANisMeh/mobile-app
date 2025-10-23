import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native'
import { useAuthContext, useThemeContext } from '../../../context'
import { AlertModal } from '../../../components'
import { useAlertModal, useResponsiveDimensions } from '../../../hooks'
import { createProfileCreationStyles } from '../../../styles/auth'
import { ProfileCreationData } from '../../../types'
import DynamicScrollView from '../../../components/DynamicScrollView'
import { NameInputs } from '../../../components/auth/profileCreation'

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
	const { completeProfile } = useAuthContext()
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState<ProfileCreationData>({
		fname: '',
		lname: '',
		image_url: undefined,
		contact_details: [],
	})

	const handleSubmit = async () => {
		// Validate required fields
		if (!formData.fname.trim() || !formData.lname.trim()) {
			showAlert({
				title: 'Missing Information',
				message: 'Please enter your first name and last name.',
			})
			return
		}

		setIsLoading(true)
		try {
			const success = await completeProfile({
				userId,
				fname: formData.fname,
				lname: formData.lname,
				image_url: formData.image_url,
				contact_details: formData.contact_details,
			})

			if (success) {
				showAlert({
					title: 'Success',
					message:
						'Profile created successfully! You can now access your account.',
					onConfirm: () => {
						hideAlert()
						// RootNavigator will automatically handle navigation based on auth state
					},
				})
			} else {
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
		} finally {
			setIsLoading(false)
		}
	}

	const updateField = (field: keyof ProfileCreationData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
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

	return (
		<>
			<DynamicScrollView
				styles={profileCreationStyles.container}
				autoCenter="center"
				fallbackAlign="flex-start">
				<View style={profileCreationStyles.content}>
					<Text style={profileCreationStyles.title}>Complete Your Profile</Text>
					<Text style={profileCreationStyles.subtitle}>
						Enter your details to get started
					</Text>

					<View style={profileCreationStyles.form}>
						<NameInputs formData={formData} updateField={updateField} />

						<View style={profileCreationStyles.contactDetailsContainer}>
							<Text style={profileCreationStyles.contactDetailsLabel}>
								Contact Details (Optional)
							</Text>
							<Text style={profileCreationStyles.contactDetailsHint}>
								Add phone numbers, social media, etc.
							</Text>

							{(formData.contact_details || []).map((contact, index) => (
								<View
									key={index}
									style={profileCreationStyles.contactItem}>
									<TextInput
										style={profileCreationStyles.contactInput}
										placeholder="e.g., +639123456789 or @username"
										value={contact}
										onChangeText={(text) => updateContactDetail(index, text)}
										editable={!isLoading}
									/>
									<TouchableOpacity
										style={profileCreationStyles.removeContactButton}
										onPress={() => removeContactDetail(index)}
										disabled={isLoading}>
										<Text style={profileCreationStyles.removeContactText}>
											×
										</Text>
									</TouchableOpacity>
								</View>
							))}

							<TouchableOpacity
								style={profileCreationStyles.addContactButton}
								onPress={addContactDetail}
								disabled={isLoading}>
								<Text style={profileCreationStyles.addContactButtonText}>
									+ Add Contact Detail
								</Text>
							</TouchableOpacity>
						</View>

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

export default ProfileCreationScreen
