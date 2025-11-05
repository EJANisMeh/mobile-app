import React from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	TextInput,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import BaseModal from '../../modals/BaseModal'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createPaymentMethodModalStyles } from '../../../styles/customer'
import type { PaymentMethodTuple, PaymentProof } from '../../../types'

interface PaymentMethodModalProps {
	visible: boolean
	onClose: () => void
	onConfirm: (
		paymentMethod: string,
		paymentDetails: string,
		needsProof: boolean,
		proofMode: 'text' | 'screenshot' | null,
		proof: PaymentProof | null
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
	const [proofText, setProofText] = React.useState('')
	const [proofImage, setProofImage] = React.useState<string | null>(null)

	React.useEffect(() => {
		if (visible) {
			setTempSelection(selectedMethod)
			setProofText('')
			setProofImage(null)
		}
	}, [visible, selectedMethod])

	const selectedMethodData = React.useMemo(() => {
		if (!tempSelection) return null
		return concessionPaymentMethods.find(([type]) => type === tempSelection)
	}, [tempSelection, concessionPaymentMethods])

	const needsProof = selectedMethodData?.[2] || false
	const proofMode = selectedMethodData?.[3] || null

	const handlePickImage = async () => {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync()

		if (!permissionResult.granted) {
			alert('Permission to access gallery is required!')
			return
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			quality: 0.7,
		})

		if (!result.canceled && result.assets[0]) {
			setProofImage(result.assets[0].uri)
		}
	}

	const handleRemoveImage = () => {
		setProofImage(null)
	}

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

		// Build proof object if provided
		let proof: PaymentProof | null = null
		if (needsProof && proofMode) {
			if (proofMode === 'text' && proofText.trim()) {
				proof = {
					mode: 'text',
					value: proofText.trim(),
				}
			} else if (proofMode === 'screenshot' && proofImage) {
				proof = {
					mode: 'screenshot',
					value: proofImage,
				}
			}
		}

		onConfirm(type, details, needsProof, proofMode, proof)
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
				)?.[2] === true ? (
					<>
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

						{/* Payment Proof Input Section */}
						{proofMode === 'text' && (
							<View style={styles.proofInputContainer}>
								<Text style={styles.proofInputLabel}>
									Payment Proof (Optional)
								</Text>
								<TextInput
									style={styles.proofTextInput}
									placeholder="Enter transaction ID, reference number, etc."
									placeholderTextColor={colors.placeholder}
									value={proofText}
									onChangeText={setProofText}
									multiline
									numberOfLines={3}
								/>
							</View>
						)}

						{proofMode === 'screenshot' && (
							<View style={styles.proofInputContainer}>
								<Text style={styles.proofInputLabel}>
									Payment Proof (Optional)
								</Text>
								{!proofImage ? (
									<TouchableOpacity
										style={styles.imagePickerButton}
										onPress={handlePickImage}>
										<MaterialCommunityIcons
											name="camera-plus"
											size={32}
											color={colors.primary}
										/>
										<Text style={styles.imagePickerText}>
											Upload Screenshot
										</Text>
									</TouchableOpacity>
								) : (
									<View style={styles.imagePreviewContainer}>
										<Text style={styles.imageSelectedText}>
											Screenshot selected
										</Text>
										<TouchableOpacity
											style={styles.removeImageButton}
											onPress={handleRemoveImage}>
											<MaterialCommunityIcons
												name="close-circle"
												size={20}
												color={colors.error}
											/>
											<Text style={styles.removeImageText}>Remove</Text>
										</TouchableOpacity>
									</View>
								)}
							</View>
						)}
					</>
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
