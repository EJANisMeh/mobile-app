import React, { Dispatch, SetStateAction } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../../styles/customer'
import { VariationSelection } from '../../../../../types'
import SubVariationGroups from './SubVariationGroups'

interface CategoryMenuItem {
	id: number
	name: string
	basePrice: number | string
	availability: boolean
	variationGroups?: any[]
}

interface VariationGroupCategoryProps {
	group: any
	selection: VariationSelection
	setVariationSelections: Dispatch<
		SetStateAction<Map<number, VariationSelection>>
	>
}

const VariationGroupCategory: React.FC<VariationGroupCategoryProps> = ({
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

	// Get the category menu items from the group
	const categoryMenuItems: CategoryMenuItem[] =
		(group as any).categoryMenuItems || []

	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price
		if (numPrice === 0 || !Number.isFinite(numPrice)) return ''
		return `₱${numPrice.toFixed(2)}`
	}

	const isOptionSelected = (menuItemId: number): boolean => {
		return selection.selectedOptions.some(
			(opt) => opt.menuItemId === menuItemId
		)
	}

	const handleOptionToggle = (menuItem: CategoryMenuItem) => {
		setVariationSelections((prev) => {
			const newMap = new Map(prev)
			const currentSelection = newMap.get(group.id)

			if (!currentSelection) return prev

			const isSelected = isOptionSelected(menuItem.id)

			if (isSingleType) {
				// Single selection: Replace selection or clear if same option
				if (isSelected && selection.selectionTypeCode === 'single_optional') {
					// Clear selection for optional single
					currentSelection.selectedOptions = []
				} else {
					// Initialize subvariation selections if menu item has variation groups with specificity: false
					const subVariationSelections = new Map<number, VariationSelection>()
					if (menuItem.variationGroups && menuItem.variationGroups.length > 0) {
						// Filter only variation groups with specificity === false
						const subVariationGroupsToShow = menuItem.variationGroups.filter(
							(subGroup: any) => subGroup.specificity === false
						)
						
						subVariationGroupsToShow.forEach((subGroup: any) => {
							const selectionTypeCode = subGroup.selection_types?.code || 'single_required'
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
					currentSelection.selectedOptions = [
						{
							optionId: menuItem.id, // Use menu item id as option id
							optionName: menuItem.name,
							priceAdjustment: 0, // Category items don't have price adjustments
							menuItemId: menuItem.id,
							menuItemBasePrice:
								typeof menuItem.basePrice === 'string'
									? parseFloat(menuItem.basePrice)
									: menuItem.basePrice,
							subVariationSelections: subVariationSelections.size > 0 ? subVariationSelections : undefined,
						},
					]
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
							(subGroup: any) => subGroup.specificity === false
						)
						
						subVariationGroupsToShow.forEach((subGroup: any) => {
							const selectionTypeCode = subGroup.selection_types?.code || 'single_required'
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
					currentSelection.selectedOptions = [
						...currentSelection.selectedOptions,
						{
							optionId: menuItem.id, // Use menu item id as option id
							optionName: menuItem.name,
							priceAdjustment: 0, // Category items don't have price adjustments
							menuItemId: menuItem.id,
							menuItemBasePrice:
								typeof menuItem.basePrice === 'string'
									? parseFloat(menuItem.basePrice)
									: menuItem.basePrice,
							subVariationSelections: subVariationSelections.size > 0 ? subVariationSelections : undefined,
						},
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

	const renderSelectionIndicator = (menuItem: CategoryMenuItem) => {
		const isSelected = isOptionSelected(menuItem.id)

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
				{categoryMenuItems.length === 0 ? (
					<Text style={styles.description}>
						No items available in this category
					</Text>
				) : (
					categoryMenuItems.map((menuItem) => {
						const isSelected = isOptionSelected(menuItem.id)
						const isOutOfStock = !menuItem.availability
						const isDisabled = !isSingleType && !isSelected && !canSelectMore()

						// Find the selected option to get subvariation selections
						const selectedOption = selection.selectedOptions.find(
							(opt) => opt.menuItemId === menuItem.id
						)

						return (
							<View key={menuItem.id}>
								<TouchableOpacity
									style={[
										styles.optionItemButton,
										isSelected && styles.optionItemSelected,
										isDisabled && styles.optionItemDisabled,
									]}
									onPress={() => handleOptionToggle(menuItem)}
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
											{isOutOfStock && (
												<Text style={styles.outOfStockText}>Out of stock</Text>
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
									menuItem.variationGroups &&
									menuItem.variationGroups.filter((g: any) => g.specificity === false).length > 0 && (
										<SubVariationGroups
											menuItemId={menuItem.id}
											menuItemName={menuItem.name}
											subVariationGroups={menuItem.variationGroups.filter((g: any) => g.specificity === false)}
											subVariationSelections={selectedOption.subVariationSelections}
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
									)}
							</View>
						)
					})
				)}
			</View>
		</View>
	)
}

export default VariationGroupCategory
