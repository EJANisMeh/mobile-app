import React from 'react'
import { View } from 'react-native'

import { RegisterData } from '../../../types'
import { UseAlertModalProps } from '../../../hooks/useModals/types'
import RegisterInputs from './RegisterInputs'
import RegisterButton from './RegisterButton'
import { createRegisterStyles } from '../../../styles/auth'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'

interface RegisterFormProps {
	formData: RegisterData
	setFormData: React.Dispatch<React.SetStateAction<RegisterData>>
	showAlert: (opts: UseAlertModalProps) => void
	setEdited: React.Dispatch<React.SetStateAction<boolean>>
}

const RegisterForm: React.FC<RegisterFormProps> = ({
	formData,
	setFormData,
	showAlert,
	setEdited,
}) =>
{
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const registerStyles = createRegisterStyles(colors, responsive)

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
				updateField={updateField}
			/>

			<RegisterButton
				formData={formData}
				showAlert={showAlert}
			/>
		</View>
	)
}

export default RegisterForm
