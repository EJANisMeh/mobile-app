import React from 'react'
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native'
import { useAuth } from '../context'

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

	const handleLogout = () => {
		Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Logout',
				style: 'destructive',
				onPress: async () => {
					try {
						await logout()
					} catch (error) {
						console.error('Logout error:', error)
						Alert.alert('Error', 'Failed to logout. Please try again.')
					}
				},
			},
		])
	}

	return (
		<TouchableOpacity
			style={[styles.logoutButton, style]}
			onPress={handleLogout}>
			<Text style={[styles.logoutText, textStyle]}>{title}</Text>
		</TouchableOpacity>
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
