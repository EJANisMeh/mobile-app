import { StyleSheet } from 'react-native'

export const customerProfileStyles = StyleSheet.create({
	profileContainer: {
		flex: 1,
		backgroundColor: '#f8f9fa',
	},
	profileContent: {
		padding: 20,
	},
	profileTitle: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 30,
		textAlign: 'center',
	},
	userInfo: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 12,
		marginBottom: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	infoLabel: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#555',
		marginTop: 12,
		marginBottom: 4,
	},
	infoValue: {
		fontSize: 16,
		color: '#333',
		marginBottom: 8,
	},
})
