import React, { useState } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Keyboard,
	ActivityIndicator,
} from 'react-native'
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

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
	const { isLoading} = useAuthContext()
	const { colors } = useThemeContext()
	const loginStyles = createLoginStyles(colors)
	const { visible, title, message, hideAlert, handleConfirm } =
		useAlertModal()
	const responsive = useResponsiveDimensions()
	const [credentials, setCredentials] = useState<LoginCredentials>({
		email: '',
		password: '',
	})

	// Get responsive styles based on orientation
	const dynamicStyles = {
		container: {
			...loginStyles.container,
			paddingHorizontal: responsive.getResponsivePadding().horizontal,
		},
		content: {
			...loginStyles.content,
			paddingVertical: responsive.getResponsivePadding().vertical,
			// In landscape, reduce vertical spacing
			justifyContent: responsive.isLandscape
				? ('flex-start' as const)
				: ('center' as const),
			paddingTop: responsive.isLandscape ? 40 : undefined,
		},
		title: {
			...loginStyles.title,
			fontSize: responsive.getResponsiveFontSize(32),
			marginBottom: responsive.getResponsiveMargin().small,
		},
		subtitle: {
			...loginStyles.subtitle,
			fontSize: responsive.getResponsiveFontSize(16),
			marginBottom: responsive.getResponsiveMargin().medium,
		},
		form: {
			...loginStyles.form,
			marginBottom: responsive.getResponsiveMargin().medium,
		},
	}



	const handleRegisterNavigation = () => {
		Keyboard.dismiss()
		setTimeout(() => {
			navigation.navigate('Register')
		}, 100)
	}

	return (
		<>
			<DynamicScrollView styles={loginStyles}>
				<View style={dynamicStyles.content}>
					<Text style={dynamicStyles.title}>Hello User</Text>
					<Text style={dynamicStyles.subtitle}>Sign in to your account</Text>

					<LoginForm
						credentials={credentials}
						setCredentials={setCredentials}
						isLoading={isLoading}
						colors={colors}
						loginStyles={loginStyles}
						dynamicStyles={dynamicStyles}
					/>
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

export default LoginScreen
