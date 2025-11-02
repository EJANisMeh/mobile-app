import React from 'react'
import { View, TextInput, Text } from 'react-native'
import { useThemeContext } from '../../../../../context'
import { createConcessionaireAddMenuItemStyles } from '../../../../../styles/concessionaire/addMenuItem'
import { useResponsiveDimensions } from '../../../../../hooks'
import {
  VariationGroupInput,
} from '../../../../../types/menuItemTypes'

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
  const styles = createConcessionaireAddMenuItemStyles(colors, responsive)

	return (
		<>
			<View
				style={[
					styles.variationGroupNameInputContainer,
					styles.variationGroupNameInput,
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
				<Text style={styles.errorText}>
					{errors[`variation-${groupIndex}-name`]}
				</Text>
			)}
		</>
	)
}

export default VariationGroupName
