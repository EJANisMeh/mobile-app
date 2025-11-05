import React from 'react'
import { View, Text, TextInput } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../styles/customer'

interface CustomerRequestInputProps {
	customerRequest: string
	onChangeRequest: (text: string) => void
}

const CustomerRequestInput: React.FC<CustomerRequestInputProps> = ({
	customerRequest,
	onChangeRequest,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)

	return (
		<View style={styles.customerRequestSection}>
			<View style={styles.sectionHeaderRow}>
				<MaterialCommunityIcons
					name="message-text-outline"
					size={20}
					color={colors.primary}
				/>
				<Text style={styles.sectionTitle}>Special Requests (Optional)</Text>
			</View>
			<Text style={styles.customerRequestHint}>
				Let us know about allergies, preferences, or special instructions
			</Text>
			<TextInput
				style={styles.customerRequestInput}
				value={customerRequest}
				onChangeText={onChangeRequest}
				placeholder="E.g., No onions, extra spicy, allergy to peanuts..."
				placeholderTextColor={colors.textSecondary}
				multiline={true}
				numberOfLines={3}
				maxLength={500}
				textAlignVertical="top"
			/>
			<Text style={styles.characterCount}>
				{customerRequest.length}/500
			</Text>
		</View>
	)
}

export default CustomerRequestInput
