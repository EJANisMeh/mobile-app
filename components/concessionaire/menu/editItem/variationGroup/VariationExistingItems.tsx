import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
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

	return (
		<>
			<Text style={styles.modeSelectionLabel}>Options (Existing Items):</Text>
			{(group as any).existingMenuItemIds?.map(
				(itemIdInGroup: number, idx: number) => {
					const mi = menuItems.find((m: any) => m.id === itemIdInGroup)
					return (
						<View
							key={idx}
							style={styles.existingItemRow}>
							<Text style={styles.existingItemName}>
								{mi?.name || 'Unknown'}
							</Text>
							<TouchableOpacity
								onPress={() => {
									setFormData((prev) => ({
										...prev,
										variationGroups: prev.variationGroups.map((g, gi) =>
											gi === groupIndex
												? {
														...g,
														existingMenuItemIds: (
															g as any
														).existingMenuItemIds?.filter(
															(id: number) => id !== itemIdInGroup
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
					)
				}
			)}

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
							setFormData((prev) => ({
								...prev,
								variationGroups: prev.variationGroups.map((g, gi) =>
									gi === groupIndex
										? {
												...g,
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
