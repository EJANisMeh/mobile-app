import React from 'react'
import {
	View,
	Text,
	StyleProp,
	ViewStyle,
} from 'react-native'
import { LoginCredentials, UseAlertModalProps } from '../../../types'
import LoginInputs from './LoginInputs'
import LoginButton from './LoginButton'
import ForgotPasswordNavButton from './ForgotPasswordNavButton'
import RegisterNavButton from './RegisterNavButton'

interface LoginFormProps {
	credentials: LoginCredentials
	setCredentials: React.Dispatch<React.SetStateAction<LoginCredentials>>
	isLoading: boolean
	colors: {
		surface: string
		textOnPrimary: string
	}
	loginStyles: Record<string, StyleProp<any>>
	dynamicStyles: {
		form: StyleProp<ViewStyle>
	}
	showAlert: (opts: UseAlertModalProps) => void
	hideAlert: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({
	credentials,
	setCredentials,
	colors,
	loginStyles,
	dynamicStyles,
	showAlert,
	hideAlert
}) => {
	return (
		<View style={dynamicStyles.form}>
			<LoginInputs
				credentials={credentials}
				setCredentials={setCredentials}
				inputStyle={loginStyles.input}
				disabledInputStyle={{
					opacity: 0.6,
					backgroundColor: colors.surface,
				}}
			/>

			<LoginButton
				credentials={credentials}
				setCredentials={setCredentials}
				colors={colors}
				loginStyles={loginStyles}
				showAlert={showAlert}
				hideAlert={hideAlert}
			/>

			<ForgotPasswordNavButton loginStyles={loginStyles} />

			<View style={loginStyles.footer}>
				<Text style={loginStyles.footerText}>Don't have an account? </Text>
				<RegisterNavButton loginStyles={loginStyles} />
			</View>
		</View>
	)
}

export default LoginForm
