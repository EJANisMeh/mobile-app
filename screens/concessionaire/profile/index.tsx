import React from 'react'
import { View, Text } from 'react-native'
import { LogoutButton } from '../../../components'
import { useAuthContext, useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createConcessionaireProfileStyles } from '../../../styles/concessionaire'
import DynamicScrollView from '../../../components/DynamicScrollView'

const ProfileScreen: React.FC = () => {
	const { user, isLoading, error, logout } = useAuthContext()
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const concessionaireProfileStyles = createConcessionaireProfileStyles(
		colors,
		responsive
	)

	return (
		<DynamicScrollView
			styles={concessionaireProfileStyles.profileContainer}
			autoCenter={false}
			showsVerticalScrollIndicator={false}>
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
		</DynamicScrollView>
	)
}

export default ProfileScreen
