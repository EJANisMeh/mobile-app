import React from 'react'
import { View, Text, TouchableOpacity, StyleProp } from 'react-native'
import ForgotPassEmailInput from './ForgotPassEmailInput'
import RequestPassResetButton from './RequestPassResetButton'
import BackToLoginButton from './BackToLoginButton'
import { UseAlertModalType } from '../../../hooks/useModals/useAlertModal'

interface ForgotPasswordFormProps {
	email: string
	setEmail: (email: string) => void
	forgotPasswordStyles: Record<string, StyleProp<any>>
	showAlert: UseAlertModalType['showAlert']
	hideAlert: UseAlertModalType['hideAlert']
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
	email,
	setEmail,
	forgotPasswordStyles,
	showAlert,
	hideAlert,
}) => {
	return (
		<View style={forgotPasswordStyles.form}>
			<ForgotPassEmailInput
				email={email}
				setEmail={setEmail}
				forgotPasswordStyles={forgotPasswordStyles}
			/>

			<RequestPassResetButton
				email={email}
				forgotPasswordStyles={forgotPasswordStyles}
				showAlert={showAlert}
				hideAlert={hideAlert}
			/>

			<BackToLoginButton forgotPasswordStyles={forgotPasswordStyles} />
		</View>
	)
}

export default ForgotPasswordForm
