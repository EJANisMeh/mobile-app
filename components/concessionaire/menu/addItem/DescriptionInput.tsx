import React from 'react'
import { View, Text, TextInput } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionaireAddMenuItemStyles } from '../../../../styles/concessionaire/addMenuItem'
import { AddMenuItemFormData } from '../../../../types'

interface DescriptionInputProps {
	formData: AddMenuItemFormData
	setFormData: React.Dispatch<React.SetStateAction<AddMenuItemFormData>>
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({
	formData,
	setFormData,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireAddMenuItemStyles(colors, responsive)

	return (
		<>
			<Text style={styles.sectionTitle}>Description</Text>
			<View
				style={[
					styles.categoryInputContainer,
					styles.descriptionInputContainer,
				]}>
				<TextInput
					style={[styles.categoryInput, styles.descriptionInput]}
					value={formData.description}
					onChangeText={(text) =>
						setFormData((prev) => ({ ...prev, description: text }))
					}
					placeholder="Describe your item..."
					placeholderTextColor={colors.textSecondary}
					multiline
					numberOfLines={3}
				/>
			</View>
		</>
	)
}

export default DescriptionInput
