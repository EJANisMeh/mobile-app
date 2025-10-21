import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { useAuthContext, useThemeContext } from '../../../context'
import { LoginCredentials } from '../../../types'
import { AlertModal } from '../../../components'
import { useAlertModal, useResponsiveDimensions } from '../../../hooks'
import type { AuthStackParamList } from '../../../types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'
import { createLoginStyles } from '../../../styles/themedStyles'
import DynamicScrollView from '../../../components/DynamicScrollView'
import LoginForm from '../../../components/auth/login/LoginForm'

type LoginScreenNavigationProp = StackNavigationProp<
	AuthStackParamList,
	'Login'
>

interface LoginScreenProps {
	navigation: LoginScreenNavigationProp
}

const LoginScreen: React.FC<LoginScreenProps> = () => {
	const { isLoading } = useAuthContext()
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const loginStyles = createLoginStyles(colors, responsive)
	const { visible, title, message, showAlert, hideAlert, handleClose } =
		useAlertModal()
	const [credentials, setCredentials] = useState<LoginCredentials>({
		email: '',
		password: '',
	})

	return (
		<>
			<DynamicScrollView
				styles={loginStyles.container}
				autoCenter="center"
				fallbackAlign="flex-start">
				<View style={loginStyles.content}>
					<Text style={loginStyles.title}>Hello User</Text>
					<Text style={loginStyles.subtitle}>Sign in to your account</Text>

					<LoginForm
						credentials={credentials}
						setCredentials={setCredentials}
						isLoading={isLoading}
						colors={colors}
						loginStyles={loginStyles}
						showAlert={showAlert}
					/>
				</View>
			</DynamicScrollView>

			<AlertModal
				visible={visible}
				onClose={hideAlert}
				title={title}
				message={message}
				buttons={[{ text: 'OK', onPress: handleClose }]}
			/>
		</>
	)
}

export default LoginScreen
