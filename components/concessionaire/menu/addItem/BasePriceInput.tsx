import React from 'react'
import { Text, View, TextInput } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionaireAddMenuItemStyles } from '../../../../styles/concessionaire/addMenuItem'
import { AddMenuItemFormData } from '../../../../types'

interface BasePriceInputProps {
	formData: AddMenuItemFormData
	setFormData: React.Dispatch<React.SetStateAction<AddMenuItemFormData>>
	errors: Record<string, string>
}

const BasePriceInput: React.FC<BasePriceInputProps> = ({
	formData,
	setFormData,
	errors,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireAddMenuItemStyles(colors, responsive)

	return (
		<>
			<Text style={styles.sectionTitle}>Base Price</Text>
			<View style={styles.categoryInputContainer}>
				<Text style={styles.currencySymbol}>₱</Text>
				<TextInput
					style={[styles.categoryInput, { flex: 1 }]}
					value={formData.basePrice}
					onChangeText={(text) =>
						setFormData((prev) => ({ ...prev, basePrice: text }))
					}
					placeholder="0.00"
					placeholderTextColor={colors.textSecondary}
					keyboardType="decimal-pad"
				/>
			</View>
			{errors['basePrice'] && (
				<Text style={styles.nameInputError}>
					{errors['basePrice']}
				</Text>
			)}
		</>
	)
}

export default BasePriceInput
