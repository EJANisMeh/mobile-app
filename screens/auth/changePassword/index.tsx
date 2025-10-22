import React, { useState } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
} from 'react-native'
import { useThemeContext } from '../../../context'
import { AlertModal } from '../../../components'
import { useAlertModal, useResponsiveDimensions } from '../../../hooks'
import { createChangePasswordStyles } from '../../../styles/auth'
import DynamicScrollView from '../../../components/DynamicScrollView'
import { ChangePassInputs, ChangePassSubmitButton } from '../../../components/auth/changePass'
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
	const navigation = useAuthNavigation()

	const updateField = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
	}

	return (
		<>
			<DynamicScrollView
				styles={changePasswordStyles.container}
				autoCenter="center"
				fallbackAlign="flex-start">
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
					/>

					<TouchableOpacity
						style={changePasswordStyles.cancelButton}
						onPress={() => navigation.goBack()}>
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
		</>
	)
}

export default ChangePasswordScreen
