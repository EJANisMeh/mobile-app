import React, { useState } from 'react'
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
	const [isLoggingOut, setIsLoggingOut] = useState(false)

	const handleLogout = () => {
		if (isLoggingOut) return // Prevent multiple clicks during logout

		confirmationModal.showConfirmation({
			title: 'Confirm Logout',
			message: 'Are you sure you want to logout?',
			confirmText: 'Logout',
			confirmStyle: 'destructive',
			onConfirm: async () => {
				try {
					setIsLoggingOut(true)
					await logout()
				} catch (error) {
					console.error('Logout error:', error)
					alertModal.showAlert({
						title: 'Error',
						message: 'Failed to logout. Please try again.',
					})
				} finally {
					setIsLoggingOut(false)
				}
			},
		})
	}

	return (
		<>
			<TouchableOpacity
				style={[
					styles.logoutButton,
					style,
					isLoggingOut && styles.disabledButton,
				]}
				onPress={handleLogout}
				disabled={isLoggingOut}>
				<Text style={[styles.logoutText, textStyle]}>
					{isLoggingOut ? 'Logging out...' : title}
				</Text>
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
	disabledButton: {
		backgroundColor: '#6c757d',
		opacity: 0.6,
	},
	logoutText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
})
