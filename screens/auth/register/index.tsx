import React, { useState, useEffect } from 'react'
import { View, Text, Keyboard, BackHandler } from 'react-native'
import { useThemeContext } from '../../../context'
// hooks
import {
	useAlertModal,
	useResponsiveDimensions,
	useConfirmationModal,
} from '../../../hooks'
import { useAuthNavigation } from '../../../hooks/useNavigation'
//types
import { RegisterData } from '../../../types'
//styles
import { createRegisterStyles } from '../../../styles/auth'
// components
import { AlertModal, ConfirmationModal } from '../../../components'
import DynamicScrollView from '../../../components/DynamicScrollView'
import RegisterForm from '../../../components/auth/register'
import BackToLoginButton from '../../../components/auth/register/BackToLoginButton'

const RegisterScreen: React.FC = () => {
	const [edited, setEdited] = useState<boolean>(false)
	const [formData, setFormData] = useState<RegisterData>({
		email: '',
		password: '',
		confirmPassword: '',
	})

	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const registerStyles = createRegisterStyles(colors, responsive)
	const { visible, title, message, showAlert, hideAlert, handleClose } =
		useAlertModal()
	const navigation = useAuthNavigation()

	const {
		visible: confirmVisible,
		props: confirmProps,
		showConfirmation,
		hideConfirmation,
	} = useConfirmationModal()

	const handleBackToLogin = () => {
		Keyboard.dismiss()

		if (edited) {
			showConfirmation({
				title: 'Leave Registration?',
				message:
					'You have unsaved changes. Are you sure you want to go back? Your input will be lost.',
				confirmText: 'Leave',
				cancelText: 'Stay',
				confirmStyle: 'destructive',
				onConfirm: () => {
					navigation.goBack()
				},
			})
			return
		}

		setTimeout(() => navigation.goBack(), 100)
	}

	// Handle Android hardware back button
	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				handleBackToLogin()
				return true // Prevent default back behavior
			}
		)

		return () => backHandler.remove() // Remove backhandler function after unmounting
	}, [edited])

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
						showAlert={showAlert}
						setEdited={setEdited}
					/>

					<View style={registerStyles.footer}>
						<Text style={registerStyles.footerText}>
							Already have an account?{' '}
						</Text>
						<BackToLoginButton
							handlePress={handleBackToLogin}
						/>
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

			<ConfirmationModal
				visible={confirmVisible}
				onClose={hideConfirmation}
				title={confirmProps.title}
				message={confirmProps.message}
				confirmText={confirmProps.confirmText}
				cancelText={confirmProps.cancelText}
				confirmStyle={confirmProps.confirmStyle}
				onConfirm={confirmProps.onConfirm}
			/>
		</>
	)
}

export default RegisterScreen
