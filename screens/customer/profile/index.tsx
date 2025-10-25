import React from 'react'
import { View, Text } from 'react-native'
import { LogoutButton } from '../../../components'
import { useAuthContext, useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createCustomerProfileStyles } from '../../../styles/customer'
import DynamicScrollView from '../../../components/DynamicScrollView'

const ProfileScreen: React.FC = () => {
	const { user, isLoading, error } = useAuthContext()
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const customerProfileStyles = createCustomerProfileStyles(colors, responsive)

	return (
		<DynamicScrollView
			styles={customerProfileStyles.profileContainer}
			autoCenter={false}
			showsVerticalScrollIndicator={false}>
			<View style={customerProfileStyles.profileContent}>
				<Text style={customerProfileStyles.profileTitle}>Customer Profile</Text>

				{/* User Information */}
				{user && (
					<View style={customerProfileStyles.userInfo}>
						<Text style={customerProfileStyles.infoLabel}>Name:</Text>
						<Text style={customerProfileStyles.infoValue}>
							{user.fname} {user.lname}
						</Text>

						<Text style={customerProfileStyles.infoLabel}>Email:</Text>
						<Text style={customerProfileStyles.infoValue}>{user.email}</Text>

						<Text style={customerProfileStyles.infoLabel}>Role:</Text>
						<Text style={customerProfileStyles.infoValue}>{user.role}</Text>

						<Text style={customerProfileStyles.infoLabel}>Status:</Text>
						<Text style={customerProfileStyles.infoValue}>
							{user.emailVerified ? 'Verified' : 'Unverified'}
						</Text>
					</View>
				)}

				{/* Logout Button */}
				<LogoutButton />
			</View>
		</DynamicScrollView>
	)
}

export default ProfileScreen
