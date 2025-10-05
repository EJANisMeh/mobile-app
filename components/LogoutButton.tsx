import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useAuth } from '../context'
import { ConfirmationModal, AlertModal } from './modals'
import { useConfirmationModal, useAlertModal } from '../hooks'

interface LogoutButtonProps {
	style?: any
	textStyle?: any
	title?: string
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
	style,
	textStyle,
	title = 'Logout',
}) => {
	const { logout } = useAuth()
	const confirmationModal = useConfirmationModal()
	const alertModal = useAlertModal()

	const handleLogout = () => {
		confirmationModal.showConfirmation({
			title: 'Confirm Logout',
			message: 'Are you sure you want to logout?',
			confirmText: 'Logout',
			confirmStyle: 'destructive',
			onConfirm: async () => {
				try {
					await logout()
				} catch (error) {
					console.error('Logout error:', error)
					alertModal.showAlert({
						title: 'Error',
						message: 'Failed to logout. Please try again.',
					})
				}
			},
		})
	}

	return (
		<>
			<TouchableOpacity
				style={[styles.logoutButton, style]}
				onPress={handleLogout}>
				<Text style={[styles.logoutText, textStyle]}>{title}</Text>
			</TouchableOpacity>

			<ConfirmationModal
				visible={confirmationModal.visible}
				onClose={confirmationModal.hideConfirmation}
				{...confirmationModal.props}
			/>

			<AlertModal
				visible={alertModal.visible}
				onClose={alertModal.hideAlert}
				title={alertModal.title}
				message={alertModal.message}
			/>
		</>
	)
}

const styles = StyleSheet.create({
	logoutButton: {
		backgroundColor: '#dc3545',
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 20,
	},
	logoutText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
})
