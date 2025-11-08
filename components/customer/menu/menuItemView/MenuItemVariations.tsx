import React, { Dispatch, SetStateAction } from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../styles/customer'
import { VariationSelection } from '../../../../types'
import VariationGroupCustom from './variationGroup/VariationGroupCustom'
import VariationGroupCategory from './variationGroup/VariationGroupCategory'

interface MenuItemVariationsProps {
	variationGroups: any[]
	variationSelections: Map<number, VariationSelection>
	setVariationSelections: Dispatch<
		SetStateAction<Map<number, VariationSelection>>
	>
}

const MenuItemVariations: React.FC<MenuItemVariationsProps> = ({
	variationGroups,
	variationSelections,
	setVariationSelections,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)

	return (
		<View style={styles.variationsContainer}>
			<Text style={styles.sectionTitle}>Variations</Text>
			{variationGroups.map((group) => {
				const selection = variationSelections.get(group.id)
				if (!selection) return null

				// Route to different components based on kind
				if (group.kind === 'group' || group.kind === 'existing_items') {
					// Custom and existing modes use same component (radio/checkboxes)
					return (
						<VariationGroupCustom
							key={group.id}
							group={group}
							selection={selection}
							setVariationSelections={setVariationSelections}
						/>
					)
				} else if (group.kind === 'category_filter') {
					// Category mode uses menu items from category
					return (
						<VariationGroupCategory
							key={group.id}
							group={group}
							selection={selection}
							setVariationSelections={setVariationSelections}
						/>
					)
				}

				return null
			})}
		</View>
	)
}

export default MenuItemVariations
