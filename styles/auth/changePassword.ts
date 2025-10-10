import { StyleSheet } from 'react-native'

export const changePasswordStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8f9fa',
	},
	scrollContent: {
		flexGrow: 1,
	},
	content: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 60,
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
		lineHeight: 24,
		marginBottom: 40,
		paddingHorizontal: 20,
	},
	form: {
		flex: 1,
	},
	inputContainer: {
		position: 'relative',
		marginBottom: 20,
	},
	input: {
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: '#e0e0e0',
		borderRadius: 12,
		paddingVertical: 16,
		paddingHorizontal: 20,
		paddingRight: 50,
		fontSize: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	eyeButton: {
		position: 'absolute',
		right: 15,
		top: 16,
		padding: 4,
	},
	eyeText: {
		fontSize: 18,
	},
	requirements: {
		fontSize: 14,
		color: '#666',
		lineHeight: 20,
		marginBottom: 30,
		paddingHorizontal: 4,
	},
	submitButton: {
		backgroundColor: '#007bff',
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: 'center',
		marginBottom: 32,
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
	cancelButton: {
		paddingVertical: 12,
		alignItems: 'center',
	},
	cancelButtonText: {
		color: '#666',
		fontSize: 16,
		fontWeight: '500',
	},
})
