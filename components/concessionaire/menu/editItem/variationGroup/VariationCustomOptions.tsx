import React from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createConcessionaireEditMenuItemStyles } from '../../../../../styles/concessionaire'
import {
	AddMenuItemFormData,
	VariationGroupInput,
	VariationOptionInput,
} from '../../../../../types'
import { UseAlertModalType } from '../../../../../hooks/useModals/types'

interface VariationCustomOptionsProps {
	formData: AddMenuItemFormData
	setFormData: React.Dispatch<React.SetStateAction<AddMenuItemFormData>>
	groupIndex: number
	group: VariationGroupInput
	errors: Record<string, string>
	showAlert: UseAlertModalType['showAlert']
}

const VariationCustomOptions: React.FC<VariationCustomOptionsProps> = ({
	formData,
	setFormData,
	groupIndex,
	group,
	errors,
	showAlert,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireEditMenuItemStyles(colors, responsive)

	const handleAddVariationOption = (groupIndex: number) => {
		const newOption: VariationOptionInput = {
			name: '',
			priceAdjustment: '0',
			availability: true,
			isDefault: false,
			position: formData.variationGroups[groupIndex].options.length,
		}
		setFormData((prev) => ({
			...prev,
			variationGroups: prev.variationGroups.map((group, i) =>
				i === groupIndex
					? { ...group, options: [...group.options, newOption] }
					: group
			),
		}))
	}

	const handleRemoveVariationOption = (
		groupIndex: number,
		optionIndex: number
	) => {
		setFormData((prev) => ({
			...prev,
			variationGroups: prev.variationGroups.map((group, i) =>
				i === groupIndex
					? {
							...group,
							options: group.options.filter((_, j) => j !== optionIndex),
					  }
					: group
			),
		}))
	}

	const handleUpdateVariationOption = (
		groupIndex: number,
		optionIndex: number,
		field: keyof VariationOptionInput,
		value: any
	) => {
		setFormData((prev) => ({
			...prev,
			variationGroups: prev.variationGroups.map((group, i) =>
				i === groupIndex
					? {
							...group,
							options: group.options.map((option, j) =>
								j === optionIndex ? { ...option, [field]: value } : option
							),
					  }
					: group
			),
		}))
	}

	return (
		<>
			<View style={styles.modeSelectionHeader}>
				<Text style={styles.labelSmallFlex}>Options:</Text>
				<TouchableOpacity
					style={styles.helpButton}
					onPress={() =>
						showAlert({
							title: 'Options Help',
							message:
								'Options: name of option and additional price of the option',
						})
					}>
					<Text style={styles.helpButtonText}>?</Text>
				</TouchableOpacity>
			</View>
			{group.options.map((option, optionIndex) => (
				<React.Fragment key={optionIndex}>
					<View style={styles.variationOptionRow}>
						<TextInput
							style={[styles.categoryInput, styles.variationOptionNameInput]}
							value={option.name}
							onChangeText={(text) =>
								handleUpdateVariationOption(
									groupIndex,
									optionIndex,
									'name',
									text
								)
							}
							placeholder="Option name"
							placeholderTextColor={colors.textSecondary}
						/>
						<View style={styles.variationOptionPriceContainer}>
							<Text style={styles.variationOptionPriceSymbol}>₱</Text>
							<TextInput
								style={[styles.categoryInput, styles.variationOptionPriceInput]}
								value={option.priceAdjustment}
								onChangeText={(text) =>
									handleUpdateVariationOption(
										groupIndex,
										optionIndex,
										'priceAdjustment',
										text
									)
								}
								placeholder="0.00"
								placeholderTextColor={colors.textSecondary}
								keyboardType="decimal-pad"
							/>
						</View>
						<TouchableOpacity
							onPress={() =>
								handleRemoveVariationOption(groupIndex, optionIndex)
							}>
							<Ionicons
								name="close-circle"
								size={20}
								color="#ef4444"
							/>
						</TouchableOpacity>
					</View>
					{errors[`variation-${groupIndex}-option-${optionIndex}`] && (
						<Text style={styles.errorTextMarginBottom}>
							{errors[`variation-${groupIndex}-option-${optionIndex}`]}
						</Text>
					)}
				</React.Fragment>
			))}
			{errors[`variation-${groupIndex}-options`] && (
				<Text style={styles.errorTextMarginBottom}>
					{errors[`variation-${groupIndex}-options`]}
				</Text>
			)}
			<TouchableOpacity
				style={[styles.addCategoryButton, styles.variationAddButtonInline]}
				onPress={() => handleAddVariationOption(groupIndex)}>
				<Ionicons
					name="add-circle-outline"
					size={16}
					color={colors.primary}
				/>
				<Text style={styles.addCategoryButtonText}>Add Option</Text>
			</TouchableOpacity>
		</>
	)
}

export default VariationCustomOptions
