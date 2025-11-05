import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../../types'

export const createOrderDetailsStyles = (
	colors: ThemeColors,
	responsive: ReturnType<
		typeof import('../../hooks/useDeviceOrientation').useResponsiveDimensions
	>
) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		scrollView: {
			flex: 1,
		},
		scrollContent: {
			padding: 16,
		},
		centerContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			padding: 20,
		},
		loadingText: {
			marginTop: 12,
			fontSize: 14,
			color: colors.textSecondary,
		},
		errorTitle: {
			fontSize: 18,
			fontWeight: '600',
			color: colors.text,
			marginBottom: 8,
		},
		errorMessage: {
			fontSize: 14,
			color: colors.textSecondary,
			textAlign: 'center',
			marginBottom: 20,
		},
		retryButton: {
			paddingVertical: 12,
			paddingHorizontal: 24,
			borderRadius: 8,
			backgroundColor: colors.primary,
		},
		retryButtonText: {
			fontSize: 15,
			fontWeight: '600',
			color: colors.surface,
		},
		header: {
			marginBottom: 20,
		},
		headerTitle: {
			fontSize: 24,
			fontWeight: '700',
			color: colors.text,
			marginBottom: 8,
		},
		statusBadge: {
			alignSelf: 'flex-start',
			paddingVertical: 6,
			paddingHorizontal: 12,
			borderRadius: 16,
			backgroundColor: colors.primary + '15',
		},
		statusText: {
			fontSize: 13,
			fontWeight: '600',
			color: colors.primary,
		},
		section: {
			marginBottom: 24,
			padding: 16,
			borderRadius: 12,
			backgroundColor: colors.surface,
			borderWidth: 1,
			borderColor: colors.border,
		},
		sectionTitle: {
			fontSize: 18,
			fontWeight: '600',
			color: colors.text,
			marginBottom: 12,
		},
		infoRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: 8,
			gap: 12,
		},
		infoLabel: {
			fontSize: 14,
			color: colors.textSecondary,
			flex: 1,
		},
		infoValue: {
			fontSize: 14,
			color: colors.text,
			fontWeight: '500',
			flex: 2,
			textAlign: 'right',
		},
		totalValue: {
			fontSize: 16,
			fontWeight: '700',
			color: colors.primary,
		},
		proofSection: {
			marginTop: 12,
			paddingTop: 12,
			borderTopWidth: 1,
			borderTopColor: colors.border,
		},
		proofLabel: {
			fontSize: 14,
			fontWeight: '600',
			color: colors.text,
			marginBottom: 8,
		},
		proofTextContainer: {
			padding: 12,
			borderRadius: 8,
			backgroundColor: colors.background,
			borderWidth: 1,
			borderColor: colors.border,
		},
		proofText: {
			fontSize: 14,
			color: colors.text,
			lineHeight: 20,
		},
		proofImage: {
			width: '100%',
			height: 200,
			borderRadius: 8,
			backgroundColor: colors.background,
		},
		proofTimestamp: {
			fontSize: 12,
			color: colors.textSecondary,
			marginTop: 8,
		},
		proofInputSection: {
			marginTop: 12,
			paddingTop: 12,
			borderTopWidth: 1,
			borderTopColor: colors.border,
		},
		proofNotice: {
			flexDirection: 'row',
			alignItems: 'flex-start',
			padding: 12,
			borderRadius: 8,
			backgroundColor: colors.primary + '10',
			marginBottom: 16,
			gap: 8,
		},
		proofNoticeText: {
			flex: 1,
			fontSize: 13,
			color: colors.text,
			lineHeight: 18,
		},
		proofInputContainer: {
			marginBottom: 16,
		},
		inputLabel: {
			fontSize: 14,
			fontWeight: '600',
			color: colors.text,
			marginBottom: 8,
		},
		proofTextInput: {
			minHeight: 80,
			padding: 12,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.background,
			color: colors.text,
			fontSize: 14,
			textAlignVertical: 'top',
		},
		orText: {
			fontSize: 14,
			fontWeight: '600',
			color: colors.textSecondary,
			textAlign: 'center',
			marginBottom: 16,
		},
		uploadButton: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 8,
			padding: 16,
			borderRadius: 8,
			borderWidth: 2,
			borderStyle: 'dashed',
			borderColor: colors.border,
			backgroundColor: colors.background,
		},
		uploadButtonText: {
			fontSize: 14,
			fontWeight: '500',
			color: colors.primary,
		},
		uploadButtonTextDisabled: {
			color: colors.textSecondary,
		},
		imagePreviewContainer: {
			position: 'relative',
		},
		imagePreview: {
			width: '100%',
			height: 200,
			borderRadius: 8,
			backgroundColor: colors.background,
		},
		removeImageButton: {
			position: 'absolute',
			top: 8,
			right: 8,
			backgroundColor: colors.surface,
			borderRadius: 12,
		},
		submitButton: {
			paddingVertical: 14,
			borderRadius: 8,
			backgroundColor: colors.primary,
			alignItems: 'center',
		},
		submitButtonDisabled: {
			opacity: 0.5,
		},
		submitButtonText: {
			fontSize: 15,
			fontWeight: '600',
			color: colors.surface,
		},
		noteText: {
			fontSize: 14,
			color: colors.text,
			lineHeight: 20,
		},
	})
}
