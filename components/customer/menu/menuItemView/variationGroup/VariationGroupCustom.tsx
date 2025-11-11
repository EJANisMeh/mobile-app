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

interface VariationGroupCustomProps {
	group: any
	selection: VariationSelection
	setVariationSelections: Dispatch<
		SetStateAction<Map<number, VariationSelection>>
	>
}

const VariationGroupCustom: React.FC<VariationGroupCustomProps> = ({
	group,
	selection,
	setVariationSelections,
}) => {
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

	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price
		if (numPrice === 0) return ''
		return numPrice > 0
			? `+₱${numPrice.toFixed(2)}`
			: `-₱${Math.abs(numPrice).toFixed(2)}`
	}

	const isOptionSelected = (optionId: number): boolean => {
		return selection.selectedOptions.some((opt) => opt.optionId === optionId)
	}

	const handleOptionToggle = (option: any) => {
		setVariationSelections((prev) => {
			const newMap = new Map(prev)
			const currentSelection = newMap.get(group.id)

			if (!currentSelection) return prev

			const isSelected = isOptionSelected(option.id)

			// Check if this is existing items mode and option has menu item reference
			const isExistingMode = group.kind === 'existing_items'
			const menuItemRef = isExistingMode
				? (group as any).existingMenuItems?.find((item: any) => {
						// Match by checking if option.code contains item_{itemId}
						return option.code === `item_${item.id}`
				  })
				: null

			if (isSingleType) {
				// Single selection: Replace selection or clear if same option
				if (isSelected && selection.selectionTypeCode === 'single_optional') {
					// Clear selection for optional single
					currentSelection.selectedOptions = []
				} else {
					// Initialize subvariation selections if this is existing mode and has variation groups with specificity: false
					const subVariationSelections = new Map<number, VariationSelection>()
					if (
						isExistingMode &&
						menuItemRef &&
						menuItemRef.variationGroups &&
						menuItemRef.variationGroups.length > 0
					) {
						// Filter only variation groups with specificity === false
						const subVariationGroupsToShow = menuItemRef.variationGroups.filter(
							(subGroup: any) => subGroup.specificity === false
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

					// Set new selection
					const newOption: VariationOptionSelection = {
						optionId: option.id,
						optionName: option.name,
						priceAdjustment: parseFloat(option.price_adjustment || 0),
					}

					// Add existing items mode specific data
					if (isExistingMode && menuItemRef) {
						newOption.menuItemId = menuItemRef.id
						newOption.menuItemBasePrice =
							typeof menuItemRef.basePrice === 'string'
								? parseFloat(menuItemRef.basePrice)
								: menuItemRef.basePrice
						if (subVariationSelections.size > 0) {
							newOption.subVariationSelections = subVariationSelections
						}
					}

					currentSelection.selectedOptions = [newOption]
				}
			} else {
				// Multi selection: Toggle checkbox with limit enforcement
				if (isSelected) {
					// Remove option
					currentSelection.selectedOptions =
						currentSelection.selectedOptions.filter(
							(opt) => opt.optionId !== option.id
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

					// Initialize subvariation selections if menu item has variation groups (existing items mode) with specificity: false
					const subVariationSelections = new Map<number, VariationSelection>()
					if (
						isExistingMode &&
						menuItemRef &&
						menuItemRef.variationGroups &&
						menuItemRef.variationGroups.length > 0
					) {
						// Filter only variation groups with specificity === false
						const subVariationGroupsToShow = menuItemRef.variationGroups.filter(
							(subGroup: any) => subGroup.specificity === false
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

					// Add option
					const newOption: VariationOptionSelection = {
						optionId: option.id,
						optionName: option.name,
						priceAdjustment: parseFloat(option.price_adjustment || 0),
					}

					// Add existing items mode specific data
					if (isExistingMode && menuItemRef) {
						newOption.menuItemId = menuItemRef.id
						newOption.menuItemBasePrice =
							typeof menuItemRef.basePrice === 'string'
								? parseFloat(menuItemRef.basePrice)
								: menuItemRef.basePrice
						if (subVariationSelections.size > 0) {
							newOption.subVariationSelections = subVariationSelections
						}
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

	const renderSelectionIndicator = (option: any) => {
		const isSelected = isOptionSelected(option.id)

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
				{group.menu_item_variation_option_choices?.map((option: any) => {
					const isSelected = isOptionSelected(option.id)
					const isDisabled = !isSingleType && !isSelected && !canSelectMore()

					// Find the selected option to get subvariation selections
					const selectedOption = selection.selectedOptions.find(
						(opt) => opt.optionId === option.id
					)

					// Get menu item reference for existing items mode
					const isExistingMode = group.kind === 'existing_items'
					const menuItemRef = isExistingMode
						? (group as any).existingMenuItems?.find((item: any) => {
								return option.code === `item_${item.id}`
						  })
						: null

					return (
						<View key={option.id}>
							<TouchableOpacity
								style={[
									styles.optionItemButton,
									isSelected && styles.optionItemSelected,
									isDisabled && styles.optionItemDisabled,
								]}
								onPress={() => handleOptionToggle(option)}
								disabled={isDisabled}>
								{renderSelectionIndicator(option)}
								<View style={styles.optionContent}>
									<Text
										style={[
											styles.optionName,
											isDisabled && styles.optionNameDisabled,
										]}>
										{option.name}
									</Text>
									{option.price_adjustment !== 0 && (
										<Text style={styles.optionPrice}>
											{formatPrice(option.price_adjustment)}
										</Text>
									)}
								</View>
							</TouchableOpacity>

							{/* Show subvariations if option is selected and is existing item with variation groups (specificity: false) */}
							{isSelected &&
								selectedOption?.subVariationSelections &&
								isExistingMode &&
								menuItemRef &&
								menuItemRef.variationGroups &&
								menuItemRef.variationGroups.filter((g: any) => g.specificity === false).length > 0 && (
									<SubVariationGroups
										menuItemId={menuItemRef.id}
										menuItemName={menuItemRef.name}
										subVariationGroups={menuItemRef.variationGroups.filter((g: any) => g.specificity === false)}
										subVariationSelections={selectedOption.subVariationSelections}
										setSubVariationSelections={(updater) => {
											setVariationSelections((prev) => {
												const newMap = new Map(prev)
												const currentSelection = newMap.get(group.id)
												if (!currentSelection) return prev

												currentSelection.selectedOptions =
													currentSelection.selectedOptions.map((opt) =>
														opt.optionId === option.id
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
								)}
						</View>
					)
				})}
			</View>
		</View>
	)
}

export default VariationGroupCustom
