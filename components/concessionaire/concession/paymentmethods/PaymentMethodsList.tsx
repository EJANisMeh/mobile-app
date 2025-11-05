import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native'
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
				const isCash = method.isDefaultCash === true

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
								{ marginBottom: responsive.getResponsiveMargin().medium },
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

						{/* Proof of Payment Section - Only show for non-default cash */}
						{!isCash && (
							<View style={styles.proofSection}>
								<View style={styles.proofToggleRow}>
									<MaterialCommunityIcons
										name="file-document-check-outline"
										size={20}
										color={
											method.needsProof ? colors.primary : colors.placeholder
										}
										style={{ marginRight: 8 }}
									/>
									<Text
										style={[
											styles.proofLabel,
											method.needsProof && { color: colors.primary },
										]}>
										Need proof of payment?
									</Text>
									<Switch
										value={method.needsProof}
										onValueChange={(value) =>
											onUpdateMethod(index, {
												...method,
												needsProof: value,
												proofMode: value
													? method.proofMode || 'screenshot'
													: null,
											})
										}
										trackColor={{
											false: colors.border,
											true: colors.primary + '80',
										}}
										thumbColor={method.needsProof ? colors.primary : '#f4f3f4'}
									/>
								</View>

								{method.needsProof && (
									<View style={styles.proofModeContainer}>
										<Text style={styles.proofModeLabel}>
											Proof of payment mode:
										</Text>
										<View style={styles.proofModeButtons}>
											<TouchableOpacity
												style={[
													styles.proofModeButton,
													method.proofMode === 'text' &&
														styles.proofModeButtonActive,
												]}
												onPress={() =>
													onUpdateMethod(index, {
														...method,
														proofMode: 'text',
													})
												}
												disabled={isCash}>
												<MaterialCommunityIcons
													name="text-box-outline"
													size={20}
													color={
														method.proofMode === 'text'
															? '#fff'
															: colors.textSecondary
													}
												/>
												<Text
													style={[
														styles.proofModeButtonText,
														method.proofMode === 'text' &&
															styles.proofModeButtonTextActive,
													]}>
													Text
												</Text>
											</TouchableOpacity>

											<TouchableOpacity
												style={[
													styles.proofModeButton,
													method.proofMode === 'screenshot' &&
														styles.proofModeButtonActive,
												]}
												onPress={() =>
													onUpdateMethod(index, {
														...method,
														proofMode: 'screenshot',
													})
												}
												disabled={isCash}>
												<MaterialCommunityIcons
													name="camera-outline"
													size={20}
													color={
														method.proofMode === 'screenshot'
															? '#fff'
															: colors.textSecondary
													}
												/>
												<Text
													style={[
														styles.proofModeButtonText,
														method.proofMode === 'screenshot' &&
															styles.proofModeButtonTextActive,
													]}>
													Screenshot
												</Text>
											</TouchableOpacity>
										</View>
									</View>
								)}
							</View>
						)}
					</View>
				)
			})}
		</>
	)
}

export default PaymentMethodsList
