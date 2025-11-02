import React from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createConcessionaireEditMenuItemStyles } from '../../../../../styles/concessionaire'
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
	const styles = createConcessionaireEditMenuItemStyles(colors, responsive)

	return (
		<>
			<View style={{ marginBottom: 8 }}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginBottom: 4,
					}}>
					<Text style={{ fontSize: 12, color: colors.text, flex: 1 }}>
						Limit
					</Text>
					<TouchableOpacity
						style={{ padding: 6 }}
						onPress={() =>
							showAlert({
								title: 'Limit Help',
								message:
									'Limit: refers to up to how many choices user is required to enter.',
							})
						}>
						<Text style={{ color: colors.primary, fontWeight: '600' }}>?</Text>
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
					<Text style={{ color: '#ef4444', marginTop: 4 }}>
						{errors[`variation-${groupIndex}-multiLimit`]}
					</Text>
				)}
			</View>
		</>
	)
}

export default VariationMultiLimit
