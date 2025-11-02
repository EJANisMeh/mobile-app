import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext, useMenuContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionaireAddMenuItemStyles } from '../../../../styles/concessionaire/addMenuItem'
import {
	UseAlertModalType,
	UseConfirmationModalType,
} from '../../../../hooks/useModals/types'
import {
	AddMenuItemFormData,
	VariationGroupInput,
	SelectionType,
} from '../../../../types/menuItemTypes'
import { Category } from '../../../../types/categoryTypes'
import {
	VariationCategory,
	VariationGroupHeader,
	VariationGroupName,
	VariationModeSelection,
	VariationSelectionType,
	VariationMultiLimit,
	VariationCustomOptions,
	VariationExistingItems,
} from './variationGroup'
import { UseMenuModalType } from '../../../../hooks/useModals/useMenuModal'

interface VariationGroupsSectionProps {
	formData: AddMenuItemFormData
	setFormData: React.Dispatch<React.SetStateAction<AddMenuItemFormData>>
	categories: Category[]
	selectionTypes: SelectionType[]
	errors: Record<string, string>
	setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
	showMenuModal: UseMenuModalType['showMenu']
	showAlert: UseAlertModalType['showAlert']
	showConfirmation: UseConfirmationModalType['showConfirmation']
}

const VariationGroupsSection: React.FC<VariationGroupsSectionProps> = ({
	formData,
	setFormData,
	categories,
	selectionTypes,
	errors,
	setErrors,
	showMenuModal,
	showAlert,
	showConfirmation,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireAddMenuItemStyles(colors, responsive)
	const { menuItems } = useMenuContext()

	// Variation Group Handlers
	const handleAddVariationGroup = () => {
		const newGroup: VariationGroupInput = {
			name: '',
			selectionTypeId: 1, // Default to first selection type
			multiLimit: null,
			mode: 'custom',
			categoryFilterId: null,
			options: [],
			existingMenuItemIds: [],
			position: formData.variationGroups.length,
		}
		setFormData((prev) => ({
			...prev,
			variationGroups: [...prev.variationGroups, newGroup],
		}))
	}

	const handleUpdateVariationGroup = (
		index: number,
		field: keyof VariationGroupInput,
		value: any
	) => {
		setFormData((prev) => ({
			...prev,
			variationGroups: prev.variationGroups.map((group, i) =>
				i === index ? { ...group, [field]: value } : group
			),
		}))
	}

	return (
		<>
			<View style={styles.variationsSectionHeader}>
				<Text style={[styles.sectionTitle, { marginBottom: 0, flex: 1 }]}>
					Variations (Optional)
				</Text>
				<TouchableOpacity
					style={styles.helpButton}
					onPress={() =>
						showAlert({
							title: 'Variations Help',
							message:
								'Variations: group of choices for your menu item (e.g., sizes, toppings, rice type, etc.)',
						})
					}>
					<Text style={styles.helpButtonText}>?</Text>
				</TouchableOpacity>
			</View>
			{formData.variationGroups.map((group, groupIndex) => (
				<View
					key={groupIndex}
					style={styles.variationGroupCard}>
					{/* Group Header */}
					<VariationGroupHeader
						groupIndex={groupIndex}
						setFormData={setFormData}
						showConfirmation={showConfirmation}
					/>

					{/* Group Name */}
					<VariationGroupName
						group={group}
						groupIndex={groupIndex}
						errors={errors}
						handleUpdateVariationGroup={handleUpdateVariationGroup}
					/>

					{/* Mode Selection */}
					<VariationModeSelection
						groupIndex={groupIndex}
						group={group}
						showAlert={showAlert}
						handleUpdateVariationGroup={handleUpdateVariationGroup}
					/>

					{/* Category Filter (for category mode) */}
					{group.mode === 'category' && (
						<VariationCategory
							group={group}
							groupIndex={groupIndex}
							categories={categories}
							showMenuModal={showMenuModal}
							handleUpdateVariationGroup={handleUpdateVariationGroup}
						/>
					)}
					{errors[`variation-${groupIndex}-categoryFilterId`] && (
						<Text style={styles.errorText}>
							{errors[`variation-${groupIndex}-categoryFilterId`]}
						</Text>
					)}

					{/* Selection Type */}
					<VariationSelectionType
						groupIndex={groupIndex}
						group={group}
						selectionTypes={selectionTypes}
						showAlert={showAlert}
						showMenuModal={showMenuModal}
						handleUpdateVariationGroup={handleUpdateVariationGroup}
					/>

					{/* Multi limit input for multi selection types */}
					{(
						selectionTypes.find((t) => t.id === group.selectionTypeId)?.code ||
						''
					).startsWith('multi') && (
						<VariationMultiLimit
							groupIndex={groupIndex}
							group={group}
							errors={errors}
							setErrors={setErrors}
							showAlert={showAlert}
							handleUpdateVariationGroup={handleUpdateVariationGroup}
						/>
					)}
					{/* Custom Options (for custom mode only) */}
					{group.mode === 'custom' && (
						<VariationCustomOptions
							formData={formData}
							setFormData={setFormData}
							groupIndex={groupIndex}
							group={group}
							errors={errors}
							showAlert={showAlert}
						/>
					)}
					{/* Existing Items mode: allow selecting menu items as options */}
					{group.mode === 'existing' && (
						<VariationExistingItems
							setFormData={setFormData}
							groupIndex={groupIndex}
							group={group}
							errors={errors}
							showAlert={showAlert}
							showMenuModal={showMenuModal}
						/>
					)}
				</View>
			))}

			<TouchableOpacity
				style={styles.addCategoryButton}
				onPress={handleAddVariationGroup}>
				<Ionicons
					name="add-circle-outline"
					size={20}
					color={colors.primary}
				/>
				<Text style={styles.addCategoryButtonText}>Add Variation Group</Text>
			</TouchableOpacity>
		</>
	)
}

export default VariationGroupsSection
