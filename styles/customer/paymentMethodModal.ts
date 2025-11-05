import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../../types'

export const createPaymentMethodModalStyles = (
	colors: ThemeColors,
	responsive: ReturnType<
		typeof import('../../hooks/useDeviceOrientation').useResponsiveDimensions
	>
) => {
	return StyleSheet.create({
		scrollArea: {
			maxHeight: 400,
		},
		scrollContent: {
			paddingBottom: 8,
		},
		helperText: {
			fontSize: 14,
			color: colors.textSecondary,
			marginBottom: 16,
			lineHeight: 20,
		},
		methodsContainer: {
			gap: 12,
		},
		methodCard: {
			flexDirection: 'row',
			alignItems: 'center',
			padding: 16,
			borderRadius: 12,
			borderWidth: 2,
			borderColor: colors.border,
			backgroundColor: colors.surface,
		},
		methodCardSelected: {
			borderColor: colors.primary,
			backgroundColor: colors.primary + '08',
		},
		methodIcon: {
			marginRight: 16,
		},
		methodInfo: {
			flex: 1,
		},
		methodName: {
			fontSize: 16,
			fontWeight: '600',
			color: colors.text,
			marginBottom: 4,
		},
		methodNameSelected: {
			color: colors.primary,
		},
		methodDescription: {
			fontSize: 13,
			color: colors.textSecondary,
		},
		proofBadge: {
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: 6,
			gap: 4,
		},
		proofBadgeText: {
			fontSize: 12,
			color: colors.textSecondary,
			fontStyle: 'italic',
		},
		proofNotice: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 8,
			marginTop: 16,
			padding: 12,
			borderRadius: 8,
			backgroundColor: colors.primary + '10',
		},
		proofNoticeText: {
			flex: 1,
			fontSize: 13,
			color: colors.text,
			lineHeight: 18,
		},
		proofInputContainer: {
			marginTop: 16,
		},
		proofInputLabel: {
			fontSize: 14,
			fontWeight: '600',
			color: colors.text,
			marginBottom: 8,
		},
		proofTextInput: {
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: 8,
			padding: 12,
			fontSize: 14,
			color: colors.text,
			backgroundColor: colors.surface,
			minHeight: 80,
			textAlignVertical: 'top',
		},
		imagePickerButton: {
			borderWidth: 2,
			borderColor: colors.border,
			borderStyle: 'dashed',
			borderRadius: 8,
			padding: 24,
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: colors.surface,
		},
		imagePickerText: {
			fontSize: 14,
			color: colors.primary,
			marginTop: 8,
			fontWeight: '500',
		},
		imagePreviewContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: 12,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.surface,
		},
		imageSelectedText: {
			fontSize: 14,
			color: colors.text,
			fontWeight: '500',
		},
		removeImageButton: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 4,
		},
		removeImageText: {
			fontSize: 14,
			color: colors.error,
			fontWeight: '500',
		},
		actionsRow: {
			flexDirection: 'row',
			justifyContent: 'flex-end',
			marginTop: 24,
			paddingTop: 16,
			borderTopWidth: 1,
			borderTopColor: colors.border,
		},
		actionButton: {
			paddingVertical: 12,
			paddingHorizontal: 20,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.primary,
		},
		actionButtonSpacing: {
			marginLeft: 12,
		},
		cancelButton: {
			backgroundColor: colors.surface,
		},
		confirmButton: {
			backgroundColor: colors.primary,
			borderColor: colors.primary,
		},
		confirmButtonDisabled: {
			opacity: 0.6,
		},
		actionButtonText: {
			fontSize: 15,
			fontWeight: '600',
			color: colors.text,
		},
		confirmButtonText: {
			color: colors.surface,
		},
		confirmButtonTextDisabled: {
			color: colors.border,
		},
	})
}
