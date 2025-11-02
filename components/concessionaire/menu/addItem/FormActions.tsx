import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionaireAddMenuItemStyles } from '../../../../styles/concessionaire/addMenuItem'

interface FormActionsProps
{
	hasErrors: boolean
	handleSave: () => void
	handleCancel: () => void
}

const FormActions: React.FC<FormActionsProps> = ({
	hasErrors,
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
				style={[styles.saveButton, hasErrors && styles.saveButtonDisabled]}
				onPress={handleSave}
				disabled={hasErrors}>
				<Text style={styles.saveButtonText}>Add Item</Text>
			</TouchableOpacity>
		</>
	)
}

export default FormActions
