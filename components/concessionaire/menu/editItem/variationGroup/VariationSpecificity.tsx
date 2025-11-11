import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createConcessionaireEditMenuItemStyles } from '../../../../../styles/concessionaire/editMenuItem'
import { VariationGroupInput } from '../../../../../types/menuItemTypes'
import { UseAlertModalType } from '../../../../../hooks/useModals/types'

interface VariationSpecificityProps {
	groupIndex: number
	group: VariationGroupInput
	showAlert: UseAlertModalType['showAlert']
	handleUpdateVariationGroup: (
		index: number,
		field: keyof VariationGroupInput,
		value: any
	) => void
}

const VariationSpecificity: React.FC<VariationSpecificityProps> = ({
	groupIndex,
	group,
	showAlert,
	handleUpdateVariationGroup,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireEditMenuItemStyles(colors, responsive)

	const handleToggle = () => {
		handleUpdateVariationGroup(groupIndex, 'specificity', !group.specificity)
	}

	return (
		<View style={styles.specificityContainer}>
			<Text style={styles.specificityLabel}>Specificity:</Text>
			<View style={styles.specificityRow}>
				<TouchableOpacity
					onPress={handleToggle}
					style={[
						styles.specificityToggle,
						group.specificity && styles.specificityToggleActive,
					]}>
					<Text
						style={[
							styles.specificityToggleText,
							group.specificity && styles.specificityToggleTextActive,
						]}>
						{group.specificity ? 'Enabled' : 'Disabled'}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.helpButton}
					onPress={() =>
						showAlert({
							title: 'Specificity Help',
							message:
								'When enabled, this variation group will NOT be shown when this menu item is used as a variation option in another item.\n\nExample: If this item has "Spiciness" and "Size" variations, but you only want "Spiciness" to appear when this item is selected in another variation group, enable specificity for the "Size" variation.',
						})
					}>
					<Text style={styles.helpButtonText}>?</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default VariationSpecificity
