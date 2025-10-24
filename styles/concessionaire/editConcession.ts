import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createEditConcessionStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		scrollContent: {
			padding: responsive.getResponsivePadding().horizontal,
			paddingBottom: 100, // Space for action buttons
		},
		loadingContainer: {
			flex: 1,
			justifyContent: 'center' as const,
			alignItems: 'center' as const,
			backgroundColor: colors.background,
		},
		loadingText: {
			marginTop: responsive.getResponsiveMargin().small,
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.text,
		},
		// Image Preview Section
		imagePreviewContainer: {
			width: '100%',
			height: 200,
			borderRadius: 12,
			overflow: 'hidden' as const,
			marginBottom: responsive.getResponsiveMargin().large,
			position: 'relative' as const,
		},
		imagePreview: {
			width: '100%',
			height: '100%',
		},
		removeImageButton: {
			position: 'absolute' as const,
			top: 12,
			right: 12,
			backgroundColor: 'rgba(0,0,0,0.6)',
			borderRadius: 20,
			padding: 4,
		},
		imagePlaceholder: {
			width: '100%',
			height: 200,
			borderRadius: 12,
			backgroundColor: colors.card,
			borderWidth: 2,
			borderColor: colors.border,
			borderStyle: 'dashed' as const,
			justifyContent: 'center' as const,
			alignItems: 'center' as const,
			marginBottom: responsive.getResponsiveMargin().large,
		},
		imagePlaceholderText: {
			marginTop: responsive.getResponsiveMargin().small,
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.placeholder,
		},
		// Form Section
		formSection: {
			marginBottom: responsive.getResponsivePadding().vertical,
		},
		inputGroup: {
			marginBottom: responsive.getResponsivePadding().vertical,
		},
		label: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.text,
			marginBottom: responsive.getResponsiveMargin().small,
		},
		required: {
			color: '#f44336',
		},
		input: {
			backgroundColor: colors.card,
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: 10,
			padding: 14,
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.text,
		},
		textArea: {
			height: 180,
			paddingTop: 14,
		},
		textAreaCollapsed: {
			height: 80,
			paddingTop: 10,
		},
		textAreaExpanded: {
			height: 220,
			paddingTop: 14,
		},
		showMoreButton: {
			marginTop: responsive.getResponsiveMargin().small,
		},
		showMoreText: {
			color: colors.primary,
			fontWeight: '600' as const,
			textAlign: 'right' as const,
		},
		hint: {
			fontSize: responsive.getResponsiveFontSize(13),
			color: colors.placeholder,
			marginTop: 6,
			fontStyle: 'italic' as const,
		},
		charCount: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.placeholder,
			marginTop: 4,
			textAlign: 'right' as const,
		},
		// Schedule Button
		scheduleButton: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			padding: responsive.getResponsiveSpacing().md,
			backgroundColor: colors.card,
			borderRadius: 10,
			borderWidth: 1,
			borderColor: colors.border,
		},
		scheduleIcon: {
			marginRight: responsive.getResponsiveMargin().medium,
		},
		scheduleButtonText: {
			flex: 1,
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.text,
		},
		// Action Buttons
		actionButtonsContainer: {
			position: 'absolute' as const,
			bottom: 0,
			left: 0,
			right: 0,
			flexDirection: 'row' as const,
			padding: responsive.getResponsiveSpacing().md,
			backgroundColor: colors.background,
			borderTopWidth: 1,
			borderTopColor: colors.border,
			gap: 12,
		},
		cancelButton: {
			flex: 1,
			padding: responsive.getResponsiveSpacing().md,
			borderRadius: 10,
			borderWidth: 1,
			borderColor: colors.border,
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
		},
		cancelButtonText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.text,
		},
		saveButton: {
			flex: 1,
			flexDirection: 'row' as const,
			padding: responsive.getResponsiveSpacing().md,
			borderRadius: 10,
			backgroundColor: colors.primary,
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
		},
		saveButtonDisabled: {
			opacity: 0.6,
		},
		saveButtonIcon: {
			marginRight: responsive.getResponsiveMargin().small,
		},
		saveButtonText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: '#fff',
		},
	})
