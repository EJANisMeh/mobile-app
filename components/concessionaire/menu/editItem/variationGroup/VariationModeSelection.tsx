import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createConcessionaireEditMenuItemStyles } from '../../../../../styles/concessionaire'
import { VariationGroupInput } from '../../../../../types/menuItemTypes'
import { UseAlertModalType } from '../../../../../hooks/useModals/types'

interface VariationModeSelectionProps {
	groupIndex: number
	group: VariationGroupInput
	showAlert: UseAlertModalType['showAlert']
	handleUpdateVariationGroup: (
		index: number,
		field: keyof VariationGroupInput,
		value: any
	) => void
}

const VariationModeSelection: React.FC<VariationModeSelectionProps> = ({
	groupIndex,
	group,
	showAlert,
	handleUpdateVariationGroup,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireEditMenuItemStyles(colors, responsive)

	return (
		<>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginBottom: 4,
				}}>
				<Text style={{ fontSize: 12, color: colors.text, flex: 1 }}>Mode:</Text>
				<TouchableOpacity
					style={{ padding: 6 }}
					onPress={() =>
						showAlert({
							title: 'Mode Help',
							message:
								'Custom: options specific to this menu item.\n\nCategory: include all menu items in a specified category.\n\nExisting Items: include individual existing items as options.',
						})
					}>
					<Text style={{ color: colors.primary, fontWeight: '600' }}>?</Text>
				</TouchableOpacity>
			</View>
			<View
				style={{
					flexDirection: 'row',
					gap: 8,
					marginBottom: 8,
					flexWrap: 'wrap',
				}}>
				{(['custom', 'category', 'existing'] as const).map((mode) => (
					<TouchableOpacity
						key={mode}
						onPress={() => handleUpdateVariationGroup(groupIndex, 'mode', mode)}
						style={{
							paddingVertical: 6,
							paddingHorizontal: 12,
							borderRadius: 6,
							backgroundColor:
								group.mode === mode ? colors.primary : colors.background,
							borderWidth: 1,
							borderColor: colors.border,
						}}>
						<Text
							style={{
								fontSize: 12,
								color: group.mode === mode ? '#fff' : colors.text,
								fontWeight: group.mode === mode ? '600' : '400',
							}}>
							{mode === 'custom'
								? 'Custom'
								: mode === 'category'
								? 'Category'
								: 'Existing Items'}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</>
	)
}

export default VariationModeSelection
