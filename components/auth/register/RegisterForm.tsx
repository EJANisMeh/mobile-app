import React from 'react'
import {
	View,
	StyleProp,
} from 'react-native'

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
}

const RegisterForm: React.FC<RegisterFormProps> = ({
	formData,
	setFormData,
	colors,
	registerStyles,
	showAlert,
}) => {
	const updateField = (field: keyof RegisterData, value: string) => {
		setFormData((prev: RegisterData) => ({ ...prev, [field]: value }))
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
