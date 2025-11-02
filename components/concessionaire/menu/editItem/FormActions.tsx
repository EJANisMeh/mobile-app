import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionaireEditMenuItemStyles } from '../../../../styles/concessionaire'

interface FormActionsProps {
	isFormValid: boolean
	hasChanges: boolean
	handleSave: () => void
	handleCancel: () => void
}

const FormActions: React.FC<FormActionsProps> = ({
	isFormValid,
	hasChanges,
	handleSave,
	handleCancel,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireEditMenuItemStyles(colors, responsive)

	return (
		<View style={styles.bottomActions}>
			<TouchableOpacity
				style={styles.cancelButton}
				onPress={handleCancel}>
				<Text style={styles.cancelButtonText}>Cancel</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[
					styles.saveButton,
					(!isFormValid || !hasChanges) && styles.saveButtonDisabled,
				]}
				onPress={handleSave}
				disabled={!isFormValid || !hasChanges}>
				<Text style={styles.saveButtonText}>Save Changes</Text>
			</TouchableOpacity>
		</View>
	)
}

export default FormActions
