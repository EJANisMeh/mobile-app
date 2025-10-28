import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../context'
import {
	AlertModal,
	DynamicKeyboardView,
	DynamicScrollView,
} from '../../../components'
import { useAlertModal, useResponsiveDimensions } from '../../../hooks'
import { createForgotPasswordStyles } from '../../../styles/auth'
import { ForgotPassForm } from '../../../components/auth/forgotPassword'


const ForgotPasswordScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const forgotPasswordStyles = createForgotPasswordStyles(colors, responsive)
	const [email, setEmail] = useState('')
	const { visible, title, message, showAlert, hideAlert, handleClose } =
		useAlertModal()

	return (
		<DynamicKeyboardView>
			<DynamicScrollView
				styles={forgotPasswordStyles.container}
				autoCenter="center">
				<View style={forgotPasswordStyles.content}>
					<Text style={forgotPasswordStyles.title}>Reset Password</Text>
					<Text style={forgotPasswordStyles.subtitle}>
						Enter your email address and we'll send you instructions to reset
						your password.
					</Text>

					<ForgotPassForm
						email={email}
						setEmail={setEmail}
						showAlert={showAlert}
						hideAlert={hideAlert}
					/>
				</View>
			</DynamicScrollView>

			<AlertModal
				visible={visible}
				onClose={hideAlert}
				title={title}
				message={message}
				buttons={[{ text: 'Confirm', onPress: handleClose }]}
			/>
		</DynamicKeyboardView>
	)
}

export default ForgotPasswordScreen
