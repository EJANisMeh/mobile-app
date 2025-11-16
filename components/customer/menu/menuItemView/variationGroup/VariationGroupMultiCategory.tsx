import React, { Dispatch, SetStateAction, useState, useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../../styles/customer'
import { VariationSelection } from '../../../../../types'
import { Category } from '../../../../../types/categoryTypes'
import { getMenuItemStatusText } from '../../../../../utils'
import SubVariationGroups from './SubVariationGroups'
import CategorySelectionModal from '../modals/CategorySelectionModal'
import ItemSelectionModal from '../modals/ItemSelectionModal'

interface CategoryMenuItem {
	id: number
	name: string
	basePrice: number | string
	availability: boolean
	availabilitySchedule?: any
	variationGroups?: any[]
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
	categories: Category[]
}

const VariationGroupMultiCategory: React.FC<
	VariationGroupMultiCategoryProps
> = ({ group, selection, setVariationSelections, categories }) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)

	const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false)
	const [isItemModalVisible, setIsItemModalVisible] = useState(false)
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
		const filtered = categories.filter((cat) =>
			categoryFilterIds.includes(cat.id)
		)
		return filtered
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

	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price
		const adjustedPrice = Math.max(0, numPrice + categoryPriceAdjustment)
		if (adjustedPrice === 0 || !Number.isFinite(adjustedPrice)) return 'Free'
		return `₱${adjustedPrice.toFixed(2)}`
	}

	// Use imported utility function for consistent status text

	const handleCategorySelect = (categoryId: number) => {
		const category = availableCategories.find((c) => c.id === categoryId)

		setSelectedCategoryId(categoryId)
		setIsCategoryModalVisible(false)
		setIsItemModalVisible(true)
	}

	const handleItemConfirm = (selectedItemIds: number[]) => {
		setVariationSelections((prev) => {
			const newMap = new Map(prev)
			const currentSelection = newMap.get(group.id)

			if (!currentSelection) {
				return prev
			}

			// Get items for selected category
			const categoryItems = selectedCategoryId
				? itemsByCategory.get(selectedCategoryId) || []
				: []

			// Build selected options from selected item IDs
			const selectedOptions = selectedItemIds.map((itemId) => {
				const menuItem = categoryItems.find((item) => item.id === itemId)
				if (!menuItem) {
					return null
				}

				const numPrice =
					typeof menuItem.basePrice === 'string'
						? parseFloat(menuItem.basePrice)
						: menuItem.basePrice
				const adjustedPrice = Math.max(0, numPrice + categoryPriceAdjustment)

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

				return {
					optionId: menuItem.id,
					optionName: menuItem.name,
					priceAdjustment: 0, // Keep priceAdjustment for backward compatibility
					menuItemId: menuItem.id,
					menuItemBasePrice: adjustedPrice, // Use adjusted price with category adjustment
					subVariationSelections:
						subVariationSelections.size > 0
							? subVariationSelections
							: undefined,
				}
			})

			// Filter out null values
			currentSelection.selectedOptions = selectedOptions.filter(
				(opt) => opt !== null
			) as any[]

			newMap.set(group.id, currentSelection)
			return newMap
		})

		setIsItemModalVisible(false)
		setSelectedCategoryId(null)
	}

	// Get currently selected item IDs for modal
	const selectedItemIds = selection.selectedOptions.map(
		(opt) => opt.menuItemId || 0
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

			{/* Select a category button */}
			<TouchableOpacity
				style={[styles.modalButton, { backgroundColor: colors.surface }]}
				onPress={() => setIsCategoryModalVisible(true)}>
				<Text style={[styles.modalButtonText, { color: colors.text }]}>
					{selection.selectedOptions.length > 0
						? `${selection.selectedOptions.length} item(s) selected. \nPress again to Reselect Items`
						: 'Select a category'}
				</Text>
			</TouchableOpacity>

			{/* Display selected items with subvariations */}
			{selection.selectedOptions.length > 0 && (
				<View style={styles.selectedItemsList}>
					{selection.selectedOptions.map((selectedOption) => {
						const menuItem = allCategoryMenuItems.find(
							(item) => item.id === selectedOption.menuItemId
						)
						if (!menuItem) {
							return null
						}

						const statusText = getMenuItemStatusText(menuItem)
						const subVariationGroupsToShow =
							menuItem.variationGroups?.filter(
								(g: any) => g.specificity === false
							) || []

						return (
							<View
								key={selectedOption.menuItemId}
								style={styles.selectedItemContainer}>
								<View style={styles.selectedItemHeader}>
									<View style={{ flex: 1 }}>
										<Text
											style={[
												styles.selectedItemName,
												{
													color: statusText
														? colors.textSecondary
														: colors.text,
												},
											]}>
											{selectedOption.optionName}
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
									<Text
										style={[
											styles.selectedItemPrice,
											{ color: colors.primary },
										]}>
										{formatPrice(menuItem.basePrice)}
									</Text>
								</View>

								{/* Show subvariations if menu item has variation groups with specificity: false */}
								{selectedOption.subVariationSelections &&
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
			)}

			{/* Category selection modal */}
			<CategorySelectionModal
				visible={isCategoryModalVisible}
				categories={availableCategories}
				onClose={() => setIsCategoryModalVisible(false)}
				onConfirm={handleCategorySelect}
				title={`Select a category - ${group.name}`}
			/>

			{/* Item selection modal */}
			{selectedCategoryId && (
				<ItemSelectionModal
					visible={isItemModalVisible}
					items={itemsByCategory.get(selectedCategoryId) || []}
					onClose={() => {
						setIsItemModalVisible(false)
						setSelectedCategoryId(null)
					}}
					onConfirm={handleItemConfirm}
					title={`Select items - ${
						availableCategories.find((c) => c.id === selectedCategoryId)
							?.name || ''
					}`}
					isSingleSelection={isSingleType}
					isRequired={isRequired}
					multiLimit={multiLimit}
					categoryPriceAdjustment={categoryPriceAdjustment}
				/>
			)}
		</View>
	)
}

export default VariationGroupMultiCategory
