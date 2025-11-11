import React, { useState, useEffect } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	ScrollView,
} from 'react-native'
import BaseModal from './BaseModal'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface PriceAdjustmentModalProps {
	visible: boolean
	onClose: () => void
	onConfirm: (newTotal: number, reason: string) => void
	currentTotal: number
	isProcessing?: boolean
}

const PriceAdjustmentModal: React.FC<PriceAdjustmentModalProps> = ({
	visible,
	onClose,
	onConfirm,
	currentTotal,
	isProcessing = false,
}) => {
	const [newTotal, setNewTotal] = useState(currentTotal.toString())
	const [reason, setReason] = useState('')
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (visible) {
			setNewTotal(currentTotal.toFixed(2))
			setReason('')
			setError(null)
		}
	}, [visible, currentTotal])

	const handleConfirm = () => {
		const parsedTotal = parseFloat(newTotal)

		if (isNaN(parsedTotal) || parsedTotal < 0) {
			setError('Please enter a valid amount')
			return
		}

		if (parsedTotal === currentTotal) {
			setError('New amount must be different from current amount')
			return
		}

		if (!reason.trim()) {
			setError(
				'Provide a reason for the adjustment to let the customer know of the price change'
			)
			return
		}

		onConfirm(parsedTotal, reason.trim())
	}

	const getDifference = (): number => {
		const parsedTotal = parseFloat(newTotal)
		if (isNaN(parsedTotal)) return 0
		return parsedTotal - currentTotal
	}

	const difference = getDifference()
	const isDiscount = difference < 0
	const isSurcharge = difference > 0

	return (
		<BaseModal
			visible={visible}
			onClose={onClose}
			title="Adjust Order Price"
			showCloseButton={!isProcessing}>
			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}>
				<View style={styles.container}>
					<Text style={styles.helperText}>
						Adjust the order price and provide a reason. This can be used for
						discounts or additional charges.
					</Text>

					{/* Current Total */}
					<View style={styles.infoRow}>
						<Text style={styles.label}>Current Total:</Text>
						<Text style={styles.currentTotal}>₱{currentTotal.toFixed(2)}</Text>
					</View>

					{/* New Total Input */}
					<View style={styles.inputContainer}>
						<Text style={styles.inputLabel}>New Total Amount *</Text>
						<View style={styles.inputWrapper}>
							<Text style={styles.currencySymbol}>₱</Text>
							<TextInput
								style={styles.input}
								value={newTotal}
								onChangeText={(text) => {
									setNewTotal(text)
									setError(null)
								}}
								keyboardType="decimal-pad"
								placeholder="0.00"
								editable={!isProcessing}
							/>
						</View>
					</View>

					{/* Difference Display */}
					{difference !== 0 && !isNaN(parseFloat(newTotal)) && (
						<View
							style={[
								styles.differenceBox,
								isDiscount ? styles.discountBox : styles.surchargeBox,
							]}>
							<MaterialCommunityIcons
								name={isDiscount ? 'arrow-down-circle' : 'arrow-up-circle'}
								size={20}
								color={isDiscount ? '#4CAF50' : '#FF9800'}
							/>
							<Text
								style={[
									styles.differenceText,
									isDiscount ? styles.discountText : styles.surchargeText,
								]}>
								{isDiscount ? 'Discount: ' : 'Surcharge: '}₱
								{Math.abs(difference).toFixed(2)}
							</Text>
						</View>
					)}

					{/* Reason Input */}
					<View style={styles.inputContainer}>
						<Text style={styles.inputLabel}>Reason for Adjustment *</Text>
						<TextInput
							style={[styles.input, styles.textArea]}
							value={reason}
							onChangeText={(text) => {
								setReason(text)
								setError(null)
							}}
							placeholder={
								isDiscount
									? 'e.g., Closing soon discount, Loyalty discount'
									: isSurcharge
									? 'e.g., Extra fee for repeated violations'
									: 'e.g., Price adjustment reason'
							}
							multiline
							numberOfLines={3}
							editable={!isProcessing}
						/>
					</View>

					{/* Error Message */}
					{error && (
						<View style={styles.errorContainer}>
							<MaterialCommunityIcons
								name="alert-circle"
								size={16}
								color="#F44336"
							/>
							<Text style={styles.errorText}>{error}</Text>
						</View>
					)}

					{/* Action Buttons */}
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={styles.cancelButton}
							onPress={onClose}
							disabled={isProcessing}>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								styles.confirmButton,
								isProcessing && styles.confirmButtonDisabled,
							]}
							onPress={handleConfirm}
							disabled={isProcessing}>
							{isProcessing ? (
								<ActivityIndicator
									color="#fff"
									size="small"
								/>
							) : (
								<Text style={styles.confirmButtonText}>Apply Adjustment</Text>
							)}
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</BaseModal>
	)
}

const styles = StyleSheet.create({
	scrollView: {
		maxHeight: 500,
	},
	container: {
		paddingTop: 8,
	},
	helperText: {
		fontSize: 14,
		color: '#666',
		marginBottom: 16,
		lineHeight: 20,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
	},
	label: {
		fontSize: 14,
		color: '#333',
		fontWeight: '500',
	},
	currentTotal: {
		fontSize: 18,
		color: '#333',
		fontWeight: '700',
	},
	inputContainer: {
		marginBottom: 16,
	},
	inputLabel: {
		fontSize: 14,
		color: '#333',
		fontWeight: '500',
		marginBottom: 8,
	},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		paddingHorizontal: 12,
		backgroundColor: '#fff',
	},
	currencySymbol: {
		fontSize: 16,
		color: '#333',
		fontWeight: '600',
		marginRight: 4,
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: '#333',
		paddingVertical: 12,
	},
	textArea: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 12,
		textAlignVertical: 'top',
		minHeight: 80,
	},
	differenceBox: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderRadius: 8,
		marginBottom: 16,
	},
	discountBox: {
		backgroundColor: '#E8F5E9',
	},
	surchargeBox: {
		backgroundColor: '#FFF3E0',
	},
	differenceText: {
		fontSize: 14,
		fontWeight: '600',
		marginLeft: 8,
	},
	discountText: {
		color: '#4CAF50',
	},
	surchargeText: {
		color: '#FF9800',
	},
	errorContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFEBEE',
		padding: 12,
		borderRadius: 8,
		marginBottom: 16,
	},
	errorText: {
		fontSize: 14,
		color: '#F44336',
		marginLeft: 8,
		flex: 1,
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 10,
		marginTop: 8,
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
	confirmButtonDisabled: {
		opacity: 0.6,
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

export default PriceAdjustmentModal
