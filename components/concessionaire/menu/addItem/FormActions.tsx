import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionaireAddMenuItemStyles } from '../../../../styles/concessionaire/addMenuItem'

interface FormActionsProps {
	isFormValid: boolean
	isValidating: boolean
	handleSave: () => void
	handleCancel: () => void
}

const FormActions: React.FC<FormActionsProps> = ({
	isFormValid,
	isValidating,
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
				onPress={handleCancel}
				disabled={isValidating}>
				<Text style={styles.cancelButtonText}>Cancel</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[
					styles.saveButton,
					(!isFormValid || isValidating) && styles.saveButtonDisabled,
				]}
				onPress={handleSave}
				disabled={!isFormValid || isValidating}>
				{isValidating ? (
					<ActivityIndicator color={colors.text} />
				) : (
					<Text style={styles.saveButtonText}>Add Item</Text>
				)}
			</TouchableOpacity>
		</>
	)
}

export default FormActions
