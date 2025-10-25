import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, BackHandler } from 'react-native'
import { useThemeContext } from '../../../context'
import { AlertModal, ConfirmationModal } from '../../../components'
import {
	useAlertModal,
	useConfirmationModal,
	useResponsiveDimensions,
} from '../../../hooks'
import { createChangePasswordStyles } from '../../../styles/auth'
import DynamicScrollView from '../../../components/DynamicScrollView'
import {
	ChangePassInputs,
	ChangePassSubmitButton,
} from '../../../components/auth/changePass'
import { useAuthNavigation } from '../../../hooks/useNavigation'

interface ChangePasswordScreenProps {
	route: { params: { userId: number } }
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({
	route,
}) => {
	const { userId } = route.params
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const changePasswordStyles = createChangePasswordStyles(colors, responsive)
	const [formData, setFormData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	})
	const { visible, title, message, showAlert, hideAlert, handleClose } =
		useAlertModal()
	const {
		visible: confirmVisible,
		props: confirmProps,
		showConfirmation,
		hideConfirmation,
	} = useConfirmationModal()

	const navigation = useAuthNavigation()

	const updateField = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
	}

	const handleCancel = () => {
		showConfirmation({
			title: 'Cancel Password Change?',
			message:
				'Are you sure you want to cancel changing your password? This will take you back to the login screen.',
			confirmText: 'Confirm',
			cancelText: 'Cancel',
			confirmStyle: 'destructive',
			onConfirm: () => {
				navigation.reset({
					index: 0,
					routes: [{ name: 'Login' }],
				})
			},
		})
	}

	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				handleCancel()
				return true // Prevent default back behavior
			}
		)

		return () => backHandler.remove() // Remove backhandler function after unmounting
	}, [])

	return (
		<>
			<DynamicScrollView
				styles={changePasswordStyles.container}
				autoCenter="center">
				<View style={changePasswordStyles.content}>
					<Text style={changePasswordStyles.title}>Change Password</Text>
					<Text style={changePasswordStyles.subtitle}>
						Enter your new password
					</Text>

					<ChangePassInputs
						formData={formData}
						updateField={updateField}
					/>

					<ChangePassSubmitButton
						userId={userId}
						formData={formData}
						updateField={updateField}
						showAlert={showAlert}
						showConfirmation={showConfirmation}
					/>

					<TouchableOpacity
						style={changePasswordStyles.cancelButton}
						onPress={handleCancel}>
						<Text style={changePasswordStyles.cancelButtonText}>Cancel</Text>
					</TouchableOpacity>
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

export default ChangePasswordScreen
