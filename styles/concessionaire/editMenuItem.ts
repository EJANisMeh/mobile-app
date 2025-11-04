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
		scheduleSection: {
			backgroundColor: colors.surface,
			borderRadius: 8,
			padding: spacing.sm + spacing.xs / 2,
			borderWidth: 1,
			borderColor: colors.border,
			marginTop: spacing.sm,
			marginBottom: spacing.md,
			gap: spacing.xs,
		},
		scheduleHeaderRow: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			justifyContent: 'space-between' as const,
		},
		scheduleActionsRow: {
			flexDirection: 'row' as const,
			gap: spacing.xs,
		},
		scheduleActionButton: {
			paddingVertical: spacing.xs / 2,
			paddingHorizontal: spacing.sm,
			borderRadius: 6,
			backgroundColor: colors.background,
			borderWidth: 1,
			borderColor: colors.border,
		},
		scheduleActionText: {
			fontSize: responsive.getResponsiveFontSize(12),
			fontWeight: '600' as const,
			color: colors.primary,
		},
		scheduleSummaryText: {
			fontSize: responsive.getResponsiveFontSize(13),
			color: colors.textSecondary,
		},
		scheduleDayGrid: {
			flexDirection: 'row' as const,
			flexWrap: 'wrap' as const,
			gap: spacing.xs,
		},
		scheduleDayButton: {
			minWidth: 52,
			paddingVertical: spacing.xs / 2,
			borderRadius: 6,
			borderWidth: 1,
			borderColor: colors.border,
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
			backgroundColor: colors.background,
		},
		scheduleDayButtonActive: {
			backgroundColor: colors.primary,
			borderColor: colors.primary,
		},
		scheduleDayText: {
			fontSize: responsive.getResponsiveFontSize(13),
			fontWeight: '600' as const,
			color: colors.text,
		},
		scheduleDayTextActive: {
			color: colors.textOnPrimary,
		},
		scheduleHintText: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.textSecondary,
		},
		scheduleErrorText: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.error,
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

		// Image Picker Section
		imageHintText: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.textSecondary,
			marginBottom: spacing.xs,
		},
		imageScrollView: {
			marginBottom: spacing.md,
		},
		imageContainer: {
			flexDirection: 'row' as const,
			gap: spacing.sm + spacing.xs, // 12
		},
		imageWrapper: {
			width: 100,
			height: 100,
			borderRadius: 8,
			overflow: 'hidden' as const,
			position: 'relative' as const,
		},
		imageWrapperActive: {
			borderWidth: 3,
		},
		imageWrapperInactive: {
			borderWidth: 0,
		},
		image: {
			width: '100%',
			height: '100%',
		},
		displayBadge: {
			position: 'absolute' as const,
			bottom: spacing.xs / 2,
			left: spacing.xs / 2,
			right: spacing.xs / 2,
			backgroundColor: colors.primary,
			borderRadius: 4,
			paddingVertical: 2,
			paddingHorizontal: spacing.xs / 2,
			alignItems: 'center' as const,
		},
		displayBadgeText: {
			fontSize: responsive.getResponsiveFontSize(10),
			fontWeight: '600' as const,
			color: '#fff',
		},
		removeImageButton: {
			position: 'absolute' as const,
			top: spacing.xs / 2,
			right: spacing.xs / 2,
			backgroundColor: 'rgba(0,0,0,0.6)',
			borderRadius: 12,
			width: 24,
			height: 24,
			justifyContent: 'center' as const,
			alignItems: 'center' as const,
		},
		addImageButton: {
			width: 100,
			height: 100,
			borderRadius: 8,
			borderWidth: 2,
			borderStyle: 'dashed' as const,
			borderColor: colors.border,
			backgroundColor: colors.surface,
			justifyContent: 'center' as const,
			alignItems: 'center' as const,
		},
		addImageText: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.textSecondary,
			marginTop: spacing.xs / 2,
		},

		// Variation Option Row
		variationOptionRow: {
			flexDirection: 'row' as const,
			gap: spacing.xs,
			marginBottom: spacing.xs,
			alignItems: 'center' as const,
		},
		variationOptionNameInput: {
			flex: 2,
		},
		variationOptionPriceContainer: {
			flexDirection: 'row' as const,
			flex: 1,
			gap: spacing.xs / 2,
		},
		variationOptionPriceSymbol: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
			alignSelf: 'center' as const,
		},
		variationOptionPriceInput: {
			flex: 1,
		},

		// Variation Existing Items
		existingItemRow: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			justifyContent: 'space-between' as const,
			marginBottom: spacing.xs,
			gap: spacing.xs,
		},
		existingItemName: {
			color: colors.text,
			fontSize: responsive.getResponsiveFontSize(14),
		},

		// Common Text Styles
		labelSmall: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.text,
		},
		labelSmallFlex: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.text,
			flex: 1,
		},
		errorTextInline: {
			color: '#ef4444',
			fontSize: responsive.getResponsiveFontSize(13),
		},
		errorTextMargin: {
			color: '#ef4444',
			fontSize: responsive.getResponsiveFontSize(13),
			marginTop: spacing.xs / 2,
		},
		errorTextMarginBottom: {
			color: '#ef4444',
			fontSize: responsive.getResponsiveFontSize(13),
			marginBottom: spacing.xs,
		},

		// Header with Action
		headerWithAction: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			marginBottom: spacing.xs / 2,
		},
		flexOne: {
			flex: 1,
		},

		// Category Filter Margin
		categoryFilterMargin: {
			marginBottom: spacing.xs,
		},

		// Addon Input Margin
		addonInputMargin: {
			marginBottom: spacing.xs,
		},

		// Multi Limit Container
		multiLimitContainer: {
			marginBottom: spacing.xs,
		},

		// Variation Add Button Inline
		variationAddButtonInline: {
			marginTop: spacing.xs / 2,
			marginBottom: 0,
		},
	})
}
