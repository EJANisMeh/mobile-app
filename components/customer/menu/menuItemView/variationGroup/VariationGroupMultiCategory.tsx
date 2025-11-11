import React, { Dispatch, SetStateAction, useState, useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../../styles/customer'
import { VariationSelection } from '../../../../../types'

interface CategoryMenuItem {
	id: number
	name: string
	basePrice: number | string
	availability: boolean
	// Category link to group items
	menu_item_category_links?: Array<{
		category_id: number
		category?: {
			id: number
			name: string
		}
	}>
}

interface VariationGroupMultiCategoryProps {
	group: any
	selection: VariationSelection
	setVariationSelections: Dispatch<
		SetStateAction<Map<number, VariationSelection>>
	>
	categories: Array<{ id: number; name: string }>
}

const VariationGroupMultiCategory: React.FC<
	VariationGroupMultiCategoryProps
> = ({ group, selection, setVariationSelections, categories }) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)

	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
		null
	)

	const isSingleType =
		selection.selectionTypeCode === 'single_required' ||
		selection.selectionTypeCode === 'single_optional'
	const isRequired =
		selection.selectionTypeCode === 'single_required' ||
		selection.selectionTypeCode === 'multi_required'
	const multiLimit = selection.multiLimit || 0

	// Get the category menu items from the group
	const allCategoryMenuItems: CategoryMenuItem[] =
		(group as any).categoryMenuItems || []

	// Get category IDs from group configuration
	const categoryFilterIds: number[] = group.category_filter_ids || []

	// Get price adjustment
	const categoryPriceAdjustment: number = group.category_price_adjustment || 0

	// Filter categories to only those in the multi-category selection
	const availableCategories = useMemo(() => {
		return categories.filter((cat) => categoryFilterIds.includes(cat.id))
	}, [categories, categoryFilterIds])

	// Group menu items by category
	const itemsByCategory = useMemo(() => {
		const grouped = new Map<number, CategoryMenuItem[]>()

		allCategoryMenuItems.forEach((item) => {
			// Find which categories this item belongs to (from the filter list)
			const itemCategoryIds =
				item.menu_item_category_links?.map((link) => link.category_id) || []

			// Add item to ALL matching categories, not just the first one
			itemCategoryIds.forEach((catId) => {
				if (categoryFilterIds.includes(catId)) {
					if (!grouped.has(catId)) {
						grouped.set(catId, [])
					}
					grouped.get(catId)!.push(item)
				}
			})
		})

		return grouped
	}, [allCategoryMenuItems, categoryFilterIds])

	// Get items for currently selected category
	const currentCategoryItems = selectedCategoryId
		? itemsByCategory.get(selectedCategoryId) || []
		: []

	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price
		const adjustedPrice = Math.max(0, numPrice + categoryPriceAdjustment)
		if (adjustedPrice === 0 || !Number.isFinite(adjustedPrice)) return 'Free'
		return `₱${adjustedPrice.toFixed(2)}`
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
			const numPrice =
				typeof menuItem.basePrice === 'string'
					? parseFloat(menuItem.basePrice)
					: menuItem.basePrice
			const adjustedPrice = Math.max(0, numPrice + categoryPriceAdjustment)

			if (isSingleType) {
				// Single selection: Replace selection or clear if same option
				if (isSelected && selection.selectionTypeCode === 'single_optional') {
					// Clear selection for optional single
					currentSelection.selectedOptions = []
				} else {
					// Set new selection
					currentSelection.selectedOptions = [
						{
							optionId: menuItem.id,
							optionName: menuItem.name,
							priceAdjustment: 0, // Keep priceAdjustment for backward compatibility
							menuItemId: menuItem.id,
							menuItemBasePrice: adjustedPrice, // Use adjusted price with category adjustment
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
					// Add option
					currentSelection.selectedOptions = [
						...currentSelection.selectedOptions,
						{
							optionId: menuItem.id,
							optionName: menuItem.name,
							priceAdjustment: 0, // Keep priceAdjustment for backward compatibility
							menuItemId: menuItem.id,
							menuItemBasePrice: adjustedPrice, // Use adjusted price with category adjustment
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

	// Show category selection if no category is selected
	if (!selectedCategoryId) {
		return (
			<View style={styles.variationGroup}>
				<View style={styles.variationGroupHeader}>
					<Text style={styles.variationGroupName}>{group.name}</Text>
					{isRequired && <Text style={styles.requiredBadge}>Required</Text>}
					{!isSingleType && multiLimit > 0 && (
						<Text style={styles.multiLimitText}>
							(Select up to {multiLimit})
						</Text>
					)}
				</View>

				<Text style={styles.description}>Select a category:</Text>

				<View style={styles.optionsList}>
					{availableCategories.map((category) => {
						const itemCount = itemsByCategory.get(category.id)?.length || 0
						return (
							<TouchableOpacity
								key={category.id}
								style={styles.optionItemButton}
								onPress={() => setSelectedCategoryId(category.id)}>
								<View style={styles.optionContent}>
									<Text style={styles.optionName}>{category.name}</Text>
									<Text style={styles.description}>
										{itemCount} {itemCount === 1 ? 'item' : 'items'}
									</Text>
								</View>
							</TouchableOpacity>
						)
					})}
				</View>
			</View>
		)
	}

	// Show items from selected category
	const selectedCategory = availableCategories.find(
		(cat) => cat.id === selectedCategoryId
	)

	return (
		<View style={styles.variationGroup}>
			<View style={styles.variationGroupHeader}>
				<Text style={styles.variationGroupName}>{group.name}</Text>
				{isRequired && <Text style={styles.requiredBadge}>Required</Text>}
				{!isSingleType && multiLimit > 0 && (
					<Text style={styles.multiLimitText}>(Select up to {multiLimit})</Text>
				)}
			</View>

			<TouchableOpacity
				style={styles.categoryBackButton}
				onPress={() => setSelectedCategoryId(null)}>
				<Text style={styles.categoryBackButtonText}>
					← Back to categories (Current: {selectedCategory?.name})
				</Text>
			</TouchableOpacity>

			<View style={styles.optionsList}>
				{currentCategoryItems.length === 0 ? (
					<Text style={styles.description}>
						No items available in this category
					</Text>
				) : (
					currentCategoryItems.map((menuItem) => {
						const isSelected = isOptionSelected(menuItem.id)
						const isOutOfStock = !menuItem.availability
						const isDisabled = !isSingleType && !isSelected && !canSelectMore()

						return (
							<TouchableOpacity
								key={menuItem.id}
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
						)
					})
				)}
			</View>
		</View>
	)
}

export default VariationGroupMultiCategory
