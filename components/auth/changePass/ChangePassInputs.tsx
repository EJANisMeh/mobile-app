import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemeContext } from '../../../context'
import { createChangePasswordStyles } from '../../../styles/auth'
import { useResponsiveDimensions } from '../../../hooks'

interface ChangePassInputsProps {
	formData: {
		currentPassword: string
		newPassword: string
		confirmPassword: string
	}
	updateField: (field: string, value: string) => void
}

const ChangePassInputs: React.FC<ChangePassInputsProps> = ({
	formData,
	updateField
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const changePasswordStyles = createChangePasswordStyles(colors, responsive)

	const [showPasswords, setShowPasswords] = useState({
		current: false,
		new: false,
		confirm: false,
	})

	const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
		setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
	}

	return (
		<>
			<View style={changePasswordStyles.inputContainer}>
				<TextInput
					style={changePasswordStyles.input}
					placeholder="New Password"
					value={formData.newPassword}
					onChangeText={(value) => updateField('newPassword', value)}
					secureTextEntry={!showPasswords.new}
					autoCapitalize="none"
				/>
				<TouchableOpacity
					style={changePasswordStyles.eyeButton}
					onPress={() => togglePasswordVisibility('new')}>
					<MaterialCommunityIcons
						name={showPasswords.new ? 'eye-off' : 'eye'}
						size={24}
						color={colors.text}
					/>
				</TouchableOpacity>
			</View>

			<View style={changePasswordStyles.inputContainer}>
				<TextInput
					style={changePasswordStyles.input}
					placeholder="Confirm New Password"
					value={formData.confirmPassword}
					onChangeText={(value) => updateField('confirmPassword', value)}
					secureTextEntry={!showPasswords.confirm}
					autoCapitalize="none"
				/>
				<TouchableOpacity
					style={changePasswordStyles.eyeButton}
					onPress={() => togglePasswordVisibility('confirm')}>
					<MaterialCommunityIcons
						name={showPasswords.confirm ? 'eye-off' : 'eye'}
						size={24}
						color={colors.text}
					/>
				</TouchableOpacity>
			</View>
		</>
	)
}

export default ChangePassInputs
