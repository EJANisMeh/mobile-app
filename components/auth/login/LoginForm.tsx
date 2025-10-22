import React from 'react'
import {
	View,
	Text,
} from 'react-native'
import { LoginCredentials } from '../../../types'
import { UseAlertModalType } from '../../../hooks/useModals/types'
import LoginInputs from './LoginInputs'
import LoginButton from './LoginButton'
import ForgotPasswordNavButton from './ForgotPasswordNavButton'
import RegisterNavButton from './RegisterNavButton'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createLoginStyles } from '../../../styles/auth'

interface LoginFormProps {
	credentials: LoginCredentials
	setCredentials: React.Dispatch<React.SetStateAction<LoginCredentials>>
	showAlert: UseAlertModalType['showAlert']
}

const LoginForm: React.FC<LoginFormProps> = ({
	credentials,
	setCredentials,
	showAlert
}) =>
{
	const {colors} = useThemeContext()
	const responsive = useResponsiveDimensions()
	const loginStyles = createLoginStyles(colors, responsive)

	return (
		<View style={loginStyles.form}>
			<LoginInputs
				credentials={credentials}
				setCredentials={setCredentials}
			/>

			<LoginButton
				credentials={credentials}
				setCredentials={setCredentials}
				showAlert={showAlert}
			/>

			<ForgotPasswordNavButton />

			<View style={loginStyles.footer}>
				<Text style={loginStyles.footerText}>Don't have an account? </Text>
				<RegisterNavButton />
			</View>
		</View>
	)
}

export default LoginForm
