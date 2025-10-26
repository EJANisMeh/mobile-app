import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createPaymentMethodsStyles } from '../../../../styles/concessionaire'
import { PaymentMethodsListProps } from '../../../../types'

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({
	paymentMethods,
	onUpdateMethod,
	onRemoveMethod,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createPaymentMethodsStyles(colors, responsive)

	return (
		<>
			{paymentMethods.map((method, index) => {
				const isCash = method.type.toLowerCase() === 'cash'

				return (
					<View
						key={index}
						style={styles.methodCard}>
						<View style={styles.methodHeader}>
							<View style={styles.methodTitleRow}>
								<Text style={styles.methodTitle}>{method.type}</Text>
								{isCash && (
									<View style={styles.defaultBadge}>
										<Text style={styles.defaultBadgeText}>DEFAULT</Text>
									</View>
								)}
							</View>

							{!isCash && (
								<TouchableOpacity
									style={styles.removeButton}
									onPress={() => onRemoveMethod(index)}>
									<MaterialCommunityIcons
										name="close-circle"
										size={24}
										color="#dc3545"
									/>
								</TouchableOpacity>
							)}
						</View>

						{/* Payment Type Input */}
						<TextInput
							style={[
								styles.detailsInput,
								isCash && styles.detailsInputReadonly,
								{ marginBottom: responsive.getResponsiveMargin().small },
							]}
							placeholder="Payment type (e.g., GCash, Bank Transfer)"
							placeholderTextColor={colors.placeholder}
							value={method.type}
							onChangeText={(text) =>
								onUpdateMethod(index, { ...method, type: text })
							}
							editable={!isCash}
						/>

						{/* Payment Details Input */}
						<TextInput
							style={[
								styles.detailsInput,
								isCash && styles.detailsInputReadonly,
							]}
							placeholder="Payment details (e.g., account number, instructions)"
							placeholderTextColor={colors.placeholder}
							value={method.details}
							onChangeText={(text) =>
								onUpdateMethod(index, { ...method, details: text })
							}
							editable={!isCash}
							multiline
						/>
					</View>
				)
			})}
		</>
	)
}

export default PaymentMethodsList
