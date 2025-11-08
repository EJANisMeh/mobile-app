import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createConcessionaireAddMenuItemStyles } from '../../../../../styles/concessionaire/addMenuItem'
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
	const styles = createConcessionaireAddMenuItemStyles(colors, responsive)

	return (
		<>
			<View style={styles.modeSelectionHeader}>
				<Text style={styles.modeSelectionLabel}>Mode:</Text>
				<TouchableOpacity
					style={styles.helpButton}
					onPress={() =>
						showAlert({
							title: 'Mode Help',
							message:
								'Custom: options specific to this menu item.\n\nSingle Category: include all menu items from one category.\n\nMulti Category: include menu items from multiple categories with a category selector.\n\nExisting Items: include individual existing items as options.',
						})
					}>
					<Text style={styles.helpButtonText}>?</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.modeButtonsContainer}>
				{(
					['custom', 'single-category', 'multi-category', 'existing'] as const
				).map((mode) => (
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
								: mode === 'single-category'
								? 'Single Category'
								: mode === 'multi-category'
								? 'Multi Category'
								: 'Existing Items'}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</>
	)
}

export default VariationModeSelection
