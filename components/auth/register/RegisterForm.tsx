import React from 'react'
import { View, StyleProp } from 'react-native'

import { RegisterData } from '../../../types'
import { UseAlertModalProps } from '../../../hooks/useModals/types'
import RegisterInputs from './RegisterInputs'
import RegisterButton from './RegisterButton'

interface RegisterFormProps {
	formData: RegisterData
	setFormData: React.Dispatch<React.SetStateAction<RegisterData>>
	colors: { textOnPrimary: string }
	registerStyles: Record<string, StyleProp<any>>
	showAlert: (opts: UseAlertModalProps) => void
	setEdited: React.Dispatch<React.SetStateAction<boolean>>
}

const RegisterForm: React.FC<RegisterFormProps> = ({
	formData,
	setFormData,
	colors,
	registerStyles,
	showAlert,
	setEdited,
}) => {
	const updateField = (field: keyof RegisterData, value: string) => {
		setFormData((prev: RegisterData) => {
			// Create the updated form data
			const updated = { ...prev, [field]: value }

			// Check if any field is non-empty AFTER the update
			const hasEditedFields =
				updated.email.trim() !== '' ||
				updated.password.trim() !== '' ||
				updated.confirmPassword.trim() !== ''

			setEdited(hasEditedFields)

			return updated
		})
	}

	return (
		<View style={registerStyles.form}>
			<RegisterInputs
				formData={formData}
				inputStyle={registerStyles.input}
				updateField={updateField}
			/>

			<RegisterButton
				formData={formData}
				colors={colors}
				buttonStyles={registerStyles}
				showAlert={showAlert}
			/>
		</View>
	)
}

export default RegisterForm
