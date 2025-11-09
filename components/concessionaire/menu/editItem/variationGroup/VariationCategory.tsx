import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createConcessionaireEditMenuItemStyles } from '../../../../../styles/concessionaire'
import { Category } from '../../../../../types/categoryTypes'
import { VariationGroupInput } from '../../../../../types/menuItemTypes'
import { UseMenuModalType } from '../../../../../hooks/useModals/useMenuModal'

interface VariationCategoryProps {
	group: VariationGroupInput
	groupIndex: number
	categories: Category[]
	itemCategoryIds: number[]
	showMenuModal: UseMenuModalType['showMenu']
	handleUpdateVariationGroup: (
		index: number,
		field: keyof VariationGroupInput,
		value: any
	) => void
}

const VariationCategory: React.FC<VariationCategoryProps> = ({
	group,
	groupIndex,
	categories,
	itemCategoryIds,
	showMenuModal,
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

	return (
		<>
			<TouchableOpacity
				style={[styles.categoryInputContainer, styles.categoryFilterMargin]}
				onPress={() => {
					const categoryOptions = availableCategories.map((cat) => ({
						label: cat.name,
						value: cat.id,
					}))
					showMenuModal({
						title: 'Filter by Category',
						options: categoryOptions,
						onSelect: (value: number) => {
							handleUpdateVariationGroup(groupIndex, 'categoryFilterId', value)
						},
					})
				}}>
				<Text
					style={[
						styles.categoryInput,
						!group.categoryFilterId && {
							color: colors.textSecondary,
						},
					]}>
					{group.categoryFilterId
						? availableCategories.find((c) => c.id === group.categoryFilterId)
								?.name
						: 'Select category'}
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

export default VariationCategory
