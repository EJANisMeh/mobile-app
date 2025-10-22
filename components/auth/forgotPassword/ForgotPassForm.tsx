import React from 'react'
import { View, Text, TouchableOpacity, StyleProp } from 'react-native'
import ForgotPassEmailInput from './ForgotPassEmailInput'
import RequestPassResetButton from './RequestPassResetButton'
import BackToLoginButton from './BackToLoginButton'
import { UseAlertModalType } from '../../../hooks/useModals/useAlertModal'
import { createForgotPasswordStyles } from '../../../styles/auth'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'

interface ForgotPasswordFormProps {
	email: string
	setEmail: (email: string) => void
	showAlert: UseAlertModalType['showAlert']
	hideAlert: UseAlertModalType['hideAlert']
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
	email,
	setEmail,
	showAlert,
	hideAlert,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const forgotPasswordStyles = createForgotPasswordStyles(colors, responsive)

	return (
		<View style={forgotPasswordStyles.form}>
			<ForgotPassEmailInput
				email={email}
				setEmail={setEmail}
			/>

			<RequestPassResetButton
				email={email}
				showAlert={showAlert}
				hideAlert={hideAlert}
			/>

			<BackToLoginButton />
		</View>
	)
}

export default ForgotPasswordForm
