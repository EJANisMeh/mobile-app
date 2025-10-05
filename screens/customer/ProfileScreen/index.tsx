import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { LogoutButton } from '../../../components'
import { useAuth } from '../../../context'
import { customerProfileStyles } from '../../../styles/customer'

const ProfileScreen: React.FC = () => {
	const { user, isLoading, error } = useAuth()

	return (
		<ScrollView style={customerProfileStyles.profileContainer}>
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
		</ScrollView>
	)
}

export default ProfileScreen
