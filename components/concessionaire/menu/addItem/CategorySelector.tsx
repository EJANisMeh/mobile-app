import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionaireMenuStyles } from '../../../../styles/concessionaire/menu'
import { AddMenuItemFormData } from '../../../../types'
import { useCategoryBackend } from '../../../../hooks/useBackend/useCategoryBackend'
import { useConcessionaireNavigation } from '../../../../hooks/useNavigation'
import { UseMenuModalType } from '../../../../hooks/useModals/useMenuModal'

interface CategorySelectorProps {
	formData: AddMenuItemFormData
	setFormData: React.Dispatch<React.SetStateAction<AddMenuItemFormData>>
	errors: Record<string, string>
	showMenu: UseMenuModalType['showMenu']
	hideMenu: UseMenuModalType['hideMenu']
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
	formData,
	setFormData,
	errors,
	showMenu,
	hideMenu,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireMenuStyles(colors, responsive)
	const { categories } = useCategoryBackend()
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
						hideMenu()
						navigation.navigate('CategoryManagement')
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

	return (
		<>
			<Text style={styles.sectionTitle}>Category *</Text>
			<TouchableOpacity
				style={styles.categoryInputContainer}
				onPress={handleCategorySelect}>
				<Text
					style={[
						styles.categoryInput,
						!formData.categoryId && { color: colors.textSecondary },
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
				<Text style={{ color: '#ef4444', marginTop: 4 }}>
					{errors['category']}
				</Text>
			)}
		</>
	)
}

export default CategorySelector
