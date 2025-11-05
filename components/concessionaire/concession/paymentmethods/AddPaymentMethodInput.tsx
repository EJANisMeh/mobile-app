import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, Text, Switch } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createPaymentMethodsStyles } from '../../../../styles/concessionaire'
import { AddPaymentMethodInputProps } from '../../../../types'

const AddPaymentMethodInput: React.FC<AddPaymentMethodInputProps> = ({
	onAdd,
	existingTypes,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createPaymentMethodsStyles(colors, responsive)

	const [type, setType] = useState('')
	const [details, setDetails] = useState('')
	const [needsProof, setNeedsProof] = useState(false)
	const [proofMode, setProofMode] = useState<'text' | 'screenshot'>(
		'screenshot'
	)
	const [showInputs, setShowInputs] = useState(false)

	const handleAdd = () => {
		const trimmedType = type.trim()
		const trimmedDetails = details.trim()

		if (!trimmedType) {
			return
		}

		onAdd({
			type: trimmedType,
			details: trimmedDetails,
			needsProof,
			proofMode: needsProof ? proofMode : null,
		})
		setType('')
		setDetails('')
		setNeedsProof(false)
		setProofMode('screenshot')
		setShowInputs(false)
	}

	const handleCancel = () => {
		setType('')
		setDetails('')
		setNeedsProof(false)
		setProofMode('screenshot')
		setShowInputs(false)
	}

	if (!showInputs) {
		return (
			<TouchableOpacity
				style={styles.addButton}
				onPress={() => setShowInputs(true)}>
				<MaterialCommunityIcons
					name="plus-circle"
					size={24}
					color={colors.primary}
				/>
				<Text style={styles.addButtonText}>Add Payment Method</Text>
			</TouchableOpacity>
		)
	}

	return (
		<View style={styles.addInputContainer}>
			<Text style={styles.addInputTitle}>New Payment Method</Text>

			<TextInput
				style={styles.addInput}
				placeholder="Payment type (e.g., GCash, PayMaya, Bank Transfer)"
				placeholderTextColor={colors.placeholder}
				value={type}
				onChangeText={setType}
				autoFocus
			/>

			<TextInput
				style={[styles.addInput, styles.addInputMultiline]}
				placeholder="Payment details (e.g., account number, instructions)"
				placeholderTextColor={colors.placeholder}
				value={details}
				onChangeText={setDetails}
				multiline
				numberOfLines={3}
			/>

			{/* Proof of Payment Section */}
			<View style={styles.proofSection}>
				<View style={styles.proofToggleRow}>
					<MaterialCommunityIcons
						name="file-document-check-outline"
						size={20}
						color={needsProof ? colors.primary : colors.placeholder}
						style={{ marginRight: 8 }}
					/>
					<Text
						style={[
							styles.proofLabel,
							needsProof && { color: colors.primary },
						]}>
						Need proof of payment?
					</Text>
					<Switch
						value={needsProof}
						onValueChange={setNeedsProof}
						trackColor={{
							false: colors.border,
							true: colors.primary + '80',
						}}
						thumbColor={needsProof ? colors.primary : '#f4f3f4'}
					/>
				</View>

				{needsProof && (
					<View style={styles.proofModeContainer}>
						<Text style={styles.proofModeLabel}>Proof of payment mode:</Text>
						<View style={styles.proofModeButtons}>
							<TouchableOpacity
								style={[
									styles.proofModeButton,
									proofMode === 'text' && styles.proofModeButtonActive,
								]}
								onPress={() => setProofMode('text')}>
								<MaterialCommunityIcons
									name="text-box-outline"
									size={20}
									color={proofMode === 'text' ? '#fff' : colors.textSecondary}
								/>
								<Text
									style={[
										styles.proofModeButtonText,
										proofMode === 'text' && styles.proofModeButtonTextActive,
									]}>
									Text
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[
									styles.proofModeButton,
									proofMode === 'screenshot' && styles.proofModeButtonActive,
								]}
								onPress={() => setProofMode('screenshot')}>
								<MaterialCommunityIcons
									name="camera-outline"
									size={20}
									color={
										proofMode === 'screenshot' ? '#fff' : colors.textSecondary
									}
								/>
								<Text
									style={[
										styles.proofModeButtonText,
										proofMode === 'screenshot' &&
											styles.proofModeButtonTextActive,
									]}>
									Screenshot
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
			</View>

			<View style={styles.addInputActions}>
				<TouchableOpacity
					style={styles.addInputCancelButton}
					onPress={handleCancel}>
					<Text style={styles.addInputCancelText}>Cancel</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.addInputAddButton,
						!type.trim() && styles.addInputAddButtonDisabled,
					]}
					onPress={handleAdd}
					disabled={!type.trim()}>
					<MaterialCommunityIcons
						name="check"
						size={20}
						color="#fff"
					/>
					<Text style={styles.addInputAddText}>Add</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default AddPaymentMethodInput
