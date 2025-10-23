import React from 'react'
import { TextInput } from 'react-native'
import { ProfileCreationData } from '../../../types'
import { useAuthContext, useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createProfileCreationStyles } from '../../../styles/auth'

interface NameInputsProps {
	formData: ProfileCreationData
	updateField: (field: keyof ProfileCreationData, value: string) => void
}

const NameInputs: React.FC<NameInputsProps> = ({ formData, updateField }) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const profileCreationStyles = createProfileCreationStyles(colors, responsive)
	const { isLoading } = useAuthContext()

	return (
		<>
			<TextInput
				style={[profileCreationStyles.input, isLoading && { opacity: 0.6 }]}
				placeholder="First Name *"
				value={formData.fname}
				onChangeText={(text) => updateField('fname', text)}
				editable={!isLoading}
				autoCapitalize="words"
			/>

			<TextInput
				style={[profileCreationStyles.input, isLoading && { opacity: 0.6 }]}
				placeholder="Last Name *"
				value={formData.lname}
				onChangeText={(text) => updateField('lname', text)}
				editable={!isLoading}
				autoCapitalize="words"
			/>
		</>
	)
}

export default NameInputs
