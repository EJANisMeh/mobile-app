import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import BaseModal from './BaseModal'
import { ModalProps } from './types'

interface AlertModalButton {
	text: string
	onPress?: () => void
	style?: 'default' | 'cancel' | 'destructive'
}

interface AlertModalProps extends ModalProps {
	message?: string
	buttons?: AlertModalButton[]
}

const AlertModal: React.FC<AlertModalProps> = ({
	visible,
	onClose,
	title,
	message,
	buttons = [{ text: 'OK', onPress: onClose }],
}) => {
	return (
		<BaseModal
			visible={visible}
			onClose={onClose}
			title={title}
			showCloseButton={false}>
			{message && <Text style={styles.message}>{message}</Text>}

			<View style={styles.buttonContainer}>
				{buttons.map((button, index) => (
					<TouchableOpacity
						key={index}
						style={[
							styles.button,
							button.style === 'cancel' && styles.cancelButton,
							button.style === 'destructive' && styles.destructiveButton,
							buttons.length === 1 && styles.singleButton,
						]}
						onPress={() => {
							button.onPress?.()
							onClose()
						}}>
						<Text
							style={[
								styles.buttonText,
								button.style === 'cancel' && styles.cancelButtonText,
								button.style === 'destructive' && styles.destructiveButtonText,
							]}>
							{button.text}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</BaseModal>
	)
}

const styles = StyleSheet.create({
	message: {
		fontSize: 16,
		color: '#666',
		lineHeight: 22,
		marginBottom: 20,
		textAlign: 'center',
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 10,
	},
	button: {
		flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		backgroundColor: '#007bff',
		alignItems: 'center',
	},
	singleButton: {
		backgroundColor: '#007bff',
	},
	cancelButton: {
		backgroundColor: '#6c757d',
	},
	destructiveButton: {
		backgroundColor: '#dc3545',
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '600',
		color: 'white',
	},
	cancelButtonText: {
		color: 'white',
	},
	destructiveButtonText: {
		color: 'white',
	},
})

export default AlertModal
