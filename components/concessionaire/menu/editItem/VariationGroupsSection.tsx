import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionaireEditMenuItemStyles } from '../../../../styles/concessionaire'
import {
	AddMenuItemFormData,
	VariationGroupInput,
	Category,
	SelectionType,
} from '../../../../types'
import {
	UseAlertModalType,
	UseConfirmationModalType,
	UseMenuModalType,
} from '../../../../hooks/useModals/types'
import { UseCheckboxMenuModalType } from '../../../../hooks/useModals/useCheckboxMenuModal'
import {
	VariationGroupHeader,
	VariationGroupName,
	VariationModeSelection,
	VariationCategory,
	VariationSelectionType,
	VariationMultiLimit,
	VariationCustomOptions,
	VariationExistingItems,
	VariationSpecificity,
} from './variationGroup'
import VariationMultiCategory from './variationGroup/VariationMultiCategory'
import VariationCategoryPriceAdjustment from './variationGroup/VariationCategoryPriceAdjustment'

interface VariationGroupsSectionProps {
	formData: AddMenuItemFormData
	setFormData: React.Dispatch<React.SetStateAction<AddMenuItemFormData>>
	categories: Category[]
	selectionTypes: SelectionType[]
	errors: Record<string, string>
	setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
	showMenuModal: UseMenuModalType['showMenu']
	showCheckboxMenu: UseCheckboxMenuModalType['showMenu']
	showAlert: UseAlertModalType['showAlert']
	showConfirmation: UseConfirmationModalType['showConfirmation']
	itemId: number
}

const VariationGroupsSection: React.FC<VariationGroupsSectionProps> = ({
	formData,
	setFormData,
	categories,
	selectionTypes,
	errors,
	setErrors,
	showMenuModal,
	showCheckboxMenu,
	showAlert,
	showConfirmation,
	itemId,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireEditMenuItemStyles(colors, responsive)

	// Variation Group Handlers
	const handleAddVariationGroup = () => {
		// Use first available selection type, or fallback to 1
		const defaultSelectionTypeId =
			selectionTypes.length > 0 ? selectionTypes[0].id : 1

		const newGroup: VariationGroupInput = {
			name: '',
			selectionTypeId: defaultSelectionTypeId,
			multiLimit: null,
			mode: 'custom',
			categoryFilterId: null,
			options: [],
			existingMenuItemIds: [],
			specificity: true,
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
			variationGroups: prev.variationGroups.map((group, i) => {
				if (i !== index) return group

				const updated = { ...group, [field]: value }

				// Force specificity to true for category modes
				if (
					field === 'mode' &&
					(value === 'single-category' || value === 'multi-category')
				) {
					updated.specificity = true
				}

				return updated
			}),
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
					<VariationGroupHeader
						groupIndex={groupIndex}
						setFormData={setFormData}
						showConfirmation={showConfirmation}
					/>

					<VariationGroupName
						group={group}
						groupIndex={groupIndex}
						errors={errors}
						handleUpdateVariationGroup={handleUpdateVariationGroup}
					/>

					<VariationModeSelection
						groupIndex={groupIndex}
						group={group}
						showAlert={showAlert}
						handleUpdateVariationGroup={handleUpdateVariationGroup}
					/>

					{/* Category Filter (for single-category mode) */}
					{group.mode === 'single-category' && (
						<>
							<VariationCategory
								group={group}
								groupIndex={groupIndex}
								categories={categories}
								itemCategoryIds={formData.categoryIds}
								showMenuModal={showMenuModal}
								handleUpdateVariationGroup={handleUpdateVariationGroup}
							/>
							<VariationCategoryPriceAdjustment
								group={group}
								groupIndex={groupIndex}
								showAlert={showAlert}
								handleUpdateVariationGroup={handleUpdateVariationGroup}
							/>
						</>
					)}

					{/* Multi Category Filter (for multi-category mode) */}
					{group.mode === 'multi-category' && (
						<>
							<VariationMultiCategory
								group={group}
								groupIndex={groupIndex}
								categories={categories}
								itemCategoryIds={formData.categoryIds}
								showCheckboxMenu={showCheckboxMenu}
								handleUpdateVariationGroup={handleUpdateVariationGroup}
							/>
							{errors[`variation-${groupIndex}-categoryFilterIds`] && (
								<Text style={styles.errorText}>
									{errors[`variation-${groupIndex}-categoryFilterIds`]}
								</Text>
							)}
							<VariationCategoryPriceAdjustment
								group={group}
								groupIndex={groupIndex}
								showAlert={showAlert}
								handleUpdateVariationGroup={handleUpdateVariationGroup}
							/>
						</>
					)}

					<VariationSelectionType
						groupIndex={groupIndex}
						group={group}
						selectionTypes={selectionTypes}
						showAlert={showAlert}
						showMenuModal={showMenuModal}
						handleUpdateVariationGroup={handleUpdateVariationGroup}
					/>

					{selectionTypes.length > 0 &&
						(
							selectionTypes.find((t) => t.id === group.selectionTypeId)
								?.code || ''
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

				{/* Specificity Toggle - Hidden for category modes */}
				{group.mode !== 'single-category' &&
					group.mode !== 'multi-category' && (
						<VariationSpecificity
							groupIndex={groupIndex}
							group={group}
							showAlert={showAlert}
							handleUpdateVariationGroup={handleUpdateVariationGroup}
						/>
					)}

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

					{group.mode === 'existing' && (
						<VariationExistingItems
							setFormData={setFormData}
							groupIndex={groupIndex}
							group={group}
							errors={errors}
							showAlert={showAlert}
							showMenuModal={showMenuModal}
							itemId={itemId}
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
