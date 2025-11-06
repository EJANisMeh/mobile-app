import React, { useState, useEffect } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from 'react-native'
import BaseModal from './BaseModal'
import { useThemeContext } from '../../context'
import { useResponsiveDimensions } from '../../hooks'

interface FeedbackInputModalProps {
	visible: boolean
	onClose: () => void
	onConfirm: (feedback: string) => void
	title: string
	message: string
	confirmText?: string
	cancelText?: string
	confirmStyle?: 'default' | 'destructive'
	placeholder?: string
	required?: boolean
	isProcessing?: boolean
}

const FeedbackInputModal: React.FC<FeedbackInputModalProps> = ({
	visible,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	confirmStyle = 'default',
	placeholder = 'Enter your feedback...',
	required = false,
	isProcessing = false,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const [feedback, setFeedback] = useState('')

	useEffect(() => {
		if (!visible) {
			setFeedback('')
		}
	}, [visible])

	const handleConfirm = () => {
		if (required && !feedback.trim()) {
			return
		}
		onConfirm(feedback.trim())
	}

	const canConfirm = !required || feedback.trim().length > 0

	const styles = StyleSheet.create({
		message: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.textSecondary,
			marginBottom: responsive.getResponsiveSpacing().md,
			lineHeight: 20,
		},
		inputContainer: {
			marginBottom: responsive.getResponsiveSpacing().lg,
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
			backgroundColor: colors.primary,
		},
		destructiveButton: {
			backgroundColor: '#ef4444',
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
		<BaseModal
			visible={visible}
			onClose={onClose}
			title={title}>
			<Text style={styles.message}>{message}</Text>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>
					Feedback{required && <Text style={styles.requiredMark}> *</Text>}
				</Text>
				<TextInput
					style={styles.input}
					value={feedback}
					onChangeText={setFeedback}
					placeholder={placeholder}
					placeholderTextColor={colors.placeholder}
					multiline
					numberOfLines={4}
					maxLength={500}
					editable={!isProcessing}
				/>
				<Text style={styles.charCount}>{feedback.length}/500</Text>
			</View>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={[styles.button, styles.cancelButton]}
					onPress={onClose}
					disabled={isProcessing}>
					<Text style={[styles.buttonText, styles.cancelButtonText]}>
						{cancelText}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.button,
						confirmStyle === 'destructive'
							? styles.destructiveButton
							: styles.confirmButton,
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
							{confirmText}
						</Text>
					)}
				</TouchableOpacity>
			</View>
		</BaseModal>
	)
}

export default FeedbackInputModal
