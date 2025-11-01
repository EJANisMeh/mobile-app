import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createConcessionaireCategoryManagementStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) => {
	const spacing = responsive.getResponsiveSpacing()
	const padding = responsive.getResponsivePadding()
	const margin = responsive.getResponsiveMargin()

	return StyleSheet.create({
		// Loading State
		loadingContainer: {
			flex: 1,
			backgroundColor: colors.background,
			justifyContent: 'center' as const,
			alignItems: 'center' as const,
			paddingHorizontal: padding.horizontal,
		},
		loadingText: {
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.textSecondary,
			marginTop: margin.small,
		},

		// Category Management Container
		categoryManagementContainer: {
			backgroundColor: colors.background,
		},

		// Category Input
		categoryInputContainer: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			backgroundColor: colors.surface,
			borderRadius: 8,
			paddingHorizontal: spacing.md,
			paddingVertical: spacing.xs,
			marginBottom: spacing.sm,
			gap: spacing.sm,
			borderWidth: 1,
			borderColor: colors.border,
		},
		categoryInput: {
			flex: 1,
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.text,
			paddingVertical: spacing.xs,
		},
		removeIconButton: {
			padding: spacing.xs,
		},

		// Add Category Button
		addCategoryButton: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
			backgroundColor: colors.surface,
			paddingVertical: spacing.md,
			borderRadius: 8,
			borderWidth: 1,
			borderStyle: 'dashed' as const,
			borderColor: colors.primary,
			marginTop: spacing.sm,
			marginBottom: spacing.lg,
			gap: spacing.xs,
		},
		addCategoryButtonDisabled: {
			borderColor: colors.border,
			opacity: 0.5,
		},
		addCategoryButtonText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.primary,
		},
		addCategoryButtonTextDisabled: {
			color: colors.textSecondary,
		},

		// Bottom Actions
		bottomActions: {
			flexDirection: 'row' as const,
			gap: spacing.sm,
			paddingTop: spacing.md,
			borderTopWidth: 1,
			borderTopColor: colors.border,
		},
		cancelButton: {
			flex: 1,
			paddingVertical: spacing.md,
			borderRadius: 8,
			backgroundColor: colors.surface,
			borderWidth: 1,
			borderColor: colors.border,
			alignItems: 'center' as const,
		},
		cancelButtonText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.text,
		},
		saveButton: {
			flex: 1,
			paddingVertical: spacing.md,
			borderRadius: 8,
			backgroundColor: colors.primary,
			alignItems: 'center' as const,
		},
		saveButtonDisabled: {
			opacity: 0.5,
		},
		saveButtonText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: '#fff',
		},
	})
}
