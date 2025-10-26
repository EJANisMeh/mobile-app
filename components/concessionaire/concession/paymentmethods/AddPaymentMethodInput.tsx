import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, Text } from 'react-native'
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
	const [showInputs, setShowInputs] = useState(false)

	const handleAdd = () => {
		const trimmedType = type.trim()
		const trimmedDetails = details.trim()

		if (!trimmedType) {
			return
		}

		onAdd({ type: trimmedType, details: trimmedDetails })
		setType('')
		setDetails('')
		setShowInputs(false)
	}

	const handleCancel = () => {
		setType('')
		setDetails('')
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
