import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createConcessionaireEditMenuItemStyles } from '../../../../../styles/concessionaire'
import { VariationGroupInput } from '../../../../../types/menuItemTypes'
import { UseCheckboxMenuModalType } from '../../../../../hooks/useModals/useCheckboxMenuModal'

interface VariationMultiCategoryProps {
	group: VariationGroupInput
	groupIndex: number
	categories: any[]
	itemCategoryIds: number[]
	showCheckboxMenu: UseCheckboxMenuModalType['showMenu']
	handleUpdateVariationGroup: (
		index: number,
		field: keyof VariationGroupInput,
		value: any
	) => void
}

const VariationMultiCategory: React.FC<VariationMultiCategoryProps> = ({
	group,
	groupIndex,
	categories,
	itemCategoryIds,
	showCheckboxMenu,
	handleUpdateVariationGroup,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireEditMenuItemStyles(colors, responsive)

	// Filter out item's selected categories unless there are no categories selected yet
	const availableCategories =
		itemCategoryIds.length > 0
			? categories.filter((cat) => !itemCategoryIds.includes(cat.id))
			: categories

	const selectedCategoryNames =
		group.categoryFilterIds && group.categoryFilterIds.length > 0
			? availableCategories
					.filter((cat) => group.categoryFilterIds?.includes(cat.id))
					.map((cat) => cat.name)
					.join(', ')
			: 'Select categories'

	const handleCategorySelection = () => {
		showCheckboxMenu({
			title: 'Select Categories',
			message: 'Choose categories for this variation group',
			options: availableCategories.map((cat) => ({
				label: cat.name,
				value: cat.id,
			})),
			selectedValues: group.categoryFilterIds || [],
			onSave: (selectedIds: number[]) => {
				handleUpdateVariationGroup(groupIndex, 'categoryFilterIds', selectedIds)
			},
		})
	}

	return (
		<>
			<Text style={styles.labelSmall}>Categories:</Text>
			<TouchableOpacity
				style={styles.categoryInputContainer}
				onPress={handleCategorySelection}>
				<Text
					style={[
						styles.categoryInput,
						!group.categoryFilterIds || group.categoryFilterIds.length === 0
							? { color: colors.textSecondary }
							: undefined,
					]}>
					{selectedCategoryNames}
				</Text>
				<Ionicons
					name="chevron-down"
					size={16}
					color={colors.textSecondary}
				/>
			</TouchableOpacity>
		</>
	)
}

export default VariationMultiCategory
