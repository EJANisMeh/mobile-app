import React from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createConcessionaireAddMenuItemStyles } from '../../../../../styles/concessionaire/addMenuItem'
import { VariationGroupInput } from '../../../../../types/menuItemTypes'
import { UseAlertModalType } from '../../../../../hooks/useModals/types'

interface VariationMultiLimitProps {
	groupIndex: number
	group: VariationGroupInput
	errors: Record<string, string>
	setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
	showAlert: UseAlertModalType['showAlert']
	handleUpdateVariationGroup: (
		index: number,
		field: keyof VariationGroupInput,
		value: any
	) => void
}

const VariationMultiLimit: React.FC<VariationMultiLimitProps> = ({
	groupIndex,
	group,
	errors,
	setErrors,
	showAlert,
	handleUpdateVariationGroup,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireAddMenuItemStyles(colors, responsive)

	return (
		<>
			<View style={styles.multiLimitOuter}>
				<View style={styles.multiLimitRow}>
					<Text style={styles.multiLimitLabel}>Limit</Text>
					<TouchableOpacity
						style={styles.helpButton}
						onPress={() =>
							showAlert({
								title: 'Limit Help',
								message:
									'Limit: refers to up to how many choices user is required to enter.',
							})
						}>
						<Text style={styles.helpButtonText}>?</Text>
					</TouchableOpacity>
				</View>
				<TextInput
					style={styles.categoryInput}
					value={group.multiLimit?.toString() || ''}
					onChangeText={(text) => {
						const num = text.trim() === '' ? null : parseInt(text, 10)
						handleUpdateVariationGroup(groupIndex, 'multiLimit', num)
						// clear error if any
						setErrors((prev) => ({
							...prev,
							[`variation-${groupIndex}-multiLimit`]: '',
						}))
					}}
					placeholder="Max choices"
					keyboardType="number-pad"
					placeholderTextColor={colors.textSecondary}
				/>
				{errors[`variation-${groupIndex}-multiLimit`] && (
					<Text style={styles.errorText}>
						{errors[`variation-${groupIndex}-multiLimit`]}
					</Text>
				)}
			</View>
		</>
	)
}

export default VariationMultiLimit
