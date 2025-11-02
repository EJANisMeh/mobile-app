import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionaireAddMenuItemStyles } from '../../../../styles/concessionaire/addMenuItem'
import { AddMenuItemFormData } from '../../../../types'
import { useConcessionaireNavigation } from '../../../../hooks/useNavigation'
import { UseCheckboxMenuModalType } from '../../../../hooks/useModals/useCheckboxMenuModal'
import { Category } from '../../../../types/categoryTypes'

interface CategorySelectorProps {
	formData: AddMenuItemFormData
	setFormData: React.Dispatch<React.SetStateAction<AddMenuItemFormData>>
	categories: Category[]
	errors: Record<string, string>
	showCheckboxMenu: UseCheckboxMenuModalType['showMenu']
	hideCheckboxMenu: UseCheckboxMenuModalType['hideMenu']
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
	formData,
	setFormData,
	categories,
	errors,
	showCheckboxMenu,
	hideCheckboxMenu,
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

		showCheckboxMenu({
			title: 'Select Categories',
			options: categoryOptions,
			selectedValues: formData.categoryIds,
			onSave: (selectedCategoryIds: number[]) => {
				setFormData((prev) => ({ ...prev, categoryIds: selectedCategoryIds }))
			},
			footer: (
				<TouchableOpacity
					style={styles.categoryFooter}
					onPress={() => {
						hideCheckboxMenu()
						navigation.navigate('CategoryManagement')
					}}>
					<Ionicons
						name="add-circle-outline"
						size={20}
						color={colors.primary}
					/>
					<Text style={styles.categoryFooterText}>Add New Category</Text>
				</TouchableOpacity>
			),
		})
	}

	const getSelectedCategoriesText = () => {
		if (formData.categoryIds.length === 0) {
			return 'Select categories'
		}
		const selectedNames = formData.categoryIds
			.map((id) => categories.find((c) => c.id === id)?.name)
			.filter(Boolean)
		return selectedNames.join(', ')
	}

	return (
		<>
			<Text style={styles.sectionTitle}>Categories *</Text>
			<TouchableOpacity
				style={styles.categoryInputContainer}
				onPress={handleCategorySelect}>
				<Text
					style={[
						styles.categoryInput,
						formData.categoryIds.length === 0 && styles.categoryPlaceholder,
					]}>
					{getSelectedCategoriesText()}
				</Text>
				<Ionicons
					name="chevron-down"
					size={20}
					color={colors.textSecondary}
				/>
			</TouchableOpacity>
			{errors['category'] && (
				<Text style={styles.nameInputError}>{errors['category']}</Text>
			)}
		</>
	)
}

export default CategorySelector
