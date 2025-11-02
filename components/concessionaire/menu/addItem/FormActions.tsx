import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionaireAddMenuItemStyles } from '../../../../styles/concessionaire/addMenuItem'

interface FormActionsProps {
	isFormValid: boolean
	handleSave: () => void
	handleCancel: () => void
}

const FormActions: React.FC<FormActionsProps> = ({
	isFormValid,
	handleSave,
	handleCancel,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireAddMenuItemStyles(colors, responsive)

	return (
		<>
			<TouchableOpacity
				style={styles.cancelButton}
				onPress={handleCancel}>
				<Text style={styles.cancelButtonText}>Cancel</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.saveButton, !isFormValid && styles.saveButtonDisabled]}
				onPress={handleSave}
				disabled={!isFormValid}>
				<Text style={styles.saveButtonText}>Add Item</Text>
			</TouchableOpacity>
		</>
	)
}

export default FormActions
