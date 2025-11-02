import React, { useState, useEffect } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import BaseModal from './BaseModal'

export interface CheckboxMenuOption {
	label: string
	value: any
}

interface CheckboxMenuModalProps {
	visible: boolean
	onClose: () => void
	title: string
	message?: string
	options: CheckboxMenuOption[]
	selectedValues: any[]
	onSave: (selectedValues: any[]) => void
	footer?: React.ReactNode
}

const CheckboxMenuModal: React.FC<CheckboxMenuModalProps> = ({
	visible,
	onClose,
	title,
	message,
	options,
	selectedValues,
	onSave,
	footer,
}) => {
	const [tempSelected, setTempSelected] = useState<any[]>(selectedValues)

	// Update temp selected when modal becomes visible or selectedValues change
	useEffect(() => {
		if (visible) {
			setTempSelected(selectedValues)
		}
	}, [visible, selectedValues])

	const toggleOption = (value: any) => {
		setTempSelected((prev) => {
			if (prev.includes(value)) {
				return prev.filter((v) => v !== value)
			} else {
				return [...prev, value]
			}
		})
	}

	const handleClose = () => {
		// Auto-save when closing
		onSave(tempSelected)
		onClose()
	}

	return (
		<BaseModal
			visible={visible}
			onClose={handleClose}
			title={title}>
			{message && <Text style={styles.message}>{message}</Text>}

			<ScrollView style={styles.optionsContainer}>
				{options.map((option, index) => {
					const isSelected = tempSelected.includes(option.value)
					return (
						<TouchableOpacity
							key={index}
							style={[styles.option, isSelected && styles.selectedOption]}
							onPress={() => toggleOption(option.value)}>
							<View style={styles.optionContent}>
								<View
									style={[
										styles.checkbox,
										isSelected && styles.checkboxSelected,
									]}>
									{isSelected && (
										<Ionicons
											name="checkmark"
											size={16}
											color="#fff"
										/>
									)}
								</View>
								<Text
									style={[
										styles.optionText,
										isSelected && styles.selectedOptionText,
									]}>
									{option.label}
								</Text>
							</View>
						</TouchableOpacity>
					)
				})}
			</ScrollView>

			{footer && <View style={styles.footerContainer}>{footer}</View>}

			<TouchableOpacity
				style={styles.closeButton}
				onPress={handleClose}>
				<Text style={styles.closeButtonText}>Close</Text>
			</TouchableOpacity>
		</BaseModal>
	)
}

const styles = StyleSheet.create({
	message: {
		fontSize: 14,
		color: '#666',
		lineHeight: 20,
		marginBottom: 15,
		textAlign: 'center',
	},
	optionsContainer: {
		maxHeight: 300,
		marginBottom: 15,
	},
	option: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		backgroundColor: '#f8f9fa',
		marginBottom: 8,
	},
	selectedOption: {
		backgroundColor: '#e3f2fd',
	},
	optionContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: 4,
		borderWidth: 2,
		borderColor: '#ccc',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
	},
	checkboxSelected: {
		backgroundColor: '#2196F3',
		borderColor: '#2196F3',
	},
	optionText: {
		fontSize: 16,
		fontWeight: '500',
		color: '#333',
		flex: 1,
	},
	selectedOptionText: {
		color: '#1976D2',
		fontWeight: '600',
	},
	footerContainer: {
		marginBottom: 15,
	},
	closeButton: {
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		backgroundColor: '#6c757d',
		alignItems: 'center',
	},
	closeButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: 'white',
	},
})

export default CheckboxMenuModal
