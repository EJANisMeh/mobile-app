import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { LogoutButton } from '../../../components'
import { useAuthContext } from '../../../context'
import { concessionaireProfileStyles } from '../../../styles/concessionaire'

const ProfileScreen: React.FC = () => {
	const { user, isLoading, error, logout } = useAuthContext()

	return (
		<ScrollView style={concessionaireProfileStyles.profileContainer}>
			<View style={concessionaireProfileStyles.profileContent}>
				<Text style={concessionaireProfileStyles.profileTitle}>
					Concessionaire Profile
				</Text>

				{/* User Information */}
				{user && (
					<View style={concessionaireProfileStyles.userInfo}>
						<Text style={concessionaireProfileStyles.infoLabel}>Name:</Text>
						<Text style={concessionaireProfileStyles.infoValue}>
							{user.fname} {user.lname}
						</Text>

						<Text style={concessionaireProfileStyles.infoLabel}>Email:</Text>
						<Text style={concessionaireProfileStyles.infoValue}>
							{user.email}
						</Text>

						<Text style={concessionaireProfileStyles.infoLabel}>Role:</Text>
						<Text style={concessionaireProfileStyles.infoValue}>
							{user.role}
						</Text>

						<Text style={concessionaireProfileStyles.infoLabel}>
							Concession ID:
						</Text>
						<Text style={concessionaireProfileStyles.infoValue}>
							{user.concession_id || 'Not assigned'}
						</Text>

						<Text style={concessionaireProfileStyles.infoLabel}>Status:</Text>
						<Text style={concessionaireProfileStyles.infoValue}>
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
