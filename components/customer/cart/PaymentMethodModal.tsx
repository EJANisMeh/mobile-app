import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import BaseModal from '../../modals/BaseModal'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createPaymentMethodModalStyles } from '../../../styles/customer'
import type { PaymentMethodTuple } from '../../../types'

interface PaymentMethodModalProps {
	visible: boolean
	onClose: () => void
	onConfirm: (
		paymentMethod: string,
		paymentDetails: string,
		needsProof: boolean,
		proofMode: 'text' | 'screenshot' | null
	) => void
	selectedMethod: string | null
	concessionPaymentMethods: PaymentMethodTuple[]
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
	visible,
	onClose,
	onConfirm,
	selectedMethod,
	concessionPaymentMethods,
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
		if (!tempSelection) {
			return
		}

		// Find the selected payment method tuple
		const selectedTuple = concessionPaymentMethods.find(
			([type]) => type === tempSelection
		)

		if (!selectedTuple) {
			return
		}

		const [type, details, needsProof, proofMode] = selectedTuple
		onConfirm(type, details, needsProof, proofMode)
	}

	const getMethodIcon = (type: string): string => {
		const lowerType = type.toLowerCase()
		if (lowerType === 'cash') return 'cash'
		if (lowerType.includes('gcash')) return 'wallet'
		if (lowerType.includes('maya') || lowerType.includes('paymaya'))
			return 'wallet-outline'
		if (lowerType.includes('bank')) return 'bank'
		return 'credit-card'
	}

	const getProofLabel = (
		needsProof: boolean,
		proofMode: 'text' | 'screenshot' | null
	): string => {
		if (!needsProof) return ''
		if (proofMode === 'text') return 'Text proof required'
		if (proofMode === 'screenshot') return 'Screenshot required'
		return ''
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
					{concessionPaymentMethods.map(
						([type, details, needsProof, proofMode]) => {
							const isSelected = tempSelection === type
							const proofLabel = getProofLabel(needsProof, proofMode)

							return (
								<TouchableOpacity
									key={type}
									style={[
										styles.methodCard,
										isSelected && styles.methodCardSelected,
									]}
									onPress={() => setTempSelection(type)}>
									<MaterialCommunityIcons
										name={getMethodIcon(type) as any}
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
											{type}
										</Text>
										<Text style={styles.methodDescription}>{details}</Text>
										{needsProof && proofLabel ? (
											<View style={styles.proofBadge}>
												<MaterialCommunityIcons
													name={
														proofMode === 'screenshot'
															? 'camera-outline'
															: 'text-box-outline'
													}
													size={14}
													color={colors.textSecondary}
												/>
												<Text style={styles.proofBadgeText}>{proofLabel}</Text>
											</View>
										) : null}
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
						}
					)}
				</View>

				{tempSelection &&
				concessionPaymentMethods.find(
					([type]) => type === tempSelection
				)?.[2] ? (
					<View style={styles.proofNotice}>
						<MaterialCommunityIcons
							name="information-outline"
							size={20}
							color={colors.primary}
						/>
						<Text style={styles.proofNoticeText}>
							You can submit payment proof now or later in the Orders screen.
						</Text>
					</View>
				) : null}

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
