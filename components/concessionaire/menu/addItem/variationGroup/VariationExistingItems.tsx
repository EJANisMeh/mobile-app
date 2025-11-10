import React from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext, useMenuContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createConcessionaireAddMenuItemStyles } from '../../../../../styles/concessionaire/addMenuItem'
import {
	AddMenuItemFormData,
	VariationGroupInput,
} from '../../../../../types/menuItemTypes'
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
}

const VariationExistingItems: React.FC<VariationExistingItemsProps> = ({
	setFormData,
	groupIndex,
	group,
	errors,
	showAlert,
	showMenuModal,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireAddMenuItemStyles(colors, responsive)
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
			<Text style={styles.existingItemsLabel}>Options (Existing Items):</Text>
			{group.options.map((option, idx) => {
				const itemId = (group as any).existingMenuItemIds?.[idx]
				const mi = menuItems.find((m: any) => m.id === itemId)
				return (
					<View
						key={idx}
						style={styles.existingItemContainer}>
						<View style={styles.existingItemRow}>
							<Text style={styles.existingItemText}>
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
								onChangeText={(value) => handlePriceAdjustmentChange(idx, value)}
								placeholder="0"
								keyboardType="numeric"
								placeholderTextColor={colors.textSecondary}
							/>
						</View>
					</View>
				)
			})}

			<TouchableOpacity
				style={[styles.addCategoryButton, { marginTop: 4, marginBottom: 0 }]}
				onPress={() => {
					if (menuItems.length === 0) {
						showAlert({
							title: 'No Menu Items',
							message: 'Create some menu items first',
						})
						return
					}
					const menuItemOptions = menuItems.map((item: any) => ({
						label: `${item.name} - ₱${item.basePrice}`,
						value: item.id,
					}))
					showMenuModal({
						title: 'Select Menu Item',
						options: menuItemOptions,
						onSelect: (menuItemId: number) => {
							const selectedItem = menuItems.find((m: any) => m.id === menuItemId)
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
				<Text style={styles.errorText}>
					{errors[`variation-${groupIndex}-existing`]}
				</Text>
			)}
		</>
	)
}

export default VariationExistingItems
