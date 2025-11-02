import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionaireAddMenuItemStyles } from '../../../../styles/concessionaire/addMenuItem'
import { AddMenuItemFormData } from '../../../../types'
import { useConcessionaireNavigation } from '../../../../hooks/useNavigation'
import { UseMenuModalType } from '../../../../hooks/useModals/useMenuModal'
import { Category } from '../../../../types/categoryTypes'

interface CategorySelectorProps {
	formData: AddMenuItemFormData
	setFormData: React.Dispatch<React.SetStateAction<AddMenuItemFormData>>
	categories: Category[]
	errors: Record<string, string>
	showMenu: UseMenuModalType['showMenu']
	hideMenu: UseMenuModalType['hideMenu']
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
	formData,
	setFormData,
	categories,
	errors,
	showMenu,
	hideMenu,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireAddMenuItemStyles(colors, responsive)
	const navigation = useConcessionaireNavigation()

	const handleCategorySelect = () => {
		const categoryOptions = categories.map((cat) => ({
			label: cat.name,
			value: cat.id,
		}))

		showMenu({
			title: 'Select Category',
			options: categoryOptions,
			onSelect: (value: number) => {
				setFormData((prev) => ({ ...prev, categoryId: value }))
			},
			footer: (
				<TouchableOpacity
					style={styles.categoryFooter}
					onPress={() => {
						hideMenu()
						navigation.navigate('CategoryManagement')
					}}>
					<Ionicons
						name="add-circle-outline"
						size={20}
						color={colors.primary}
					/>
					<Text style={styles.categoryFooterText}>
						Add New Category
					</Text>
				</TouchableOpacity>
			),
		})
	}

	return (
		<>
			<Text style={styles.sectionTitle}>Category *</Text>
			<TouchableOpacity
				style={styles.categoryInputContainer}
				onPress={handleCategorySelect}>
				<Text
					style={[
						styles.categoryInput,
						!formData.categoryId && styles.categoryPlaceholder,
					]}>
					{formData.categoryId
						? categories.find((c) => c.id === formData.categoryId)?.name
						: 'Select category'}
				</Text>
				<Ionicons
					name="chevron-down"
					size={20}
					color={colors.textSecondary}
				/>
			</TouchableOpacity>
			{errors['category'] && (
				<Text style={styles.nameInputError}>
					{errors['category']}
				</Text>
			)}
		</>
	)
}

export default CategorySelector
