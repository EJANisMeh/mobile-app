import { StyleSheet } from 'react-native'

export const emailVerificationStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8f9fa',
	},
	content: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 80,
		alignItems: 'center',
	},
	iconContainer: {
		marginBottom: 32,
	},
	icon: {
		fontSize: 64,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#333',
		textAlign: 'center',
		marginBottom: 16,
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
		marginBottom: 8,
	},
	email: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#007bff',
		textAlign: 'center',
		marginBottom: 16,
	},
	description: {
		fontSize: 14,
		color: '#666',
		textAlign: 'center',
		lineHeight: 20,
		marginBottom: 40,
		paddingHorizontal: 20,
	},
	actions: {
		width: '100%',
		paddingHorizontal: 20,
	},
	primaryButton: {
		backgroundColor: '#007bff',
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: 'center',
		marginBottom: 16,
		shadowColor: '#007bff',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
	},
	primaryButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	secondaryButton: {
		backgroundColor: 'white',
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: 'center',
		marginBottom: 16,
		borderWidth: 1,
		borderColor: '#007bff',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	disabledButton: {
		backgroundColor: '#f5f5f5',
		borderColor: '#ccc',
		shadowOpacity: 0,
	},
	secondaryButtonText: {
		color: '#007bff',
		fontSize: 16,
		fontWeight: '600',
	},
	logoutButton: {
		paddingVertical: 12,
		alignItems: 'center',
	},
	logoutButtonText: {
		color: '#666',
		fontSize: 16,
		fontWeight: '500',
	},
})
