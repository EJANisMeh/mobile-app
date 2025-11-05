import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import BaseModal from '../../modals/BaseModal'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createPaymentMethodModalStyles } from '../../../styles/customer'

interface PaymentMethodModalProps {
	visible: boolean
	onClose: () => void
	onConfirm: (paymentMethod: string) => void
	selectedMethod: string | null
}

const PAYMENT_METHODS = [
	{
		id: 'cash',
		name: 'Cash',
		icon: 'cash',
		description: 'Pay with cash on pickup',
	},
	{
		id: 'gcash',
		name: 'GCash',
		icon: 'wallet',
		description: 'Pay via GCash',
	},
	{
		id: 'maya',
		name: 'Maya (PayMaya)',
		icon: 'wallet-outline',
		description: 'Pay via Maya',
	},
] as const

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
	visible,
	onClose,
	onConfirm,
	selectedMethod,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createPaymentMethodModalStyles(colors, responsive)

	const [tempSelection, setTempSelection] = React.useState<string | null>(
		selectedMethod
	)

	React.useEffect(() => {
		if (visible) {
			setTempSelection(selectedMethod)
		}
	}, [visible, selectedMethod])

	const handleConfirm = () => {
		if (tempSelection) {
			onConfirm(tempSelection)
		}
	}

	return (
		<BaseModal
			visible={visible}
			onClose={onClose}
			title="Choose Payment Method">
			<ScrollView
				style={styles.scrollArea}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={true}>
				<Text style={styles.helperText}>
					Select how you would like to pay for this order
				</Text>

				<View style={styles.methodsContainer}>
					{PAYMENT_METHODS.map((method) => {
						const isSelected = tempSelection === method.id
						return (
							<TouchableOpacity
								key={method.id}
								style={[
									styles.methodCard,
									isSelected && styles.methodCardSelected,
								]}
								onPress={() => setTempSelection(method.id)}>
								<MaterialCommunityIcons
									name={method.icon as any}
									size={32}
									color={isSelected ? colors.primary : colors.textSecondary}
									style={styles.methodIcon}
								/>
								<View style={styles.methodInfo}>
									<Text
										style={[
											styles.methodName,
											isSelected && styles.methodNameSelected,
										]}>
										{method.name}
									</Text>
									<Text style={styles.methodDescription}>
										{method.description}
									</Text>
								</View>
								{isSelected && (
									<MaterialCommunityIcons
										name="check-circle"
										size={24}
										color={colors.primary}
									/>
								)}
							</TouchableOpacity>
						)
					})}
				</View>

				<View style={styles.actionsRow}>
					<TouchableOpacity
						style={[styles.actionButton, styles.cancelButton]}
						onPress={onClose}>
						<Text style={styles.actionButtonText}>Cancel</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.actionButton,
							styles.confirmButton,
							styles.actionButtonSpacing,
							!tempSelection && styles.confirmButtonDisabled,
						]}
						onPress={handleConfirm}
						disabled={!tempSelection}>
						<Text
							style={[
								styles.actionButtonText,
								styles.confirmButtonText,
								!tempSelection && styles.confirmButtonTextDisabled,
							]}>
							Continue
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</BaseModal>
	)
}

export default PaymentMethodModal
