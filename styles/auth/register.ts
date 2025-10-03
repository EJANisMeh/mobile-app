import { StyleSheet } from 'react-native'

export const registerStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8f9fa',
	},
	scrollContent: {
		flexGrow: 1,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 24,
		paddingVertical: 32,
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
	nameRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 16,
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
	nameInput: {
		flex: 1,
		marginBottom: 0,
		marginRight: 8,
	},
	roleContainer: {
		marginBottom: 16,
	},
	roleLabel: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 8,
		color: '#333',
	},
	roleButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	roleButton: {
		flex: 1,
		backgroundColor: '#fff',
		borderRadius: 8,
		padding: 16,
		alignItems: 'center',
		marginRight: 8,
		borderWidth: 2,
		borderColor: '#e1e5e9',
	},
	roleButtonActive: {
		borderColor: '#007bff',
		backgroundColor: '#f0f8ff',
	},
	roleButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#666',
	},
	roleButtonTextActive: {
		color: '#007bff',
	},
	registerButton: {
		backgroundColor: '#007bff',
		borderRadius: 8,
		padding: 16,
		alignItems: 'center',
		marginTop: 8,
	},
	disabledButton: {
		backgroundColor: '#6c757d',
	},
	registerButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
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
	signInText: {
		color: '#007bff',
		fontSize: 14,
		fontWeight: '600',
	},
})
