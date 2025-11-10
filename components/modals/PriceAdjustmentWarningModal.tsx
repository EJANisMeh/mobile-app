import React from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
} from 'react-native'
import BaseModal from './BaseModal'

interface AffectedItem {
	id: number
	name: string
	originalPrice: number
	adjustedPrice: number
}

interface PriceAdjustmentWarningModalProps {
	visible: boolean
	onClose: () => void
	affectedItems: AffectedItem[]
	onConfirm: () => void
	onCancel?: () => void
}

const PriceAdjustmentWarningModal: React.FC<
	PriceAdjustmentWarningModalProps
> = ({ visible, onClose, affectedItems, onConfirm, onCancel }) => {
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
			title="Price Adjustment Warning"
			showCloseButton={false}>
			<Text style={styles.headerMessage}>
				The following items will have a price of ₱0 because of the price
				adjustment values:
			</Text>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}>
				{affectedItems.map((item, index) => (
					<View
						key={item.id}
						style={styles.itemContainer}>
						<Text style={styles.bulletPoint}>•</Text>
						<View style={styles.itemTextContainer}>
							<Text style={styles.itemName}>{item.name}</Text>
							<Text style={styles.itemPrice}>
								Base Price: ₱{item.originalPrice.toFixed(2)}
							</Text>
						</View>
					</View>
				))}
			</ScrollView>

			<Text style={styles.footerMessage}>
				Are you sure this is the intended purpose?
			</Text>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.cancelButton}
					onPress={handleCancel}>
					<Text style={styles.cancelButtonText}>Cancel</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.confirmButton}
					onPress={handleConfirm}>
					<Text style={styles.confirmButtonText}>Continue</Text>
				</TouchableOpacity>
			</View>
		</BaseModal>
	)
}

const styles = StyleSheet.create({
	headerMessage: {
		fontSize: 15,
		color: '#333',
		lineHeight: 20,
		marginBottom: 12,
	},
	scrollView: {
		maxHeight: 200,
		marginBottom: 12,
		borderRadius: 8,
		backgroundColor: '#f8f9fa',
		borderWidth: 1,
		borderColor: '#dee2e6',
	},
	scrollViewContent: {
		padding: 12,
	},
	itemContainer: {
		flexDirection: 'row',
		marginBottom: 10,
		alignItems: 'flex-start',
	},
	bulletPoint: {
		fontSize: 16,
		color: '#333',
		marginRight: 8,
		lineHeight: 20,
	},
	itemTextContainer: {
		flex: 1,
	},
	itemName: {
		fontSize: 15,
		color: '#333',
		fontWeight: '600',
		marginBottom: 2,
	},
	itemPrice: {
		fontSize: 13,
		color: '#666',
	},
	footerMessage: {
		fontSize: 15,
		color: '#333',
		lineHeight: 20,
		marginBottom: 20,
		textAlign: 'center',
		fontWeight: '500',
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
})

export default PriceAdjustmentWarningModal
