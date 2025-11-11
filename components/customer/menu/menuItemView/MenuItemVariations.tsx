import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../styles/customer'
import { VariationSelection } from '../../../../types'
import { Category } from '../../../../types/categoryTypes'
import { apiCall } from '../../../../services/api/api'
import VariationGroupCustom from './variationGroup/VariationGroupCustom'
import VariationGroupExistingItems from './variationGroup/VariationGroupExistingItems'
import VariationGroupCategory from './variationGroup/VariationGroupCategory'
import VariationGroupMultiCategory from './variationGroup/VariationGroupMultiCategory'

interface MenuItemVariationsProps {
	variationGroups: any[]
	variationSelections: Map<number, VariationSelection>
	setVariationSelections: Dispatch<
		SetStateAction<Map<number, VariationSelection>>
	>
	concessionId: number
}

const MenuItemVariations: React.FC<MenuItemVariationsProps> = ({
	variationGroups,
	variationSelections,
	setVariationSelections,
	concessionId,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)

	const [categories, setCategories] = useState<Category[]>([])
	const [loadingCategories, setLoadingCategories] = useState(false)

	// Load categories if any variation group needs them
	useEffect(() => {
		console.log(
			'🔍 [MenuItemVariations] Total variation groups:',
			variationGroups.length
		)
		variationGroups.forEach((group, index) => {
			console.log(`📦 [MenuItemVariations] Group ${index + 1}:`, {
				id: group.id,
				name: group.name,
				kind: group.kind,
				specificity: group.specificity,
				hasExistingItems: !!group.existingMenuItems,
				existingItemsCount: group.existingMenuItems?.length || 0,
				hasCategoryMenuItems: !!group.categoryMenuItems,
				categoryMenuItemsCount: group.categoryMenuItems?.length || 0,
			})
		})

		const needsCategories = variationGroups.some(
			(group) => group.kind === 'multi_category_filter'
		)

		if (needsCategories && concessionId) {
			console.log(
				'📂 [MenuItemVariations] Loading categories for multi-category filter...'
			)
			setLoadingCategories(true)
			apiCall(`/category/get?concessionId=${concessionId}`)
				.then((data: any) => {
					if (data.success && data.categories) {
						console.log(
							'✅ [MenuItemVariations] Categories loaded:',
							data.categories.length
						)
						setCategories(data.categories)
					}
				})
				.catch((error) => {
					console.error(
						'❌ [MenuItemVariations] Failed to load categories:',
						error
					)
				})
				.finally(() => {
					setLoadingCategories(false)
				})
		}
	}, [variationGroups, concessionId])

	return (
		<View style={styles.variationsContainer}>
			<Text style={styles.sectionTitle}>Variations</Text>
			{variationGroups.map((group) => {
				const selection = variationSelections.get(group.id)
				if (!selection) {
					console.log(
						`⚠️ [MenuItemVariations] No selection found for group ${group.id} (${group.name})`
					)
					return null
				}

				console.log(
					`🎯 [MenuItemVariations] Rendering group ${group.id} (${group.name}) with kind: ${group.kind}`
				)

				// Route to different components based on kind
				if (group.kind === 'group') {
					// Custom mode uses simple radio/checkboxes (no subvariations)
					console.log(`  → Routing to VariationGroupCustom (custom mode)`)
					return (
						<VariationGroupCustom
							key={group.id}
							group={group}
							selection={selection}
							setVariationSelections={setVariationSelections}
						/>
					)
				} else if (group.kind === 'existing_items') {
					// Existing items mode lists items with subvariations (specificity: false)
					console.log(`  → Routing to VariationGroupExistingItems`)
					return (
						<VariationGroupExistingItems
							key={group.id}
							group={group}
							selection={selection}
							setVariationSelections={setVariationSelections}
						/>
					)
				} else if (
					group.kind === 'single_category_filter' ||
					group.kind === 'category_filter'
				) {
					// Single category mode uses menu items from one category
					console.log(`  → Routing to VariationGroupCategory`)
					return (
						<VariationGroupCategory
							key={group.id}
							group={group}
							selection={selection}
							setVariationSelections={setVariationSelections}
						/>
					)
				} else if (group.kind === 'multi_category_filter') {
					// Multi category mode - now implemented!
					console.log(`  → Routing to VariationGroupMultiCategory`)
					if (loadingCategories) {
						return (
							<View
								key={group.id}
								style={styles.variationGroup}>
								<Text style={styles.variationGroupName}>{group.name}</Text>
								<Text style={styles.description}>Loading categories...</Text>
							</View>
						)
					}
					return (
						<VariationGroupMultiCategory
							key={group.id}
							group={group}
							selection={selection}
							setVariationSelections={setVariationSelections}
							categories={categories}
						/>
					)
				}

				console.log(`  ⚠️ Unknown group kind: ${group.kind}`)
				return null
			})}
		</View>
	)
}

export default MenuItemVariations
