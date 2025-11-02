import React from 'react'
import { View, Text, TextInput } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionaireEditMenuItemStyles } from '../../../../styles/concessionaire'
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
	const styles = createConcessionaireEditMenuItemStyles(colors, responsive)

	return (
		<>
			<Text style={styles.sectionTitle}>Description</Text>
			<View style={[styles.categoryInputContainer, { minHeight: 80 }]}>
				<TextInput
					style={[styles.categoryInput, { textAlignVertical: 'top' }]}
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
