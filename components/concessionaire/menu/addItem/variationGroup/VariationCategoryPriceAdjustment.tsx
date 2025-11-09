import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createConcessionaireAddMenuItemStyles } from '../../../../../styles/concessionaire/addMenuItem'
import { VariationGroupInput } from '../../../../../types/menuItemTypes'
import { UseAlertModalType } from '../../../../../hooks/useModals/useAlertModal'

interface VariationCategoryPriceAdjustmentProps {
	group: VariationGroupInput
	groupIndex: number
	showAlert: UseAlertModalType['showAlert']
	handleUpdateVariationGroup: (
		index: number,
		field: keyof VariationGroupInput,
		value: any
	) => void
}

const VariationCategoryPriceAdjustment: React.FC<
	VariationCategoryPriceAdjustmentProps
> = ({ group, groupIndex, showAlert, handleUpdateVariationGroup }) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireAddMenuItemStyles(colors, responsive)

	return (
		<View style={styles.multiLimitOuter}>
			<View style={styles.multiLimitRow}>
				<Text style={styles.multiLimitLabel}>Price Adjustment</Text>
				<TouchableOpacity
					style={styles.helpButton}
					onPress={() =>
						showAlert({
							title: 'Price Adjustment Help',
							message:
								'Set a price adjustment for items in this category.\n\nPositive values (+) add to the item price.\nNegative values (-) reduce the item price.\n\nExample: -20 makes a ₱100 item cost ₱80\n\nLeave empty for no adjustment.',
						})
					}>
					<Text style={styles.helpButtonText}>?</Text>
				</TouchableOpacity>
			</View>
			<TextInput
				style={styles.categoryInput}
				value={group.categoryPriceAdjustment?.toString() || ''}
				onChangeText={(text) => {
					const trimmed = text.trim()
					if (trimmed === '' || trimmed === '-') {
						handleUpdateVariationGroup(
							groupIndex,
							'categoryPriceAdjustment',
							trimmed === '' ? null : trimmed
						)
						return
					}
					const num = parseFloat(trimmed)
					if (!isNaN(num)) {
						handleUpdateVariationGroup(
							groupIndex,
							'categoryPriceAdjustment',
							trimmed
						)
					}
				}}
				placeholder="0 (optional)"
				keyboardType="numeric"
				placeholderTextColor={colors.textSecondary}
			/>
		</View>
	)
}

export default VariationCategoryPriceAdjustment
