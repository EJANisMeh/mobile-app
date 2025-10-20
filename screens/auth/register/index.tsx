import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	ScrollView,
	Dimensions,
	ActivityIndicator,
} from 'react-native'
import { useAuthContext, useThemeContext } from '../../../context'
// hooks
import { useAlertModal, useResponsiveDimensions } from '../../../hooks'
// types
import type { AuthStackParamList } from '../../../types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'
import { RegisterData } from '../../../types'
//styles
import { createRegisterStyles } from '../../../styles/themedStyles'
// components
import { AlertModal } from '../../../components'
import DynamicScrollView from '../../../components/DynamicScrollView'
import RegisterForm from '../../../components/auth/register'
import BackToLoginButton from '../../../components/auth/register/BackToLoginButton'

type RegisterScreenNavigationProp = StackNavigationProp<
	AuthStackParamList,
	'Register'
>

interface RegisterScreenProps {
	navigation: RegisterScreenNavigationProp
}

const RegisterScreen: React.FC<RegisterScreenProps> = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const registerStyles = createRegisterStyles(colors, responsive)
	const { visible, title, message, showAlert, hideAlert, handleClose } =
		useAlertModal()
	const [formData, setFormData] = useState<RegisterData>({
		email: '',
		password: '',
		confirmPassword: '',
	})

	return (
		<>
			<DynamicScrollView
				styles={registerStyles.container}
				autoCenter="center"
				fallbackAlign="flex-start">
				<View style={registerStyles.content}>
					<Text style={registerStyles.title}>Create Account</Text>
					<Text style={registerStyles.subtitle}>Sign up to get started</Text>

					<RegisterForm
						formData={formData}
						setFormData={setFormData}
						colors={colors}
						registerStyles={registerStyles}
						showAlert={showAlert}
					/>

					<View style={registerStyles.footer}>
						<Text style={registerStyles.footerText}>
							Already have an account?{' '}
						</Text>
						<BackToLoginButton registerStyles={registerStyles} />
					</View>
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

export default RegisterScreen
