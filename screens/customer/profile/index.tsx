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
import { useCustomerNavigation } from '../../../hooks/useNavigation'
import { createCustomerProfileStyles } from '../../../styles/customer'

const ProfileScreen: React.FC = () => {
	const { user, isLoading, error } = useAuthContext()
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const navigation = useCustomerNavigation()
	const customerProfileStyles = createCustomerProfileStyles(colors, responsive)

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
				styles={customerProfileStyles.profileContainer}
				autoCenter={"center"}>
				<View style={customerProfileStyles.profileContent}>
					{/* Profile Header */}
					<View style={customerProfileStyles.profileHeader}>
						{/* Profile Image */}
						<View style={customerProfileStyles.profileImageContainer}>
							{user?.image_url ? (
								<Image
									source={{ uri: user.image_url }}
									style={customerProfileStyles.profileImage}
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
								<Text style={customerProfileStyles.profileName}>
									{user.fname} {user.lname}
								</Text>
								<Text style={customerProfileStyles.profileEmail}>
									{user.email}
								</Text>
							</>
						)}

						{/* Edit Button */}
						<View style={customerProfileStyles.editButtonContainer}>
							<TouchableOpacity
								style={customerProfileStyles.editButton}
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
						<View style={customerProfileStyles.userInfo}>
							<Text style={customerProfileStyles.sectionTitle}>
								Contact Information
							</Text>

							{contactDetails.length > 0 ? (
								contactDetails.map((contact: any, index: number) => (
									<View
										key={index}
										style={customerProfileStyles.contactItem}>
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
											style={customerProfileStyles.contactIcon}
										/>
										<Text style={customerProfileStyles.contactText}>
											{contact.value}
										</Text>
									</View>
								))
							) : (
								<Text style={customerProfileStyles.noContactsText}>
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
