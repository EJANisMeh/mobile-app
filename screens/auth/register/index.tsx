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
import { RegisterData } from '../../../types'
import { AlertModal } from '../../../components'
import { useAlertModal, useResponsiveDimensions } from '../../../hooks'
import type { AuthStackParamList } from '../../../types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'
import { createRegisterStyles } from '../../../styles/themedStyles'
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

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
	const { isLoading } = useAuthContext()
	const { colors } = useThemeContext()
	const registerStyles = createRegisterStyles(colors)
	const { visible, title, message, showAlert, hideAlert, handleConfirm } = useAlertModal()
	const responsive = useResponsiveDimensions()
	const [formData, setFormData] = useState<RegisterData>({
		email: '',
		password: '',
		confirmPassword: '',
	})

	// Get responsive styles
	const dynamicStyles = {
		container: {
			...registerStyles.container,
		},
		scrollContent: {
			...registerStyles.scrollContent,
			paddingHorizontal: responsive.getResponsivePadding().horizontal,
			paddingVertical: responsive.getResponsivePadding().vertical,
		},
		title: {
			...registerStyles.title,
			fontSize: responsive.getResponsiveFontSize(32),
			marginBottom: responsive.getResponsiveMargin().small,
		},
		subtitle: {
			...registerStyles.subtitle,
			fontSize: responsive.getResponsiveFontSize(16),
			marginBottom: responsive.getResponsiveMargin().medium,
		},
	}

	return (
		<>
			<DynamicScrollView
				styles={registerStyles}
				autoCenter="center"
				fallbackAlign="flex-start"
				contentContainerStyle={{
					alignItems: 'center',
					paddingHorizontal: responsive.getResponsivePadding().horizontal,
					paddingVertical: responsive.getResponsivePadding().vertical,
				}}>
				<View
					style={[
						registerStyles.content,
						{
							width: '100%' as const,
							maxWidth: responsive.getContentMaxWidth(),
						},
					]}>
					<Text style={dynamicStyles.title}>Create Account</Text>
					<Text style={dynamicStyles.subtitle}>Sign up to get started</Text>

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
				buttons={[{ text: 'OK', onPress: handleConfirm }]}
			/>
		</>
	)
}

export default RegisterScreen
