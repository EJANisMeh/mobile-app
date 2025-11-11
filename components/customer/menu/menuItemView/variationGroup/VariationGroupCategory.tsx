import React, { Dispatch, SetStateAction, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../../styles/customer'
import { VariationSelection } from '../../../../../types'
import SubVariationGroups from './SubVariationGroups'
import ItemSelectionModal from '../modals/ItemSelectionModal'

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

	const [isModalVisible, setIsModalVisible] = useState(false)

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
	
	console.log(`📦 [VariationGroupCategory] Group ${group.id} (${group.name}):`)
	console.log(`  - categoryMenuItems count: ${categoryMenuItems.length}`)
	if (categoryMenuItems.length > 0) {
		console.log(`  - Sample item:`, categoryMenuItems[0])
	}

	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price
		if (numPrice === 0 || !Number.isFinite(numPrice)) return 'Free'
		return `₱${numPrice.toFixed(2)}`
	}

	const handleModalConfirm = (selectedItemIds: number[]) => {
		console.log(`✅ [VariationGroupCategory] Items confirmed:`, selectedItemIds)
		
		setVariationSelections((prev) => {
			const newMap = new Map(prev)
			const currentSelection = newMap.get(group.id)

			if (!currentSelection) {
				console.log(`  ⚠️ No current selection found for group ${group.id}`)
				return prev
			}

			// Build selected options from selected item IDs
			const selectedOptions = selectedItemIds.map((itemId) => {
				const menuItem = categoryMenuItems.find((item) => item.id === itemId)
				if (!menuItem) {
					console.log(`  ⚠️ Menu item ${itemId} not found in categoryMenuItems`)
					return null
				}

				console.log(`  📦 Processing menu item ${menuItem.id} (${menuItem.name}):`)
				console.log(`    - basePrice: ${menuItem.basePrice}`)
				console.log(`    - variationGroups count: ${menuItem.variationGroups?.length || 0}`)

				// Initialize subvariation selections if menu item has variation groups with specificity: false
				const subVariationSelections = new Map<number, VariationSelection>()
				if (menuItem.variationGroups && menuItem.variationGroups.length > 0) {
					console.log(`    - Filtering subvariation groups (specificity: false)...`)
					
					// Filter only variation groups with specificity === false
					const subVariationGroupsToShow = menuItem.variationGroups.filter(
						(subGroup: any) => {
							console.log(`      - Group ${subGroup.id} (${subGroup.name}): specificity=${subGroup.specificity}`)
							return subGroup.specificity === false
						}
					)

					console.log(`    - Subvariation groups to show: ${subVariationGroupsToShow.length}`)

					subVariationGroupsToShow.forEach((subGroup: any) => {
						const selectionTypeCode =
							subGroup.selection_types?.code || 'single_required'
						
						console.log(`      ✓ Initializing subgroup ${subGroup.id} (${subGroup.name}) with type: ${selectionTypeCode}`)
						
						subVariationSelections.set(subGroup.id, {
							groupId: subGroup.id,
							groupName: subGroup.name,
							selectionTypeCode: selectionTypeCode,
							multiLimit: subGroup.multi_limit || 0,
							selectedOptions: [],
						})
					})
				}

				console.log(`    - subVariationSelections Map size: ${subVariationSelections.size}`)

				return {
					optionId: menuItem.id, // Use menu item id as option id
					optionName: menuItem.name,
					priceAdjustment: 0, // Category items don't have price adjustments
					menuItemId: menuItem.id,
					menuItemBasePrice:
						typeof menuItem.basePrice === 'string'
							? parseFloat(menuItem.basePrice)
							: menuItem.basePrice,
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

			console.log(`  ✅ Total selected options: ${currentSelection.selectedOptions.length}`)
			console.log(`  - Options with subvariations: ${currentSelection.selectedOptions.filter(opt => opt.subVariationSelections).length}`)

			newMap.set(group.id, currentSelection)
			return newMap
		})

		setIsModalVisible(false)
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

			{/* Select items button */}
			<TouchableOpacity
				style={[styles.modalButton, { backgroundColor: colors.surface }]}
				onPress={() => setIsModalVisible(true)}>
				<Text style={[styles.modalButtonText, { color: colors.text }]}>
					{selection.selectedOptions.length > 0
						? `${selection.selectedOptions.length} item(s) selected`
						: 'Select items'}
				</Text>
			</TouchableOpacity>

			{/* Display selected items with subvariations */}
			{selection.selectedOptions.length > 0 && (
				<View style={styles.selectedItemsList}>
					{selection.selectedOptions.map((selectedOption) => {
						const menuItem = categoryMenuItems.find(
							(item) => item.id === selectedOption.menuItemId
						)
						if (!menuItem) {
							console.log(`⚠️ [VariationGroupCategory] Menu item ${selectedOption.menuItemId} not found in categoryMenuItems`)
							return null
						}

						const subVariationGroupsToShow = menuItem.variationGroups?.filter(
							(g: any) => g.specificity === false
						) || []

						console.log(`🎨 [VariationGroupCategory] Rendering selected item ${menuItem.id} (${menuItem.name}):`)
						console.log(`  - Has subVariationSelections: ${!!selectedOption.subVariationSelections}`)
						console.log(`  - menuItem.variationGroups count: ${menuItem.variationGroups?.length || 0}`)
						console.log(`  - Subvariation groups to show (specificity: false): ${subVariationGroupsToShow.length}`)
						
						if (subVariationGroupsToShow.length > 0) {
							console.log(`  - Subvariation groups:`, subVariationGroupsToShow.map((g: any) => ({
								id: g.id,
								name: g.name,
								specificity: g.specificity
							})))
						}

						return (
							<View
								key={selectedOption.menuItemId}
								style={styles.selectedItemContainer}>
								<View style={styles.selectedItemHeader}>
									<Text
										style={[styles.selectedItemName, { color: colors.text }]}>
										{selectedOption.optionName}
									</Text>
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
											{console.log(`  🚀 Passing to SubVariationGroups:`, {
												menuItemId: menuItem.id,
												menuItemName: menuItem.name,
												subVariationGroupsCount: subVariationGroupsToShow.length,
												subVariationSelectionsSize: selectedOption.subVariationSelections.size
											})}
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

			{/* Item selection modal */}
			<ItemSelectionModal
				visible={isModalVisible}
				items={categoryMenuItems}
				onClose={() => setIsModalVisible(false)}
				onConfirm={handleModalConfirm}
				title={`Select items - ${group.name}`}
				isSingleSelection={isSingleType}
				isRequired={isRequired}
				multiLimit={multiLimit}
			/>
		</View>
	)
}

export default VariationGroupCategory
