import React, { Dispatch, SetStateAction } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../../styles/customer'
import {
	VariationSelection,
	VariationOptionSelection,
} from '../../../../../types'
import { getCustomOptionStatusText } from '../../../../../utils'

interface VariationGroupCustomProps {
	group: any
	selection: VariationSelection
	setVariationSelections: Dispatch<
		SetStateAction<Map<number, VariationSelection>>
	>
}

const VariationGroupCustom: React.FC<VariationGroupCustomProps> = ({
	group,
	selection,
	setVariationSelections,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)

	const isSingleType =
		selection.selectionTypeCode === 'single_required' ||
		selection.selectionTypeCode === 'single_optional'
	const isRequired =
		selection.selectionTypeCode === 'single_required' ||
		selection.selectionTypeCode === 'multi_required'
	const multiLimit = selection.multiLimit || 0

	// Use imported utility function for consistent status text

	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price
		if (numPrice === 0) return ''
		return numPrice > 0
			? `+₱${numPrice.toFixed(2)}`
			: `-₱${Math.abs(numPrice).toFixed(2)}`
	}

	const isOptionSelected = (optionId: number): boolean => {
		return selection.selectedOptions.some((opt) => opt.optionId === optionId)
	}

	const handleOptionToggle = (option: any) => {
		setVariationSelections((prev) => {
			const newMap = new Map(prev)
			const currentSelection = newMap.get(group.id)

			if (!currentSelection) return prev

			const isSelected = isOptionSelected(option.id)

			if (isSingleType) {
				// Single selection: Replace selection or clear if same option
				if (isSelected && selection.selectionTypeCode === 'single_optional') {
					// Clear selection for optional single
					currentSelection.selectedOptions = []
				} else {
					// Set new selection (simple, no subvariations for custom mode)
					const newOption: VariationOptionSelection = {
						optionId: option.id,
						optionName: option.name,
						priceAdjustment: parseFloat(option.price_adjustment || 0),
					}
					currentSelection.selectedOptions = [newOption]
				}
			} else {
				// Multi selection: Toggle checkbox with limit enforcement
				if (isSelected) {
					// Remove option
					currentSelection.selectedOptions =
						currentSelection.selectedOptions.filter(
							(opt) => opt.optionId !== option.id
						)
				} else {
					// Check limit before adding
					if (
						multiLimit > 0 &&
						currentSelection.selectedOptions.length >= multiLimit
					) {
						// Limit reached, don't add
						return prev
					}

					// Add option (simple, no subvariations for custom mode)
					const newOption: VariationOptionSelection = {
						optionId: option.id,
						optionName: option.name,
						priceAdjustment: parseFloat(option.price_adjustment || 0),
					}

					currentSelection.selectedOptions = [
						...currentSelection.selectedOptions,
						newOption,
					]
				}
			}

			newMap.set(group.id, currentSelection)
			return newMap
		})
	}

	const canSelectMore = (): boolean => {
		if (isSingleType) return true
		if (multiLimit === 0) return true // Unlimited
		return selection.selectedOptions.length < multiLimit
	}

	const renderSelectionIndicator = (option: any) => {
		const isSelected = isOptionSelected(option.id)

		if (isSingleType) {
			// Radio button
			return (
				<View style={styles.radioButton}>
					{isSelected && <View style={styles.radioButtonInner} />}
				</View>
			)
		} else {
			// Checkbox
			const isDisabled = !isSelected && !canSelectMore()
			return (
				<View
					style={[
						styles.checkbox,
						isDisabled && styles.checkboxDisabled,
						isSelected && styles.checkboxChecked,
					]}>
					{isSelected && <Text style={styles.checkboxCheck}>✓</Text>}
				</View>
			)
		}
	}

	return (
		<View style={styles.variationGroup}>
			<View style={styles.variationGroupHeader}>
				<Text style={styles.variationGroupName}>{group.name}</Text>
				{isRequired && <Text style={styles.requiredBadge}>Required</Text>}
				{!isSingleType && multiLimit > 0 && (
					<Text style={styles.multiLimitText}>(Select up to {multiLimit})</Text>
				)}
			</View>

			<View style={styles.optionsList}>
				{group.menu_item_variation_option_choices?.map((option: any) => {
					const isSelected = isOptionSelected(option.id)
					const isDisabled = !isSingleType && !isSelected && !canSelectMore()
					const statusText = getCustomOptionStatusText(option)

					return (
						<TouchableOpacity
							key={option.id}
							style={[
								styles.optionItemButton,
								isSelected && styles.optionItemSelected,
								isDisabled && styles.optionItemDisabled,
							]}
							onPress={() => handleOptionToggle(option)}
							disabled={isDisabled}>
							{renderSelectionIndicator(option)}
							<View style={styles.optionContent}>
								<View style={styles.optionNameWrapper}>
									<Text
										style={[
											styles.optionName,
											isDisabled && styles.optionNameDisabled,
										]}>
										{option.name}
									</Text>
									{statusText && (
										<Text style={styles.outOfStockText}>{statusText}</Text>
									)}
								</View>
								{option.price_adjustment !== 0 && (
									<Text style={styles.optionPrice}>
										{formatPrice(option.price_adjustment)}
									</Text>
								)}
							</View>
						</TouchableOpacity>
					)
				})}
			</View>
		</View>
	)
}

export default VariationGroupCustom
