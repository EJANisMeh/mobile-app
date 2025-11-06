import React, { useState, useEffect } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	Platform,
} from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import BaseModal from './BaseModal'
import { useThemeContext } from '../../context'
import { useResponsiveDimensions } from '../../hooks'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface RescheduleModalProps {
	visible: boolean
	onClose: () => void
	onConfirm: (newDate: Date, feedback: string) => void
	currentScheduledDate: Date | null
	isProcessing?: boolean
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
	visible,
	onClose,
	onConfirm,
	currentScheduledDate,
	isProcessing = false,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const [selectedDate, setSelectedDate] = useState<Date | null>(null)
	const [feedback, setFeedback] = useState('')
	const [showDatePicker, setShowDatePicker] = useState(false)

	useEffect(() => {
		if (!visible) {
			setSelectedDate(null)
			setFeedback('')
		} else if (currentScheduledDate) {
			setSelectedDate(new Date(currentScheduledDate))
		}
	}, [visible, currentScheduledDate])

	const handleConfirm = () => {
		if (!selectedDate || !feedback.trim()) {
			return
		}
		onConfirm(selectedDate, feedback.trim())
	}

	const handleDateConfirm = (date: Date) => {
		setSelectedDate(date)
		setShowDatePicker(false)
	}

	const formatDate = (date: Date | null) => {
		if (!date) return 'Select a date'
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	const canConfirm = selectedDate !== null && feedback.trim().length > 0

	const styles = StyleSheet.create({
		message: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.textSecondary,
			marginBottom: responsive.getResponsiveSpacing().md,
			lineHeight: 20,
		},
		inputContainer: {
			marginBottom: responsive.getResponsiveSpacing().md,
		},
		label: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600',
			color: colors.text,
			marginBottom: responsive.getResponsiveSpacing().xs,
		},
		requiredMark: {
			color: '#ef4444',
		},
		datePickerButton: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			backgroundColor: colors.background,
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: 8,
			padding: responsive.getResponsiveSpacing().md,
		},
		datePickerText: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
		},
		datePickerPlaceholder: {
			color: colors.placeholder,
		},
		input: {
			backgroundColor: colors.background,
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: 8,
			padding: responsive.getResponsiveSpacing().md,
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
			minHeight: 100,
			textAlignVertical: 'top',
		},
		charCount: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.textSecondary,
			marginTop: responsive.getResponsiveSpacing().xs,
			textAlign: 'right',
		},
		buttonContainer: {
			flexDirection: 'row',
			gap: responsive.getResponsiveMargin().small,
			marginTop: responsive.getResponsiveSpacing().md,
		},
		button: {
			flex: 1,
			paddingVertical: responsive.getResponsiveSpacing().md,
			borderRadius: 8,
			alignItems: 'center',
			justifyContent: 'center',
		},
		cancelButton: {
			backgroundColor: colors.surface,
			borderWidth: 1,
			borderColor: colors.border,
		},
		confirmButton: {
			backgroundColor: '#f59e0b',
		},
		disabledButton: {
			opacity: 0.5,
		},
		buttonText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600',
		},
		cancelButtonText: {
			color: colors.text,
		},
		confirmButtonText: {
			color: '#fff',
		},
	})

	return (
		<>
			<BaseModal
				visible={visible}
				onClose={onClose}
				title="Reschedule Order">
				<Text style={styles.message}>
					Select a new date and provide feedback to the customer about the
					rescheduling.
				</Text>

				{/* Date Picker */}
				<View style={styles.inputContainer}>
					<Text style={styles.label}>
						New Scheduled Date<Text style={styles.requiredMark}> *</Text>
					</Text>
					<TouchableOpacity
						style={styles.datePickerButton}
						onPress={() => setShowDatePicker(true)}
						disabled={isProcessing}>
						<Text
							style={[
								styles.datePickerText,
								!selectedDate && styles.datePickerPlaceholder,
							]}>
							{formatDate(selectedDate)}
						</Text>
						<MaterialCommunityIcons
							name="calendar"
							size={20}
							color={colors.primary}
						/>
					</TouchableOpacity>
				</View>

				{/* Feedback Input */}
				<View style={styles.inputContainer}>
					<Text style={styles.label}>
						Reason for Rescheduling<Text style={styles.requiredMark}> *</Text>
					</Text>
					<TextInput
						style={styles.input}
						value={feedback}
						onChangeText={setFeedback}
						placeholder="Explanation of the rescheduling"
						placeholderTextColor={colors.placeholder}
						multiline
						numberOfLines={4}
						maxLength={500}
						editable={!isProcessing}
					/>
					<Text style={styles.charCount}>{feedback.length}/500</Text>
				</View>

				{/* Buttons */}
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={[styles.button, styles.cancelButton]}
						onPress={onClose}
						disabled={isProcessing}>
						<Text style={[styles.buttonText, styles.cancelButtonText]}>
							Cancel
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.button,
							styles.confirmButton,
							!canConfirm && styles.disabledButton,
						]}
						onPress={handleConfirm}
						disabled={!canConfirm || isProcessing}>
						{isProcessing ? (
							<ActivityIndicator
								size="small"
								color="#fff"
							/>
						) : (
							<Text style={[styles.buttonText, styles.confirmButtonText]}>
								Reschedule
							</Text>
						)}
					</TouchableOpacity>
				</View>
			</BaseModal>

			<DateTimePickerModal
				isVisible={showDatePicker}
				mode="datetime"
				date={selectedDate || new Date()}
				onConfirm={handleDateConfirm}
				onCancel={() => setShowDatePicker(false)}
				minimumDate={new Date()}
				minuteInterval={15}
			/>
		</>
	)
}

export default RescheduleModal
