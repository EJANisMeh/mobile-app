import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
	DynamicKeyboardView,
	DynamicScrollView,
	LogoutButton,
} from '../../../components'
import { useAuthContext, useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { useConcessionaireNavigation } from '../../../hooks/useNavigation'
import { createConcessionaireProfileStyles } from '../../../styles/concessionaire'

const ProfileScreen: React.FC = () => {
	const { user, isLoading, error, logout } = useAuthContext()
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const navigation = useConcessionaireNavigation()
	const concessionaireProfileStyles = createConcessionaireProfileStyles(
		colors,
		responsive
	)

	const handleEditAccount = () => {
		navigation.navigate('AccountDetails')
	}

	// Parse contact details
	const contactDetails = user?.contact_details
		? Array.isArray(user.contact_details)
			? user.contact_details
			: []
		: []

	return (
		<DynamicKeyboardView>
			<DynamicScrollView
				styles={concessionaireProfileStyles.profileContainer}
				autoCenter={"center"}>
				<View style={concessionaireProfileStyles.profileContent}>
					{/* Profile Header */}
					<View style={concessionaireProfileStyles.profileHeader}>
						{/* Profile Image */}
						<View style={concessionaireProfileStyles.profileImageContainer}>
							{user?.image_url ? (
								<Image
									source={{ uri: user.image_url }}
									style={concessionaireProfileStyles.profileImage}
								/>
							) : (
								<MaterialCommunityIcons
									name="account-circle"
									size={120}
									color={colors.textSecondary}
								/>
							)}
						</View>

						{/* Name and Email */}
						{user && (
							<>
								<Text style={concessionaireProfileStyles.profileName}>
									{user.fname} {user.lname}
								</Text>
								<Text style={concessionaireProfileStyles.profileEmail}>
									{user.email}
								</Text>
							</>
						)}

						{/* Edit Button */}
						<View style={concessionaireProfileStyles.editButtonContainer}>
							<TouchableOpacity
								style={concessionaireProfileStyles.editButton}
								onPress={handleEditAccount}>
								<MaterialCommunityIcons
									name="account-edit"
									size={24}
									color={colors.background}
								/>
							</TouchableOpacity>
						</View>
					</View>

					{/* Contact Information */}
					{user && (
						<View style={concessionaireProfileStyles.userInfo}>
							<Text style={concessionaireProfileStyles.sectionTitle}>
								Contact Information
							</Text>

							{contactDetails.length > 0 ? (
								contactDetails.map((contact: any, index: number) => (
									<View
										key={index}
										style={concessionaireProfileStyles.contactItem}>
										<MaterialCommunityIcons
											name={
												contact.type === 'phone'
													? 'phone'
													: contact.type === 'email'
													? 'email'
													: 'card-account-details'
											}
											size={20}
											color={colors.primary}
											style={concessionaireProfileStyles.contactIcon}
										/>
										<Text style={concessionaireProfileStyles.contactText}>
											{contact.value}
										</Text>
									</View>
								))
							) : (
								<Text style={concessionaireProfileStyles.noContactsText}>
									No contact information added
								</Text>
							)}
						</View>
					)}

					{/* Logout Button */}
					<LogoutButton />
				</View>
			</DynamicScrollView>
		</DynamicKeyboardView>
	)
}

export default ProfileScreen
