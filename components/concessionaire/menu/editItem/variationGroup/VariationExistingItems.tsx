import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { useMenuBackend } from '../../../../../hooks/useBackend/useMenuBackend'
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
	const { menuItems } = useMenuBackend()

	return (
		<>
			<Text style={{ fontSize: 12, color: colors.text, marginBottom: 4 }}>
				Options (Existing Items):
			</Text>
			{(group as any).existingMenuItemIds?.map(
				(itemIdInGroup: number, idx: number) => {
					const mi = menuItems.find((m: any) => m.id === itemIdInGroup)
					return (
						<View
							key={idx}
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
								marginBottom: 8,
								gap: 8,
							}}>
							<Text style={{ color: colors.text }}>
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
				style={[styles.addCategoryButton, { marginTop: 4, marginBottom: 0 }]}
				onPress={() => {
					const availableItems = menuItems.filter(
						(item: any) => item.id !== itemId
					)

					if (availableItems.length === 0) {
						showAlert({
							title: 'No Items Available',
							message:
								'An item cannot be a variation of itself. Add other menu items first.',
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
				<Text style={{ color: '#ef4444', marginTop: 4 }}>
					{errors[`variation-${groupIndex}-existing`]}
				</Text>
			)}
		</>
	)
}

export default VariationExistingItems
