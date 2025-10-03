import { StyleSheet } from 'react-native'

export const loginStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8f9fa',
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 24,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 8,
		color: '#333',
	},
	subtitle: {
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 32,
		color: '#666',
	},
	form: {
		marginBottom: 32,
	},
	input: {
		backgroundColor: '#fff',
		borderRadius: 8,
		padding: 16,
		marginBottom: 16,
		fontSize: 16,
		borderWidth: 1,
		borderColor: '#e1e5e9',
	},
	loginButton: {
		backgroundColor: '#007bff',
		borderRadius: 8,
		padding: 16,
		alignItems: 'center',
		marginBottom: 16,
	},
	disabledButton: {
		backgroundColor: '#6c757d',
	},
	loginButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	forgotPassword: {
		alignItems: 'center',
	},
	forgotPasswordText: {
		color: '#007bff',
		fontSize: 14,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	footerText: {
		color: '#666',
		fontSize: 14,
	},
	signUpText: {
		color: '#007bff',
		fontSize: 14,
		fontWeight: '600',
	},
})
