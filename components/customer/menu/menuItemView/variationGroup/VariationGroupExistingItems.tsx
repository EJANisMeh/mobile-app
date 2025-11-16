import React, { Dispatch, SetStateAction } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../../styles/customer'
import {
	VariationSelection,
	VariationOptionSelection,
} from '../../../../../types'
import SubVariationGroups from './SubVariationGroups'
import {
	normalizeMenuItemSchedule,
	getMenuItemAvailabilityStatus,
	MenuItemAvailabilityStatus,
} from '../../../../../utils'

interface VariationGroupExistingItemsProps {
	group: any
	selection: VariationSelection
	setVariationSelections: Dispatch<
		SetStateAction<Map<number, VariationSelection>>
	>
}

const VariationGroupExistingItems: React.FC<
	VariationGroupExistingItemsProps
> = ({ group, selection, setVariationSelections }) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)

	const isSingleType =
		selection.selectionTypeCode === 'single_required' ||
		selection.selectionTypeCode === 'single_optional'
	const isRequired =
		selection.selectionTypeCode === 'single_required' ||
		selection.selectionTypeCode === 'multi_required'
	const multiLimit = selection.multiLimit || 0

	// Get existing menu items from group
	const existingMenuItems = (group as any).existingMenuItems || []

	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price
		if (numPrice === 0 || !Number.isFinite(numPrice)) return 'Free'
		return `₱${numPrice.toFixed(2)}`
	}

	const getItemStatusText = (menuItem: any): string | null => {
		// Check availability field (out of stock toggle)
		if (menuItem.availability === false) {
			return 'Out of stock'
		}

		// Check if item is available today based on schedule
		if (menuItem.availabilitySchedule) {
			const normalizedSchedule = normalizeMenuItemSchedule(
				menuItem.availabilitySchedule
			)
			const status = getMenuItemAvailabilityStatus(
				normalizedSchedule,
				menuItem.availability ?? true
			)

			if (status === 'not_served_today') {
				return 'Not available today'
			}
		}

		return null
	}

	const isItemSelected = (menuItemId: number): boolean => {
		return selection.selectedOptions.some(
			(opt) => opt.menuItemId === menuItemId
		)
	}

	const handleItemToggle = (menuItem: any) => {
		setVariationSelections((prev) => {
			const newMap = new Map(prev)
			const currentSelection = newMap.get(group.id)

			if (!currentSelection) {
				return prev
			}

			const isSelected = isItemSelected(menuItem.id)

			if (isSingleType) {
				// Single selection: Replace selection or clear if same item
				if (isSelected && selection.selectionTypeCode === 'single_optional') {
					// Clear selection for optional single
					currentSelection.selectedOptions = []
				} else {
					// Initialize subvariation selections if menu item has variation groups with specificity: false
					const subVariationSelections = new Map<number, VariationSelection>()
					if (menuItem.variationGroups && menuItem.variationGroups.length > 0) {
						// Filter only variation groups with specificity === false
						const subVariationGroupsToShow = menuItem.variationGroups.filter(
							(subGroup: any) => {
								return subGroup.specificity === false
							}
						)

						subVariationGroupsToShow.forEach((subGroup: any) => {
							const selectionTypeCode =
								subGroup.selection_types?.code || 'single_required'

							subVariationSelections.set(subGroup.id, {
								groupId: subGroup.id,
								groupName: subGroup.name,
								selectionTypeCode: selectionTypeCode,
								multiLimit: subGroup.multi_limit || 0,
								selectedOptions: [],
							})
						})
					}

					// Create option using the option choice that corresponds to this menu item
					// For existing items mode, options are created with code like 'item_{itemId}'
					const optionCode = `item_${menuItem.id}`
					const option = group.menu_item_variation_option_choices?.find(
						(opt: any) => opt.code === optionCode
					)

					if (!option) {
						return prev
					}

					// Set new selection
					const newOption: VariationOptionSelection = {
						optionId: option.id, // Use the option choice id
						optionName: menuItem.name,
						priceAdjustment: parseFloat(option.price_adjustment || 0),
						menuItemId: menuItem.id,
						menuItemBasePrice:
							typeof menuItem.basePrice === 'string'
								? parseFloat(menuItem.basePrice)
								: menuItem.basePrice,
					}

					if (subVariationSelections.size > 0) {
						newOption.subVariationSelections = subVariationSelections
					}

					currentSelection.selectedOptions = [newOption]
				}
			} else {
				// Multi selection: Toggle checkbox with limit enforcement
				if (isSelected) {
					// Remove option
					currentSelection.selectedOptions =
						currentSelection.selectedOptions.filter(
							(opt) => opt.menuItemId !== menuItem.id
						)
				} else {
					// Check limit before adding
					if (
						multiLimit > 0 &&
						currentSelection.selectedOptions.length >= multiLimit
					) {
						// Limit reached, don't add
						return prev
					}

					// Initialize subvariation selections if menu item has variation groups with specificity: false
					const subVariationSelections = new Map<number, VariationSelection>()
					if (menuItem.variationGroups && menuItem.variationGroups.length > 0) {
						// Filter only variation groups with specificity === false
						const subVariationGroupsToShow = menuItem.variationGroups.filter(
							(subGroup: any) => {
								return subGroup.specificity === false
							}
						)

						subVariationGroupsToShow.forEach((subGroup: any) => {
							const selectionTypeCode =
								subGroup.selection_types?.code || 'single_required'

							subVariationSelections.set(subGroup.id, {
								groupId: subGroup.id,
								groupName: subGroup.name,
								selectionTypeCode: selectionTypeCode,
								multiLimit: subGroup.multi_limit || 0,
								selectedOptions: [],
							})
						})
					}

					// Create option using the option choice that corresponds to this menu item
					const optionCode = `item_${menuItem.id}`
					const option = group.menu_item_variation_option_choices?.find(
						(opt: any) => opt.code === optionCode
					)

					if (!option) {
						console.warn(
							`No option found for menu item ${menuItem.id} in group ${group.id}`
						)
						return prev
					}

					// Add option
					const newOption: VariationOptionSelection = {
						optionId: option.id, // Use the option choice id
						optionName: menuItem.name,
						priceAdjustment: parseFloat(option.price_adjustment || 0),
						menuItemId: menuItem.id,
						menuItemBasePrice:
							typeof menuItem.basePrice === 'string'
								? parseFloat(menuItem.basePrice)
								: menuItem.basePrice,
					}

					if (subVariationSelections.size > 0) {
						newOption.subVariationSelections = subVariationSelections
					}

					currentSelection.selectedOptions = [
						...currentSelection.selectedOptions,
						newOption,
					]
				}
			}

			newMap.set(group.id, currentSelection)
			return newMap
		})
	}

	const canSelectMore = (): boolean => {
		if (isSingleType) return true
		if (multiLimit === 0) return true // Unlimited
		return selection.selectedOptions.length < multiLimit
	}

	const renderSelectionIndicator = (menuItem: any) => {
		const isSelected = isItemSelected(menuItem.id)

		if (isSingleType) {
			// Radio button
			return (
				<View style={styles.radioButton}>
					{isSelected && <View style={styles.radioButtonInner} />}
				</View>
			)
		} else {
			// Checkbox
			const isDisabled = !isSelected && !canSelectMore()
			return (
				<View
					style={[
						styles.checkbox,
						isDisabled && styles.checkboxDisabled,
						isSelected && styles.checkboxChecked,
					]}>
					{isSelected && <Text style={styles.checkboxCheck}>✓</Text>}
				</View>
			)
		}
	}

	return (
		<View style={styles.variationGroup}>
			<View style={styles.variationGroupHeader}>
				<Text style={styles.variationGroupName}>{group.name}</Text>
				{isRequired && <Text style={styles.requiredBadge}>Required</Text>}
				{!isSingleType && multiLimit > 0 && (
					<Text style={styles.multiLimitText}>(Select up to {multiLimit})</Text>
				)}
			</View>

			<View style={styles.optionsList}>
				{existingMenuItems.map((menuItem: any) => {
					const isSelected = isItemSelected(menuItem.id)
					const isOutOfStock = !menuItem.availability
					const isDisabled = !isSingleType && !isSelected && !canSelectMore()
					const statusText = getItemStatusText(menuItem)

					// Find the selected option to get subvariation selections
					const selectedOption = selection.selectedOptions.find(
						(opt) => opt.menuItemId === menuItem.id
					)

					const subVariationGroupsToShow =
						menuItem.variationGroups?.filter(
							(g: any) => g.specificity === false
						) || []

					return (
						<View key={menuItem.id}>
							<TouchableOpacity
								style={[
									styles.optionItemButton,
									isSelected && styles.optionItemSelected,
									isDisabled && styles.optionItemDisabled,
								]}
								onPress={() => handleItemToggle(menuItem)}
								disabled={isDisabled}>
								{renderSelectionIndicator(menuItem)}
								<View style={styles.optionContent}>
									<View style={styles.optionNameWrapper}>
										<Text
											style={[
												styles.optionName,
												isOutOfStock && styles.optionNameDisabled,
											]}>
											{menuItem.name}
										</Text>
										{statusText && (
											<Text style={styles.outOfStockText}>{statusText}</Text>
										)}
									</View>
									<Text style={styles.optionPrice}>
										{formatPrice(menuItem.basePrice)}
									</Text>
								</View>
							</TouchableOpacity>

							{/* Show subvariations if option is selected and has variation groups with specificity: false */}
							{isSelected &&
								selectedOption?.subVariationSelections &&
								subVariationGroupsToShow.length > 0 && (
									<>
										<SubVariationGroups
											menuItemId={menuItem.id}
											menuItemName={menuItem.name}
											subVariationGroups={subVariationGroupsToShow}
											subVariationSelections={
												selectedOption.subVariationSelections
											}
											setSubVariationSelections={(updater) => {
												setVariationSelections((prev) => {
													const newMap = new Map(prev)
													const currentSelection = newMap.get(group.id)
													if (!currentSelection) return prev

													currentSelection.selectedOptions =
														currentSelection.selectedOptions.map((opt) =>
															opt.menuItemId === menuItem.id
																? {
																		...opt,
																		subVariationSelections:
																			typeof updater === 'function'
																				? updater(
																						opt.subVariationSelections ||
																							new Map()
																				  )
																				: updater,
																  }
																: opt
														)

													newMap.set(group.id, currentSelection)
													return newMap
												})
											}}
										/>
									</>
								)}
						</View>
					)
				})}
			</View>
		</View>
	)
}

export default VariationGroupExistingItems
