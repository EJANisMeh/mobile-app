import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from 'react-native'
import { useAuthContext, useThemeContext } from '../../../context'
import { AlertModal } from '../../../components'
import { useAlertModal, useResponsiveDimensions } from '../../../hooks'
import { createProfileCreationStyles } from '../../../styles/themedStyles'
import { ProfileCreationScreenProps, ProfileCreationData } from '../../../types'

const ProfileCreationScreen: React.FC<ProfileCreationScreenProps> = ({
	navigation,
	route,
}) => {
	const { userId } = route.params
	const { colors } = useThemeContext()
	const profileCreationStyles = createProfileCreationStyles(colors)
	const responsive = useResponsiveDimensions()
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
					message: 'Profile created successfully! You can now access your account.',
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
			<KeyboardAvoidingView
				key={responsive.isLandscape ? 'landscape' : 'portrait'}
				style={profileCreationStyles.container}
				behavior="padding"
				enabled={true}
				keyboardVerticalOffset={Platform.OS === 'android' ? -100 : 0}>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					keyboardShouldPersistTaps="handled"
					bounces={false}
					showsVerticalScrollIndicator={false}>
					<View style={profileCreationStyles.content}>
						<Text style={profileCreationStyles.title}>Complete Your Profile</Text>
						<Text style={profileCreationStyles.subtitle}>
							Enter your details to get started
						</Text>

						<View style={profileCreationStyles.form}>
							<TextInput
								style={[
									profileCreationStyles.input,
									isLoading && { opacity: 0.6 },
								]}
								placeholder="First Name *"
								value={formData.fname}
								onChangeText={(text) => updateField('fname', text)}
								editable={!isLoading}
								autoCapitalize="words"
							/>

							<TextInput
								style={[
									profileCreationStyles.input,
									isLoading && { opacity: 0.6 },
								]}
								placeholder="Last Name *"
								value={formData.lname}
								onChangeText={(text) => updateField('lname', text)}
								editable={!isLoading}
								autoCapitalize="words"
							/>

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
										? '✓ Profile Picture Selected'
										: '📷 Add Profile Picture (Optional)'}
								</Text>
								{formData.image_url && (
									<Text style={profileCreationStyles.selectedImageText}>
										Tap to change
									</Text>
								)}
							</TouchableOpacity>

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
				</ScrollView>
			</KeyboardAvoidingView>

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
