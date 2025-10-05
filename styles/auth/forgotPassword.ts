import { StyleSheet } from 'react-native'

export const forgotPasswordStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8f9fa',
	},
	content: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 60,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#333',
		textAlign: 'center',
		marginBottom: 16,
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
		lineHeight: 24,
		marginBottom: 40,
		paddingHorizontal: 20,
	},
	form: {
		flex: 1,
	},
	input: {
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: '#e0e0e0',
		borderRadius: 12,
		paddingVertical: 16,
		paddingHorizontal: 20,
		fontSize: 16,
		marginBottom: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	submitButton: {
		backgroundColor: '#007bff',
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: 'center',
		marginBottom: 20,
		shadowColor: '#007bff',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
	},
	disabledButton: {
		backgroundColor: '#ccc',
		shadowOpacity: 0.1,
	},
	submitButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	backButton: {
		paddingVertical: 12,
		alignItems: 'center',
	},
	backButtonText: {
		color: '#007bff',
		fontSize: 16,
		fontWeight: '500',
	},
})
