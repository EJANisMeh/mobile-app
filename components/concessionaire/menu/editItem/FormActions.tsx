import React from 'react'
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionaireEditMenuItemStyles } from '../../../../styles/concessionaire'

interface FormActionsProps {
	isFormValid: boolean
	hasChanges: boolean
	isValidating: boolean
	handleSave: () => void
	handleCancel: () => void
}

const FormActions: React.FC<FormActionsProps> = ({
	isFormValid,
	hasChanges,
	isValidating,
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
				onPress={handleCancel}
				disabled={isValidating}>
				<Text style={styles.cancelButtonText}>Cancel</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[
					styles.saveButton,
					(!isFormValid || !hasChanges || isValidating) &&
						styles.saveButtonDisabled,
				]}
				onPress={handleSave}
				disabled={!isFormValid || !hasChanges || isValidating}>
				{isValidating ? (
					<ActivityIndicator color={colors.text} />
				) : (
					<Text style={styles.saveButtonText}>Save Changes</Text>
				)}
			</TouchableOpacity>
		</View>
	)
}

export default FormActions
