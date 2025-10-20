import React from 'react'
import { ModalProps } from './types'
import {
	Modal,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Dimensions,
} from 'react-native'

interface BaseModalProps extends ModalProps {
	children: React.ReactNode
	showCloseButton?: boolean
}

const BaseModal: React.FC<BaseModalProps> = ({
	visible,
	onClose,
	title,
	children,
	showCloseButton = true,
}) => {
	return (
		<Modal
			transparent
			visible={visible}
			animationType="fade"
			onRequestClose={onClose}>
			<View style={styles.overlay}>
				<View style={styles.container}>
					<View style={styles.header}>
						<Text style={styles.title}>{title}</Text>
						{showCloseButton && (
							<TouchableOpacity
								onPress={onClose}
								style={styles.closeButton}>
								<Text style={styles.closeButtonText}>×</Text>
							</TouchableOpacity>
						)}
					</View>
					<View style={styles.content}>{children}</View>
				</View>
			</View>
		</Modal>
	)
}

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		backgroundColor: 'white',
		borderRadius: 12,
		width: width * 0.85,
		maxWidth: 400,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#333',
		flex: 1,
	},
	closeButton: {
		width: 30,
		height: 30,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 15,
		backgroundColor: '#f5f5f5',
	},
	closeButtonText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#666',
	},
	content: {
		padding: 20,
	},
})

export default BaseModal
