import { StyleSheet } from 'react-native'

export const logoutButtonStyles = StyleSheet.create({
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