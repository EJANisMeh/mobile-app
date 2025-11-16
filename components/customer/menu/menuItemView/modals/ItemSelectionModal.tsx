import React, { useState } from 'react'
import {
	Modal,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
} from 'react-native'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import {
	normalizeMenuItemSchedule,
	getMenuItemAvailabilityStatus,
} from '../../../../../utils'

interface MenuItem {
	id: number
	name: string
	basePrice: number | string
	availability: boolean
	availabilitySchedule?: any
}

interface ItemSelectionModalProps {
	visible: boolean
	items: MenuItem[]
	onClose: () => void
	onConfirm: (selectedItemIds: number[]) => void
	title?: string
	isSingleSelection: boolean
	isRequired: boolean
	multiLimit?: number
	categoryPriceAdjustment?: number
}

const ItemSelectionModal: React.FC<ItemSelectionModalProps> = ({
	visible,
	items,
	onClose,
	onConfirm,
	title = 'Select items',
	isSingleSelection,
	isRequired,
	multiLimit = 0,
	categoryPriceAdjustment = 0,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const [selectedItemIds, setSelectedItemIds] = useState<number[]>([])

	const handleCancel = () => {
		setSelectedItemIds([])
		onClose()
	}

	const handleConfirm = () => {
		if (canConfirm) {
			onConfirm(selectedItemIds)
			setSelectedItemIds([])
		}
	}

	const handleItemToggle = (itemId: number) => {
		if (isSingleSelection) {
			// Single selection: toggle or replace
			if (selectedItemIds.includes(itemId) && !isRequired) {
				setSelectedItemIds([])
			} else {
				setSelectedItemIds([itemId])
			}
		} else {
			// Multi selection
			if (selectedItemIds.includes(itemId)) {
				setSelectedItemIds(selectedItemIds.filter((id) => id !== itemId))
			} else {
				// Check limit
				if (multiLimit > 0 && selectedItemIds.length >= multiLimit) {
					return
				}
				setSelectedItemIds([...selectedItemIds, itemId])
			}
		}
	}

	const canConfirm = isRequired ? selectedItemIds.length > 0 : true

	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price
		const adjustedPrice = Math.max(0, numPrice + categoryPriceAdjustment)
		if (adjustedPrice === 0 || !Number.isFinite(adjustedPrice)) return 'Free'
		return `₱${adjustedPrice.toFixed(2)}`
	}

	const getItemStatusText = (item: MenuItem): string | null => {
		// Check availability field (out of stock toggle)
		if (item.availability === false) {
			return 'Out of stock'
		}

		// Check if item is available today based on schedule
		if (item.availabilitySchedule) {
			const normalizedSchedule = normalizeMenuItemSchedule(
				item.availabilitySchedule
			)
			const status = getMenuItemAvailabilityStatus(
				normalizedSchedule,
				item.availability ?? true
			)

			if (status === 'not_served_today') {
				return 'Not available today'
			}
		}

		return null
	}

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={handleCancel}>
			<View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
				<View
					style={[
						styles.modalContainer,
						{
							backgroundColor: colors.surface,
							maxHeight: responsive.getResponsiveValue(500, 600),
						},
					]}>
					<Text style={[styles.title, { color: colors.text }]}>{title}</Text>
					{!isSingleSelection && multiLimit > 0 && (
						<Text style={[styles.subtitle, { color: colors.textSecondary }]}>
							Select up to {multiLimit} items ({selectedItemIds.length}/
							{multiLimit})
						</Text>
					)}

					<ScrollView style={styles.scrollView}>
						{items.map((item) => {
							const isSelected = selectedItemIds.includes(item.id)
							const statusText = getItemStatusText(item)
							const isDisabled =
								!isSingleSelection &&
								!isSelected &&
								multiLimit > 0 &&
								selectedItemIds.length >= multiLimit

							return (
								<TouchableOpacity
									key={item.id}
									style={[
										styles.itemContainer,
										{
											backgroundColor: isSelected
												? colors.primary + '20'
												: colors.background,
											borderColor: isSelected ? colors.primary : colors.border,
											opacity: isDisabled ? 0.5 : 1,
										},
									]}
									onPress={() => handleItemToggle(item.id)}
									disabled={isDisabled}>
									{/* Selection indicator */}
									{isSingleSelection ? (
										<View style={styles.radioButton}>
											{isSelected && (
												<View
													style={[
														styles.radioButtonInner,
														{ backgroundColor: colors.primary },
													]}
												/>
											)}
										</View>
									) : (
										<View
											style={[
												styles.checkbox,
												{
													borderColor: isSelected
														? colors.primary
														: colors.border,
													backgroundColor: isSelected
														? colors.primary
														: 'transparent',
												},
											]}>
											{isSelected && (
												<Text
													style={[
														styles.checkmark,
														{ color: colors.textOnPrimary },
													]}>
													✓
												</Text>
											)}
										</View>
									)}

									{/* Item info */}
									<View style={styles.itemInfo}>
										<Text
											style={[
												styles.itemName,
												{
													color: statusText
														? colors.textSecondary
														: colors.text,
												},
											]}>
											{item.name}
										</Text>
										{statusText && (
											<Text
												style={[
													styles.outOfStockText,
													{ color: colors.error },
												]}>
												{statusText}
											</Text>
										)}
									</View>

									{/* Price */}
									<Text style={[styles.price, { color: colors.primary }]}>
										{formatPrice(item.basePrice)}
									</Text>
								</TouchableOpacity>
							)
						})}
					</ScrollView>

					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={[
								styles.button,
								styles.cancelButton,
								{ backgroundColor: colors.surface, borderColor: colors.border },
							]}
							onPress={handleCancel}>
							<Text style={[styles.buttonText, { color: colors.text }]}>
								Cancel
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								styles.button,
								styles.confirmButton,
								{
									backgroundColor: canConfirm
										? colors.primary
										: colors.disabled,
								},
							]}
							onPress={handleConfirm}
							disabled={!canConfirm}>
							<Text
								style={[
									styles.buttonText,
									{ color: canConfirm ? colors.textOnPrimary : colors.text },
								]}>
								Confirm
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	modalContainer: {
		width: '100%',
		maxWidth: 500,
		borderRadius: 12,
		padding: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 14,
		marginBottom: 16,
	},
	scrollView: {
		maxHeight: 400,
		marginBottom: 16,
	},
	itemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderRadius: 8,
		borderWidth: 2,
		marginBottom: 8,
	},
	radioButton: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: '#ccc',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	radioButtonInner: {
		width: 12,
		height: 12,
		borderRadius: 6,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: 4,
		borderWidth: 2,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	checkmark: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	itemInfo: {
		flex: 1,
	},
	itemName: {
		fontSize: 16,
		marginBottom: 4,
	},
	outOfStockText: {
		fontSize: 12,
		fontStyle: 'italic',
	},
	price: {
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8,
	},
	buttonContainer: {
		flexDirection: 'row',
		gap: 12,
	},
	button: {
		flex: 1,
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
	},
	cancelButton: {
		borderWidth: 1,
	},
	confirmButton: {},
	buttonText: {
		fontSize: 16,
		fontWeight: '600',
	},
})

export default ItemSelectionModal
