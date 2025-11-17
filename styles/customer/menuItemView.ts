import { StyleSheet } from 'react-native'

export const createCustomerMenuItemViewStyles = (
	colors: any,
	responsive: any
) => {
	const spacing = responsive.getResponsiveSpacing()
	const padding = responsive.getResponsivePadding()

	return StyleSheet.create({
		// Back Button
		backButton: {
			paddingVertical: spacing.sm,
			paddingHorizontal: spacing.md,
			marginBottom: spacing.sm,
			alignSelf: 'flex-start',
		},
		backButtonText: {
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.primary,
			fontWeight: '600',
		},

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
			position: 'relative',
		},
		mainImage: {
			width: '100%',
			height: '100%',
		},
		imageNavButton: {
			position: 'absolute',
			top: '50%',
			transform: [{ translateY: -20 }],
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			borderRadius: 20,
			width: 40,
			height: 40,
			justifyContent: 'center',
			alignItems: 'center',
			zIndex: 10,
		},
		imageNavButtonLeft: {
			left: spacing.sm,
		},
		imageNavButtonRight: {
			right: spacing.sm,
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
		priceQuantityRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'flex-start',
			gap: spacing.md,
		},
		priceSection: {
			flex: 1,
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
		quantitySection: {
			flex: 1,
		},
		quantityLabel: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.textSecondary,
			marginBottom: spacing.xs,
			textTransform: 'uppercase',
		},
		quantityControls: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: 8,
			paddingHorizontal: spacing.xs,
			paddingVertical: spacing.xs,
			backgroundColor: colors.surface,
		},
		quantityButton: {
			padding: spacing.xs,
			borderRadius: 6,
			backgroundColor: colors.surfaceSecondary,
		},
		quantityButtonDisabled: {
			opacity: 0.5,
		},
		quantityValue: {
			fontSize: responsive.getResponsiveFontSize(18),
			fontWeight: '600',
			color: colors.text,
			minWidth: 40,
			textAlign: 'center',
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
		scheduleSection: {
			marginTop: spacing.md,
		},
		scheduleLabel: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.textSecondary,
			marginBottom: spacing.xs,
			textTransform: 'uppercase',
		},
		availabilityBadge: {
			alignSelf: 'flex-start',
			paddingHorizontal: spacing.md,
			paddingVertical: spacing.xs,
			borderRadius: 20,
			marginBottom: spacing.sm,
		},
		availabilityBadgeAvailable: {
			backgroundColor: colors.successLight ?? colors.success + '20',
		},
		availabilityBadgeScheduled: {
			backgroundColor: colors.warningLight ?? colors.warning + '20',
		},
		availabilityBadgeUnavailable: {
			backgroundColor: colors.errorLight ?? colors.error + '20',
		},
		availabilityBadgeText: {
			fontSize: responsive.getResponsiveFontSize(13),
			fontWeight: '600',
		},
		availabilityBadgeTextAvailable: {
			color: colors.success,
		},
		availabilityBadgeTextScheduled: {
			color: colors.warning,
		},
		availabilityBadgeTextUnavailable: {
			color: colors.error,
		},
		scheduleDayGroups: {
			gap: spacing.md,
		},
		scheduleDayGroup: {
			gap: spacing.xs,
		},
		scheduleGroupLabel: {
			fontSize: responsive.getResponsiveFontSize(13),
			fontWeight: '600',
			color: colors.text,
		},
		scheduleChipRow: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			gap: spacing.xs,
		},
		scheduleChip: {
			paddingHorizontal: spacing.sm,
			paddingVertical: spacing.xs,
			borderRadius: 16,
			borderWidth: 1.5,
		},
		scheduleChipAvailable: {
			borderColor: colors.border,
			backgroundColor: colors.surfaceSecondary,
		},
		scheduleChipTodayAvailable: {
			borderColor: colors.success,
			backgroundColor: colors.successLight ?? colors.success + '20',
		},
		scheduleChipTodayUnavailable: {
			borderColor: colors.error,
			backgroundColor: colors.errorLight ?? colors.error + '20',
		},
		scheduleChipUnavailable: {
			borderColor: colors.border,
			backgroundColor: colors.surfaceSecondary,
			opacity: 0.5,
		},
		scheduleChipText: {
			fontSize: responsive.getResponsiveFontSize(12),
			fontWeight: '600',
			color: colors.text,
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
		categoryBackButton: {
			backgroundColor: colors.surfaceSecondary,
			paddingVertical: spacing.sm,
			paddingHorizontal: spacing.md,
			borderRadius: 8,
			marginBottom: spacing.sm,
			borderWidth: 1,
			borderColor: colors.border,
		},
		categoryBackButtonText: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.primary,
			fontWeight: '500',
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
		optionItemImage: {
			width: 50,
			height: 50,
			borderRadius: 8,
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
		optionNameWrapper: {
			flex: 1,
		},
		optionNameDisabled: {
			color: colors.textSecondary,
		},
		outOfStockText: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.error,
			fontStyle: 'italic',
			marginTop: 2,
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
		radioButtonDisabled: {
			borderColor: colors.border,
			backgroundColor: colors.surfaceSecondary,
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

		// Modal button for category and multi-category modes
		modalButton: {
			paddingVertical: spacing.md,
			paddingHorizontal: spacing.md,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.border,
			marginBottom: spacing.sm,
		},
		modalButtonText: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '500',
		},

		// Selected items display
		selectedItemsList: {
			gap: spacing.sm,
			marginTop: spacing.xs,
		},
		selectedItemContainer: {
			paddingVertical: spacing.sm,
			paddingHorizontal: spacing.md,
			backgroundColor: colors.surfaceSecondary,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.border,
		},
		selectedItemHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: spacing.xs,
		},
		selectedItemName: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600',
			flex: 1,
		},
		selectedItemPrice: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600',
			marginLeft: spacing.sm,
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
		addonItemImage: {
			width: 50,
			height: 50,
			borderRadius: 8,
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

		// Customer Request Section
		customerRequestSection: {
			marginBottom: spacing.lg,
			backgroundColor: colors.surface,
			borderRadius: 12,
			padding: padding.md,
			borderWidth: 1,
			borderColor: colors.border,
		},
		sectionHeaderRow: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: spacing.xs,
			marginBottom: spacing.xs,
		},
		customerRequestHint: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.textSecondary,
			marginBottom: spacing.sm,
			fontStyle: 'italic',
		},
		customerRequestInput: {
			backgroundColor: colors.surfaceSecondary,
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: 8,
			padding: spacing.sm,
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
			minHeight: 80,
		},
		characterCount: {
			fontSize: responsive.getResponsiveFontSize(11),
			color: colors.textSecondary,
			textAlign: 'right',
			marginTop: spacing.xs,
		},

		// Actions Section
		actionsContainer: {
			flexDirection: 'row',
			padding: padding.md,
			gap: spacing.sm,
			alignItems: 'center',
			marginTop: spacing.lg,
		},
		helpButton: {
			backgroundColor: colors.surfaceSecondary,
			paddingVertical: spacing.md,
			paddingHorizontal: spacing.sm,
			borderRadius: 8,
			alignItems: 'center',
			justifyContent: 'center',
			borderWidth: 1,
			borderColor: colors.border,
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
		disabledButton: {
			opacity: 0.6,
		},
		disabledPrimaryButton: {
			opacity: 0.7,
		},
		disabledButtonText: {
			opacity: 0.7,
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
