import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionaireEditMenuItemStyles } from '../../../../styles/concessionaire/editMenuItem'
import { AddMenuItemFormData, Category } from '../../../../types'
import { UseCheckboxMenuModalType } from '../../../../hooks/useModals/useCheckboxMenuModal'

interface CategorySelectorProps {
	formData: AddMenuItemFormData
	setFormData: React.Dispatch<React.SetStateAction<AddMenuItemFormData>>
	categories: Category[]
	errors: Record<string, string>
	showCheckboxMenu: UseCheckboxMenuModalType['showMenu']
	hideCheckboxMenu: UseCheckboxMenuModalType['hideMenu']
	onNavigateToCategoryManagement: () => void
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
	formData,
	setFormData,
	categories,
	errors,
	showCheckboxMenu,
	hideCheckboxMenu,
	onNavigateToCategoryManagement,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireEditMenuItemStyles(colors, responsive)

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
				setFormData((prev) => {
					// Update categoryIds
					const newFormData = { ...prev, categoryIds: selectedCategoryIds }

					// Remove newly selected categories from variation groups if present
					const updatedVariationGroups = prev.variationGroups.map((group) => {
						if (group.mode === 'single-category') {
							// If the categoryFilterId is in the newly selected categories, clear it
							if (
								group.categoryFilterId &&
								selectedCategoryIds.includes(group.categoryFilterId)
							) {
								return { ...group, categoryFilterId: null }
							}
						} else if (group.mode === 'multi-category') {
							// Remove any categoryFilterIds that are in the newly selected categories
							if (group.categoryFilterIds && group.categoryFilterIds.length > 0) {
								const filteredIds = group.categoryFilterIds.filter(
									(id) => !selectedCategoryIds.includes(id)
								)
								return { ...group, categoryFilterIds: filteredIds }
							}
						}
						return group
					})

					newFormData.variationGroups = updatedVariationGroups
					return newFormData
				})
			},
			footer: (
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						paddingVertical: 12,
						borderTopWidth: 1,
						borderTopColor: colors.border,
						gap: 8,
					}}
					onPress={() => {
						hideCheckboxMenu()
						onNavigateToCategoryManagement()
					}}>
					<Ionicons
						name="add-circle-outline"
						size={20}
						color={colors.primary}
					/>
					<Text
						style={{
							fontSize: 16,
							fontWeight: '600',
							color: colors.primary,
						}}>
						Add New Category
					</Text>
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
						formData.categoryIds.length === 0 && {
							color: colors.textSecondary,
						},
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
				<Text style={{ color: '#ef4444', marginTop: 4 }}>
					{errors['category']}
				</Text>
			)}
		</>
	)
}

export default CategorySelector
