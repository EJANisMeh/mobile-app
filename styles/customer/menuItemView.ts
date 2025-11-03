import { StyleSheet } from 'react-native'

export const createCustomerMenuItemViewStyles = (
	colors: any,
	responsive: any
) => {
	const spacing = responsive.getResponsiveSpacing()
	const padding = responsive.getResponsivePadding()

	return StyleSheet.create({
		// Header Section
		headerContainer: {
			marginBottom: spacing.md,
		},
		itemName: {
			fontSize: responsive.getResponsiveFontSize(24),
			fontWeight: 'bold',
			color: colors.text,
			marginBottom: spacing.xs,
		},
		categories: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.textSecondary,
		},

		// Image Section
		imageContainer: {
			marginBottom: spacing.lg,
			borderRadius: 12,
			overflow: 'hidden',
			backgroundColor: colors.surfaceSecondary,
		},
		imageWrapper: {
			width: '100%',
			aspectRatio: 16 / 9,
		},
		mainImage: {
			width: '100%',
			height: '100%',
		},
		imageIndicators: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			paddingVertical: spacing.sm,
			gap: spacing.xs,
		},
		indicator: {
			width: 8,
			height: 8,
			borderRadius: 4,
			backgroundColor: colors.border,
		},
		activeIndicator: {
			width: 24,
			backgroundColor: colors.primary,
		},

		// Info Section
		infoContainer: {
			marginBottom: spacing.lg,
		},
		priceSection: {
			marginBottom: spacing.md,
		},
		priceLabel: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.textSecondary,
			marginBottom: spacing.xs,
			textTransform: 'uppercase',
		},
		basePrice: {
			fontSize: responsive.getResponsiveFontSize(28),
			fontWeight: 'bold',
			color: colors.primary,
		},
		descriptionSection: {
			marginTop: spacing.md,
		},
		descriptionLabel: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600',
			color: colors.text,
			marginBottom: spacing.xs,
		},
		description: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.textSecondary,
			lineHeight: responsive.getResponsiveFontSize(20),
		},

		// Variations Section
		variationsContainer: {
			marginBottom: spacing.lg,
			backgroundColor: colors.surface,
			borderRadius: 12,
			padding: padding.md,
			borderWidth: 1,
			borderColor: colors.border,
		},
		sectionTitle: {
			fontSize: responsive.getResponsiveFontSize(18),
			fontWeight: '600',
			color: colors.text,
			marginBottom: spacing.md,
		},
		variationGroup: {
			marginBottom: spacing.md,
		},
		variationGroupHeader: {
			flexDirection: 'row',
			alignItems: 'center',
			marginBottom: spacing.sm,
			gap: spacing.xs,
		},
		variationGroupName: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600',
			color: colors.text,
		},
		multiLimitText: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.textSecondary,
			fontStyle: 'italic',
		},
		optionsList: {
			gap: spacing.xs,
		},
		optionItem: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingVertical: spacing.xs,
			paddingHorizontal: spacing.sm,
			backgroundColor: colors.surfaceSecondary,
			borderRadius: 8,
		},
		optionItemButton: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingVertical: spacing.sm,
			paddingHorizontal: spacing.sm,
			backgroundColor: colors.surfaceSecondary,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.border,
			gap: spacing.sm,
		},
		optionItemSelected: {
			backgroundColor: colors.primaryLight,
			borderColor: colors.primary,
		},
		optionItemDisabled: {
			opacity: 0.5,
		},
		optionContent: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			flex: 1,
		},
		optionName: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
			flex: 1,
		},
		optionNameDisabled: {
			color: colors.textSecondary,
		},
		optionPrice: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600',
			color: colors.primary,
			marginLeft: spacing.sm,
		},
		// Radio Button
		radioButton: {
			width: 20,
			height: 20,
			borderRadius: 10,
			borderWidth: 2,
			borderColor: colors.primary,
			alignItems: 'center',
			justifyContent: 'center',
		},
		radioButtonInner: {
			width: 10,
			height: 10,
			borderRadius: 5,
			backgroundColor: colors.primary,
		},
		// Checkbox
		checkbox: {
			width: 20,
			height: 20,
			borderRadius: 4,
			borderWidth: 2,
			borderColor: colors.primary,
			alignItems: 'center',
			justifyContent: 'center',
		},
		checkboxChecked: {
			backgroundColor: colors.primary,
		},
		checkboxDisabled: {
			borderColor: colors.border,
			backgroundColor: colors.surfaceSecondary,
		},
		checkboxCheck: {
			fontSize: responsive.getResponsiveFontSize(12),
			fontWeight: 'bold',
			color: colors.surface,
		},

		// Add-ons Section
		addonsContainer: {
			marginBottom: spacing.lg,
			backgroundColor: colors.surface,
			borderRadius: 12,
			padding: padding.md,
			borderWidth: 1,
			borderColor: colors.border,
		},
		addonsList: {
			gap: spacing.xs,
		},
		addonItem: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingVertical: spacing.sm,
			paddingHorizontal: spacing.sm,
			backgroundColor: colors.surfaceSecondary,
			borderRadius: 8,
		},
		addonItemButton: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingVertical: spacing.sm,
			paddingHorizontal: spacing.sm,
			backgroundColor: colors.surfaceSecondary,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.border,
			gap: spacing.sm,
		},
		addonItemSelected: {
			backgroundColor: colors.primaryLight,
			borderColor: colors.primary,
		},
		addonInfo: {
			flexDirection: 'row',
			alignItems: 'center',
			flex: 1,
			gap: spacing.xs,
		},
		addonContent: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			flex: 1,
		},
		addonName: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
		},
		requiredBadge: {
			fontSize: responsive.getResponsiveFontSize(10),
			fontWeight: '600',
			color: colors.error,
			backgroundColor: colors.errorLight,
			paddingHorizontal: spacing.xs,
			paddingVertical: 2,
			borderRadius: 4,
			textTransform: 'uppercase',
		},
		addonPrice: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600',
			color: colors.primary,
			marginLeft: spacing.sm,
		},

		// Actions Section
		actionsContainer: {
			flexDirection: 'row',
			padding: padding.md,
			gap: spacing.sm,
			borderTopWidth: 1,
			borderTopColor: colors.border,
			backgroundColor: colors.surface,
		},
		addToCartButton: {
			flex: 1,
			backgroundColor: colors.surfaceSecondary,
			paddingVertical: spacing.md,
			borderRadius: 8,
			alignItems: 'center',
			justifyContent: 'center',
			borderWidth: 1,
			borderColor: colors.primary,
		},
		addToCartText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600',
			color: colors.primary,
		},
		orderNowButton: {
			flex: 1,
			backgroundColor: colors.primary,
			paddingVertical: spacing.md,
			borderRadius: 8,
			alignItems: 'center',
			justifyContent: 'center',
		},
		orderNowText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600',
			color: colors.surface,
		},
		unavailableContainer: {
			flex: 1,
			backgroundColor: colors.surfaceSecondary,
			paddingVertical: spacing.md,
			borderRadius: 8,
			alignItems: 'center',
			justifyContent: 'center',
			borderWidth: 1,
			borderColor: colors.border,
		},
		unavailableText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600',
			color: colors.textSecondary,
		},
		// Loading and Error states
		loadingContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: colors.background,
		},
		loadingText: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.textSecondary,
			marginTop: spacing.md,
		},
	})
}
