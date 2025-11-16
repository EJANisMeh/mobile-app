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
		const needsCategories = variationGroups.some(
			(group) => group.kind === 'multi_category_filter'
		)

		if (needsCategories && concessionId) {
			setLoadingCategories(true)
			apiCall(`/category/get?concessionId=${concessionId}`)
				.then((data: any) => {
					if (data.success && data.categories) {
						setCategories(data.categories)
					}
				})
				.catch((error) => {
					console.error(
						'[MenuItemVariations] Failed to load categories:',
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
					return null
				}

				// Route to different components based on kind
				if (group.kind === 'group') {
					// Custom mode uses simple radio/checkboxes (no subvariations)
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
				return null
			})}
		</View>
	)
}

export default MenuItemVariations
