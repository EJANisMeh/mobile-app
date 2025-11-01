import React from 'react'
import { View, Text, TextInput } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionaireMenuStyles } from '../../../../styles/concessionaire/menu'
import { AddMenuItemFormData } from '../../../../types'

interface NameInputProps {
  formData: AddMenuItemFormData
  setFormData: React.Dispatch<React.SetStateAction<AddMenuItemFormData>>
  errors: Record<string, string>
}

const NameInput: React.FC<NameInputProps> = ({
	formData,
	setFormData,
	errors,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireMenuStyles(colors, responsive)

	return (
		<>
			<Text style={styles.sectionTitle}>Item Name *</Text>
			<View style={styles.categoryInputContainer}>
				<TextInput
					style={styles.categoryInput}
					value={formData.name}
					onChangeText={(text) =>
						setFormData((prev) => ({ ...prev, name: text }))
					}
					placeholder="e.g., Burger, Pizza, Coffee"
					placeholderTextColor={colors.textSecondary}
				/>
			</View>
			{errors['name'] && (
				<Text style={{ color: '#ef4444', marginTop: 4 }}>{errors['name']}</Text>
			)}
		</>
	)
}

export default NameInput
