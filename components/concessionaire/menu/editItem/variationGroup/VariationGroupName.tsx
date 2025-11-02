import React from 'react'
import { View, TextInput, Text } from 'react-native'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createConcessionaireEditMenuItemStyles } from '../../../../../styles/concessionaire'
import { VariationGroupInput } from '../../../../../types/menuItemTypes'

interface VariationGroupNameProps {
	group: VariationGroupInput
	groupIndex: number
	errors: Record<string, string>
	handleUpdateVariationGroup: (
		index: number,
		field: keyof VariationGroupInput,
		value: any
	) => void
}

const VariationGroupName: React.FC<VariationGroupNameProps> = ({
	group,
	groupIndex,
	errors,
	handleUpdateVariationGroup,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireEditMenuItemStyles(colors, responsive)

	return (
		<>
			<View
				style={[
					styles.categoryInputContainer,
					{ marginBottom: 8, borderWidth: 1, borderColor: colors.border },
				]}>
				<TextInput
					style={styles.categoryInput}
					value={group.name}
					onChangeText={(text) =>
						handleUpdateVariationGroup(groupIndex, 'name', text)
					}
					placeholder="Group name (e.g., Size, Toppings)"
					placeholderTextColor={colors.textSecondary}
				/>
			</View>
			{errors[`variation-${groupIndex}-name`] && (
				<Text style={{ color: '#ef4444', marginBottom: 8 }}>
					{errors[`variation-${groupIndex}-name`]}
				</Text>
			)}
		</>
	)
}

export default VariationGroupName
