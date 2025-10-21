import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { useAuthContext, useThemeContext } from '../../../context'
import { AlertModal } from '../../../components'
import { useAlertModal, useResponsiveDimensions } from '../../../hooks'
import type { AuthStackParamList } from '../../../types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'
import { createForgotPasswordStyles } from '../../../styles/themedStyles'
import DynamicScrollView from '../../../components/DynamicScrollView'
import { ForgotPassForm } from '../../../components/auth/forgotPassword'

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
	AuthStackParamList,
	'ForgotPassword'
>

interface ForgotPasswordScreenProps {
	navigation: ForgotPasswordScreenNavigationProp
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
	navigation,
}) => {
	const { colors } = useThemeContext()
	const { error, requestPasswordReset } = useAuthContext()
	const responsive = useResponsiveDimensions()
	const forgotPasswordStyles = createForgotPasswordStyles(colors, responsive)
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const { visible, title, message, showAlert, hideAlert, handleClose } =
		useAlertModal()

	return (
		<>
			<DynamicScrollView
				styles={forgotPasswordStyles.container}
				autoCenter="center"
				fallbackAlign="flex-start">
				<View style={forgotPasswordStyles.content}>
					<Text style={forgotPasswordStyles.title}>Reset Password</Text>
					<Text style={forgotPasswordStyles.subtitle}>
						Enter your email address and we'll send you instructions to reset
						your password.
					</Text>

					<ForgotPassForm
						email={email}
						setEmail={setEmail}
						forgotPasswordStyles={forgotPasswordStyles}
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
		</>
	)
}

export default ForgotPasswordScreen
