import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createConcessionaireEditMenuItemStyles = (
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

		// Edit Item Container
		editItemContainer: {
			backgroundColor: colors.background,
		},

		// Section Title
		sectionTitle: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.text,
			marginBottom: spacing.xs,
			marginTop: spacing.md,
		},

		// Currency Symbol
		currencySymbol: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.text,
			marginRight: spacing.xs,
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

		// Variations Section Styles
		variationsSectionHeader: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			marginBottom: spacing.xs,
		},
		helpButton: {
			padding: spacing.xs / 2,
		},
		helpButtonText: {
			color: colors.primary,
			fontWeight: '600' as const,
		},
		variationGroupCard: {
			backgroundColor: colors.surface,
			borderRadius: 8,
			padding: spacing.sm + spacing.xs / 2, // 12
			marginBottom: spacing.sm + spacing.xs, // 12
			borderWidth: 1,
			borderColor: colors.border,
		},
		variationGroupHeader: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			marginBottom: spacing.xs,
			gap: spacing.xs,
		},
		variationGroupTitle: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600' as const,
			color: colors.text,
			flex: 1,
		},
		variationGroupNameInputContainer: {
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
		variationGroupNameInput: {
			marginBottom: 8,
			borderWidth: 1,
			borderColor: colors.border,
		},
		modeSelectionHeader: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			marginBottom: spacing.xs / 2,
		},
		modeSelectionLabel: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.text,
			flex: 1,
		},
		modeButtonsContainer: {
			flexDirection: 'row' as const,
			gap: spacing.xs,
			marginBottom: spacing.xs,
			flexWrap: 'wrap' as const,
		},
		modeButton: {
			paddingVertical: spacing.xs / 2, // 6
			paddingHorizontal: spacing.sm + spacing.xs, // 12
			borderRadius: 6,
			borderWidth: 1,
			borderColor: colors.border,
		},
		modeButtonActive: {
			backgroundColor: colors.primary,
		},
		modeButtonInactive: {
			backgroundColor: colors.background,
		},
		modeButtonText: {
			fontSize: responsive.getResponsiveFontSize(12),
			fontWeight: '400' as const,
		},
		modeButtonTextActive: {
			color: '#fff',
			fontWeight: '600' as const,
		},
		modeButtonTextInactive: {
			color: colors.text,
		},
		errorText: {
			color: '#ef4444',
			fontSize: responsive.getResponsiveFontSize(13),
			marginTop: spacing.xs / 2,
			marginBottom: spacing.xs,
		},

		// Add-ons Section Styles
		addonCard: {
			backgroundColor: colors.surface,
			borderRadius: 8,
			padding: spacing.sm + spacing.xs / 2, // 12
			marginBottom: spacing.xs,
			borderWidth: 1,
			borderColor: colors.border,
		},
		addonHeader: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			justifyContent: 'space-between' as const,
			marginBottom: spacing.xs,
		},
		addonTitle: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600' as const,
			color: colors.text,
			flex: 1,
		},
		addonPriceRow: {
			flexDirection: 'row' as const,
			gap: spacing.xs,
			marginBottom: spacing.xs,
		},
		addonPriceLabel: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
			alignSelf: 'center' as const,
		},
		checkboxRow: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			gap: spacing.xs,
		},
		checkbox: {
			width: 20,
			height: 20,
			borderRadius: 4,
			borderWidth: 2,
			justifyContent: 'center' as const,
			alignItems: 'center' as const,
		},
		checkboxUnchecked: {
			borderColor: colors.border,
			backgroundColor: 'transparent',
		},
		checkboxChecked: {
			borderColor: colors.primary,
			backgroundColor: colors.primary,
		},
		checkboxLabel: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
		},
	})
}
