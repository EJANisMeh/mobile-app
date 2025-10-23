import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createProfileCreationStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		content: {
			flex: 1,
			justifyContent: 'center' as const,
			paddingHorizontal: 24,
			paddingVertical: responsive.getResponsivePadding().vertical,
			maxWidth: responsive.getContentMaxWidth(),
			width: '100%' as const,
			alignSelf: 'center' as const,
		},
		title: {
			fontSize: responsive.getResponsiveFontSize(32),
			fontWeight: 'bold' as const,
			color: colors.text,
			marginBottom: responsive.getResponsiveMargin().small,
			textAlign: 'center' as const,
		},
		subtitle: {
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.textSecondary,
			marginBottom: responsive.getResponsiveMargin().medium,
			textAlign: 'center' as const,
		},
		form: {
			marginBottom: 24,
		},
		input: {
			backgroundColor: colors.surface,
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: 8,
			padding: 16,
			fontSize: 16,
			color: colors.text,
			marginBottom: 16,
		},
		imagePickerButton: {
			backgroundColor: colors.surface,
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: 8,
			padding: 16,
			marginBottom: 16,
			alignItems: 'center' as const,
		},
		imagePickerText: {
			fontSize: 16,
			color: colors.textSecondary,
		},
		selectedImageText: {
			fontSize: 14,
			color: colors.primary,
			marginTop: 4,
		},
		contactDetailsContainer: {
			marginBottom: 16,
		},
		contactDetailsLabel: {
			fontSize: 14,
			fontWeight: '600' as const,
			color: colors.text,
			marginBottom: 8,
		},
		contactDetailsHint: {
			fontSize: 12,
			color: colors.textSecondary,
			marginBottom: 8,
		},
		addContactButton: {
			backgroundColor: colors.surface,
			borderWidth: 1,
			borderColor: colors.primary,
			borderRadius: 8,
			padding: 12,
			alignItems: 'center' as const,
			marginTop: 8,
		},
		addContactButtonText: {
			fontSize: 14,
			color: colors.primary,
			fontWeight: '600' as const,
		},
		contactItem: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			marginBottom: 8,
		},
		contactInput: {
			flex: 1,
			backgroundColor: colors.surface,
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: 8,
			padding: 12,
			fontSize: 14,
			color: colors.text,
			marginRight: 8,
		},
		removeContactButton: {
			backgroundColor: colors.error,
			borderRadius: 8,
			padding: 8,
			justifyContent: 'center' as const,
			alignItems: 'center' as const,
			width: 36,
			height: 36,
		},
		removeContactText: {
			color: colors.textOnPrimary,
			fontSize: 18,
			fontWeight: 'bold' as const,
		},
		submitButton: {
			backgroundColor: colors.primary,
			borderRadius: 8,
			padding: 16,
			alignItems: 'center' as const,
			marginTop: 8,
		},
		submitButtonText: {
			color: colors.textOnPrimary,
			fontSize: 16,
			fontWeight: 'bold' as const,
		},
		cancelButton: {
			borderWidth: 2,
			borderColor: colors.border,
			borderRadius: 8,
			paddingVertical: 14,
			alignItems: 'center' as const,
			marginTop: 12,
		},
		cancelButtonText: {
			color: colors.textSecondary,
			fontSize: 16,
			fontWeight: '600' as const,
		},
		disabledButton: {
			backgroundColor: colors.border,
			opacity: 0.6,
		},
	})
