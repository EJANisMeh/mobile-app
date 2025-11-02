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
			<View style={styles.modeSelectionHeader}>
				<Text style={styles.labelSmallFlex}>Mode:</Text>
				<TouchableOpacity
					style={styles.helpButton}
					onPress={() =>
						showAlert({
							title: 'Mode Help',
							message:
								'Custom: options specific to this menu item.\n\nCategory: include all menu items in a specified category.\n\nExisting Items: include individual existing items as options.',
						})
					}>
					<Text style={styles.helpButtonText}>?</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.modeButtonsContainer}>
				{(['custom', 'category', 'existing'] as const).map((mode) => (
					<TouchableOpacity
						key={mode}
						onPress={() => handleUpdateVariationGroup(groupIndex, 'mode', mode)}
						style={[
							styles.modeButton,
							group.mode === mode
								? styles.modeButtonActive
								: styles.modeButtonInactive,
						]}>
						<Text
							style={[
								styles.modeButtonText,
								group.mode === mode
									? styles.modeButtonTextActive
									: styles.modeButtonTextInactive,
							]}>
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
