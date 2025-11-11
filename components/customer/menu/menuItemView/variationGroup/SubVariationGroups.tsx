import React, { Dispatch, SetStateAction, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../../styles/customer'
import { VariationSelection } from '../../../../../types'

interface SubVariationGroup {
	id: number
	name: string
	selection_type_id: number
	multi_limit: number | null
	kind: string
	specificity: boolean
	position: number
	selection_types?: {
		code: string
	}
	menu_item_variation_option_choices?: Array<{
		id: number
		name: string
		price_adjustment: number | string
		availability: boolean
		is_default: boolean
		position: number
	}>
}

interface SubVariationGroupsProps {
	menuItemId: number
	menuItemName: string
	subVariationGroups: SubVariationGroup[]
	subVariationSelections: Map<number, VariationSelection>
	setSubVariationSelections: Dispatch<
		SetStateAction<Map<number, VariationSelection>>
	>
}

const SubVariationGroups: React.FC<SubVariationGroupsProps> = ({
	menuItemId,
	menuItemName,
	subVariationGroups,
	subVariationSelections,
	setSubVariationSelections,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)

	const [expanded, setExpanded] = useState(false)

	console.log(
		`🎨 [SubVariationGroups] Component rendered for menu item ${menuItemId} (${menuItemName}):`
	)
	console.log(
		`  - subVariationGroups count: ${subVariationGroups?.length || 0}`
	)
	console.log(
		`  - subVariationSelections Map size: ${subVariationSelections?.size || 0}`
	)
	console.log(`  - expanded: ${expanded}`)

	if (subVariationGroups && subVariationGroups.length > 0) {
		console.log(
			`  - Subvariation groups:`,
			subVariationGroups.map((g) => ({
				id: g.id,
				name: g.name,
				kind: g.kind,
				specificity: g.specificity,
				optionsCount: g.menu_item_variation_option_choices?.length || 0,
			}))
		)
	}

	if (!subVariationGroups || subVariationGroups.length === 0) {
		console.log(`  ⚠️ Returning null - no subVariationGroups`)
		return null
	}

	const handleSubOptionToggle = (
		groupId: number,
		option: any,
		isSingleType: boolean,
		isOptional: boolean,
		multiLimit: number
	) => {
		setSubVariationSelections((prev) => {
			const newMap = new Map(prev)
			const currentSelection = newMap.get(groupId)

			if (!currentSelection) return prev

			const isSelected = currentSelection.selectedOptions.some(
				(opt) => opt.optionId === option.id
			)

			const priceAdjustment =
				typeof option.price_adjustment === 'string'
					? parseFloat(option.price_adjustment)
					: option.price_adjustment

			if (isSingleType) {
				// Single selection
				if (isSelected && isOptional) {
					currentSelection.selectedOptions = []
				} else {
					currentSelection.selectedOptions = [
						{
							optionId: option.id,
							optionName: option.name,
							priceAdjustment: priceAdjustment,
						},
					]
				}
			} else {
				// Multi selection
				if (isSelected) {
					currentSelection.selectedOptions =
						currentSelection.selectedOptions.filter(
							(opt) => opt.optionId !== option.id
						)
				} else {
					if (
						multiLimit > 0 &&
						currentSelection.selectedOptions.length >= multiLimit
					) {
						return prev
					}
					currentSelection.selectedOptions = [
						...currentSelection.selectedOptions,
						{
							optionId: option.id,
							optionName: option.name,
							priceAdjustment: priceAdjustment,
						},
					]
				}
			}

			newMap.set(groupId, currentSelection)
			return newMap
		})
	}

	const renderSubVariationGroup = (group: SubVariationGroup) => {
		console.log(
			`  📦 [SubVariationGroups] Rendering subvariation group ${group.id} (${group.name}):`
		)

		const selectionTypeCode = group.selection_types?.code || 'single_required'
		const isSingleType =
			selectionTypeCode === 'single_required' ||
			selectionTypeCode === 'single_optional'
		const isRequired =
			selectionTypeCode === 'single_required' ||
			selectionTypeCode === 'multi_required'
		const isOptional = selectionTypeCode === 'single_optional'
		const multiLimit = group.multi_limit || 0

		console.log(`    - selectionTypeCode: ${selectionTypeCode}`)
		console.log(
			`    - isSingleType: ${isSingleType}, isRequired: ${isRequired}`
		)
		console.log(`    - multiLimit: ${multiLimit}`)

		const selection = subVariationSelections.get(group.id)
		const options = group.menu_item_variation_option_choices || []

		console.log(`    - Has selection in Map: ${!!selection}`)
		console.log(`    - Options count: ${options.length}`)
		if (options.length > 0) {
			console.log(`    - Sample option:`, {
				id: options[0].id,
				name: options[0].name,
				price_adjustment: options[0].price_adjustment,
				availability: options[0].availability,
			})
		}

		const formatPrice = (price: number | string) => {
			const numPrice = typeof price === 'string' ? parseFloat(price) : price
			if (numPrice === 0 || !Number.isFinite(numPrice)) return ''
			const displayPrice =
				numPrice > 0 ? `+₱${numPrice.toFixed(2)}` : `₱${numPrice.toFixed(2)}`
			return displayPrice
		}

		const renderSelectionIndicator = (optionId: number) => {
			const isSelected = selection?.selectedOptions.some(
				(opt) => opt.optionId === optionId
			)

			if (isSingleType) {
				return (
					<View style={styles.radioButton}>
						{isSelected && <View style={styles.radioButtonInner} />}
					</View>
				)
			} else {
				const canSelect =
					isSelected ||
					multiLimit === 0 ||
					(selection?.selectedOptions.length || 0) < multiLimit
				return (
					<View
						style={[
							styles.checkbox,
							!canSelect && styles.checkboxDisabled,
							isSelected && styles.checkboxChecked,
						]}>
						{isSelected && <Text style={styles.checkboxCheck}>✓</Text>}
					</View>
				)
			}
		}

		return (
			<View
				key={group.id}
				style={styles.variationGroup}>
				<View style={styles.variationGroupHeader}>
					<Text style={styles.variationGroupName}>{group.name}</Text>
					{isRequired && <Text style={styles.requiredBadge}>Required</Text>}
					{!isSingleType && multiLimit > 0 && (
						<Text style={styles.multiLimitText}>
							(Select up to {multiLimit})
						</Text>
					)}
				</View>

				<View style={styles.optionsList}>
					{options.map((option) => {
						const isSelected = selection?.selectedOptions.some(
							(opt) => opt.optionId === option.id
						)
						const isOutOfStock = !option.availability
						const isDisabled =
							!isSingleType &&
							!isSelected &&
							multiLimit > 0 &&
							(selection?.selectedOptions.length || 0) >= multiLimit

						return (
							<TouchableOpacity
								key={option.id}
								style={[
									styles.optionItemButton,
									isSelected && styles.optionItemSelected,
									isDisabled && styles.optionItemDisabled,
								]}
								onPress={() =>
									handleSubOptionToggle(
										group.id,
										option,
										isSingleType,
										isOptional,
										multiLimit
									)
								}
								disabled={isDisabled}>
								{renderSelectionIndicator(option.id)}
								<View style={styles.optionContent}>
									<View style={styles.optionNameWrapper}>
										<Text
											style={[
												styles.optionName,
												isOutOfStock && styles.optionNameDisabled,
											]}>
											{option.name}
										</Text>
										{isOutOfStock && (
											<Text style={styles.outOfStockText}>Out of stock</Text>
										)}
									</View>
									<Text style={styles.optionPrice}>
										{formatPrice(option.price_adjustment)}
									</Text>
								</View>
							</TouchableOpacity>
						)
					})}
				</View>
			</View>
		)
	}

	console.log(
		`  🎯 [SubVariationGroups] About to render toggle header (expanded: ${expanded})`
	)

	return (
		<View style={styles.variationsContainer}>
			<TouchableOpacity
				style={styles.variationGroupHeader}
				onPress={() => {
					const newExpanded = !expanded
					console.log(
						`  🔄 [SubVariationGroups] Toggling expanded state: ${expanded} → ${newExpanded}`
					)
					setExpanded(newExpanded)
				}}>
				<Ionicons
					name={expanded ? 'chevron-down' : 'chevron-forward'}
					size={responsive.getResponsiveValue(20, 24)}
					color={colors.text}
				/>
				<Text style={styles.variationGroupName}>
					Customize {menuItemName} ({subVariationGroups.length}{' '}
					{subVariationGroups.length === 1 ? 'option' : 'options'})
				</Text>
			</TouchableOpacity>

			{expanded ? (
				<>
					{console.log(
						`  📋 [SubVariationGroups] Expanded view - rendering ${subVariationGroups.length} groups`
					)}
					<View style={styles.optionsList}>
						{subVariationGroups.map(renderSubVariationGroup)}
					</View>
				</>
			) : null}
		</View>
	)
}

export default SubVariationGroups
