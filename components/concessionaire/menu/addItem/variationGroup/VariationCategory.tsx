import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createConcessionaireAddMenuItemStyles } from '../../../../../styles/concessionaire/addMenuItem'
import { Category } from '../../../../../types/categoryTypes'
import { VariationGroupInput } from '../../../../../types/menuItemTypes'
import { UseMenuModalType } from '../../../../../hooks/useModals/useMenuModal'

interface VariationCategoryProps {
	group: VariationGroupInput
	groupIndex: number
	categories: Category[]
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
  showMenuModal,
  handleUpdateVariationGroup,
 }) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
  const styles = createConcessionaireAddMenuItemStyles(colors, responsive)
  
	return (
		<>
			<TouchableOpacity
				style={styles.variationCategoryInputContainer}
				onPress={() => {
					const categoryOptions = categories.map((cat) => ({
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
						styles.variationCategoryText,
						!group.categoryFilterId && {
							color: colors.textSecondary,
						},
					]}>
					{group.categoryFilterId
						? categories.find((c) => c.id === group.categoryFilterId)?.name
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
