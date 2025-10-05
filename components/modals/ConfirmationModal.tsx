import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import BaseModal from './BaseModal'

interface ConfirmationModalProps {
	visible: boolean
	onClose: () => void
	title: string
	message: string
	confirmText?: string
	cancelText?: string
	onConfirm: () => void
	onCancel?: () => void
	confirmStyle?: 'default' | 'destructive'
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	visible,
	onClose,
	title,
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	onConfirm,
	onCancel,
	confirmStyle = 'default',
}) => {
	const handleConfirm = () => {
		onConfirm()
		onClose()
	}

	const handleCancel = () => {
		onCancel?.()
		onClose()
	}

	return (
		<BaseModal
			visible={visible}
			onClose={onClose}
			title={title}
			showCloseButton={false}>
			<Text style={styles.message}>{message}</Text>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.cancelButton}
					onPress={handleCancel}>
					<Text style={styles.cancelButtonText}>{cancelText}</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.confirmButton,
						confirmStyle === 'destructive' && styles.destructiveButton,
					]}
					onPress={handleConfirm}>
					<Text
						style={[
							styles.confirmButtonText,
							confirmStyle === 'destructive' && styles.destructiveButtonText,
						]}>
						{confirmText}
					</Text>
				</TouchableOpacity>
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
	cancelButton: {
		flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		backgroundColor: '#6c757d',
		alignItems: 'center',
	},
	confirmButton: {
		flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		backgroundColor: '#007bff',
		alignItems: 'center',
	},
	destructiveButton: {
		backgroundColor: '#dc3545',
	},
	cancelButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: 'white',
	},
	confirmButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: 'white',
	},
	destructiveButtonText: {
		color: 'white',
	},
})

export default ConfirmationModal
