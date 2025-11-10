import React from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext, useMenuContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createConcessionaireEditMenuItemStyles } from '../../../../../styles/concessionaire'
import { AddMenuItemFormData, VariationGroupInput } from '../../../../../types'
import {
	UseAlertModalType,
	UseMenuModalType,
} from '../../../../../hooks/useModals/types'

interface VariationExistingItemsProps {
	setFormData: React.Dispatch<React.SetStateAction<AddMenuItemFormData>>
	groupIndex: number
	group: VariationGroupInput
	errors: Record<string, string>
	showAlert: UseAlertModalType['showAlert']
	showMenuModal: UseMenuModalType['showMenu']
	itemId: number
}

const VariationExistingItems: React.FC<VariationExistingItemsProps> = ({
	setFormData,
	groupIndex,
	group,
	errors,
	showAlert,
	showMenuModal,
	itemId,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireEditMenuItemStyles(colors, responsive)
	const { menuItems } = useMenuContext()

	const handlePriceAdjustmentChange = (index: number, value: string) => {
		setFormData((prev) => ({
			...prev,
			variationGroups: prev.variationGroups.map((g, gi) =>
				gi === groupIndex
					? {
							...g,
							options: g.options.map((opt, oi) =>
								oi === index ? { ...opt, priceAdjustment: value } : opt
							),
					  }
					: g
			),
		}))
	}

	return (
		<>
			<Text style={styles.modeSelectionLabel}>Options (Existing Items):</Text>
			{group.options.map((option, idx) => {
				const itemIdInGroup = (group as any).existingMenuItemIds?.[idx]
				const mi = menuItems.find((m: any) => m.id === itemIdInGroup)
				return (
					<View
						key={idx}
						style={styles.existingItemContainer}>
						<View style={styles.existingItemRow}>
							<Text style={styles.existingItemName}>
								{mi?.name || 'Unknown'} (₱{mi?.basePrice || '0'})
							</Text>
							<TouchableOpacity
								onPress={() => {
									setFormData((prev) => ({
										...prev,
										variationGroups: prev.variationGroups.map((g, gi) =>
											gi === groupIndex
												? {
														...g,
														options: g.options.filter((_, oi) => oi !== idx),
														existingMenuItemIds: (
															g as any
														).existingMenuItemIds?.filter(
															(_: number, i: number) => i !== idx
														),
												  }
												: g
										),
									}))
								}}>
								<Ionicons
									name="close-circle"
									size={20}
									color="#ef4444"
								/>
							</TouchableOpacity>
						</View>
						<View style={styles.priceAdjustmentContainer}>
							<Text style={styles.priceAdjustmentLabel}>
								Price Adjustment (₱):
							</Text>
							<TextInput
								style={styles.priceAdjustmentInput}
								value={option.priceAdjustment}
								onChangeText={(value) =>
									handlePriceAdjustmentChange(idx, value)
								}
								placeholder="0"
								keyboardType="numeric"
								placeholderTextColor={colors.textSecondary}
							/>
						</View>
					</View>
				)
			})}

			<TouchableOpacity
				style={[styles.addCategoryButton, styles.variationAddButtonInline]}
				onPress={() => {
					// Get already added existing item IDs in this group
					const addedItemIds = (group as any).existingMenuItemIds || []

					// Filter out: current item AND already added items
					const availableItems = menuItems.filter(
						(item: any) => item.id !== itemId && !addedItemIds.includes(item.id)
					)

					if (availableItems.length === 0) {
						showAlert({
							title: 'No Items Available',
							message:
								addedItemIds.length > 0
									? 'All available items have already been added.'
									: 'No other menu items available. Add more items first.',
						})
						return
					}
					const menuItemOptions = availableItems.map((item: any) => ({
						label: `${item.name} - ₱${item.basePrice}`,
						value: item.id,
					}))
					showMenuModal({
						title: 'Select Menu Item',
						options: menuItemOptions,
						onSelect: (menuItemId: number) => {
							const selectedItem = menuItems.find(
								(m: any) => m.id === menuItemId
							)
							setFormData((prev) => ({
								...prev,
								variationGroups: prev.variationGroups.map((g, gi) =>
									gi === groupIndex
										? {
												...g,
												options: [
													...g.options,
													{
														name: selectedItem?.name || '',
														priceAdjustment: '0',
														isDefault: false,
														availability: true,
														position: g.options.length,
													},
												],
												existingMenuItemIds: [
													...((g as any).existingMenuItemIds || []),
													menuItemId,
												],
										  }
										: g
								),
							}))
						},
					})
				}}>
				<Ionicons
					name="add-circle-outline"
					size={16}
					color={colors.primary}
				/>
				<Text style={styles.addCategoryButtonText}>
					Add Option (Existing Item)
				</Text>
			</TouchableOpacity>
			{errors[`variation-${groupIndex}-existing`] && (
				<Text style={styles.errorTextMargin}>
					{errors[`variation-${groupIndex}-existing`]}
				</Text>
			)}
		</>
	)
}

export default VariationExistingItems
