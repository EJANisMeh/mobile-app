import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createConcessionaireAddMenuItemStyles = (
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

		// Add Item Container
		addItemContainer: {
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
		selectionTypeContainer: {
			marginBottom: 8,
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
		variationCategoryInputContainer: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			backgroundColor: colors.surface,
			borderRadius: 8,
			paddingHorizontal: spacing.md,
			paddingVertical: spacing.xs,
			marginBottom: spacing.xs,
			gap: spacing.sm,
			borderWidth: 1,
			borderColor: colors.border,
		},
		variationCategoryText: {
			flex: 1,
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
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

		// Variation multi-limit styles
		multiLimitOuter: {
			marginBottom: spacing.xs,
		},
		multiLimitRow: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			marginBottom: spacing.xs / 2,
		},
		multiLimitLabel: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.text,
			flex: 1,
		},

		// Add-ons Section Styles
		addonSectionTitle: {
			marginTop: 16,
		},
		addonLabelInput: {
			marginBottom: 8,
		},
		addonPriceInput: {
			flex: 1,
		},
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

		// VariationCustomOptions styles
		variationOptionsHeader: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			marginBottom: spacing.xs / 2,
		},
		variationOptionsLabel: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.text,
			flex: 1,
		},
		variationOptionsHelpButton: {
			padding: spacing.xs / 2 + spacing.xs / 4, // 6
		},
		variationOptionsHelpText: {
			color: colors.primary,
			fontWeight: '600' as const,
		},
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
			alignItems: 'center' as const,
			flex: 1,
			backgroundColor: colors.surface,
			borderRadius: 8,
			paddingHorizontal: spacing.xs,
			borderWidth: 1,
			borderColor: colors.border,
		},
		variationOptionPriceSymbol: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
			marginRight: spacing.xs / 2,
		},
		variationOptionPriceInput: {
			flex: 1,
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
			paddingVertical: spacing.xs,
		},

		// VariationExistingItems styles
		existingItemsLabel: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.text,
			marginBottom: spacing.xs / 2,
		},
		existingItemRow: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			justifyContent: 'space-between' as const,
			marginBottom: spacing.xs,
			gap: spacing.xs,
		},
		existingItemText: {
			color: colors.text,
		},

		// NameInput styles
		nameInputError: {
			color: '#ef4444',
			marginTop: spacing.xs / 2,
		},

		// ImagePickerSection styles
		imagePickerHint: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.textSecondary,
			marginBottom: spacing.xs,
		},
		imageScrollView: {
			marginBottom: spacing.md,
		},
		imageContainer: {
			flexDirection: 'row' as const,
			gap: spacing.sm + spacing.xs / 2, // 12
		},
		imageWrapper: {
			width: 100,
			height: 100,
			borderRadius: 8,
			overflow: 'hidden' as const,
			position: 'relative' as const,
		},
		image: {
			width: '100%' as const,
			height: '100%' as const,
		},
		displayImageBadge: {
			position: 'absolute' as const,
			bottom: 4,
			left: 4,
			right: 4,
			backgroundColor: colors.primary,
			borderRadius: 4,
			paddingVertical: 2,
			paddingHorizontal: 4,
			alignItems: 'center' as const,
		},
		displayImageBadgeText: {
			color: '#fff',
			fontSize: responsive.getResponsiveFontSize(10),
			fontWeight: '600' as const,
		},
		imageRemoveButton: {
			position: 'absolute' as const,
			top: 4,
			right: 4,
			backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
		addImageButtonText: {
			color: colors.textSecondary,
			fontSize: responsive.getResponsiveFontSize(11),
			marginTop: spacing.xs / 2,
		},

		// DescriptionInput styles
		descriptionInputContainer: {
			minHeight: 80,
		},
		descriptionInput: {
			textAlignVertical: 'top' as const,
		},

		// CategorySelector styles
		categoryFooter: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
			paddingVertical: spacing.sm + spacing.xs / 2, // 12
			borderTopWidth: 1,
			borderTopColor: colors.border,
			gap: spacing.xs,
		},
		categoryFooterText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.primary,
		},
		categoryPlaceholder: {
			color: colors.textSecondary,
		},

		// MenuItemCard styles
		menuItemCard: {
			backgroundColor: colors.surface,
			borderRadius: 8,
			padding: spacing.md,
			marginBottom: spacing.md,
			borderWidth: 1,
			borderColor: colors.border,
		},
		menuItemRow: {
			flexDirection: 'row' as const,
			gap: margin.medium,
		},
		menuItemImageContainer: {
			width: 80,
			height: 80,
			borderRadius: 8,
			overflow: 'hidden' as const,
			backgroundColor: colors.background,
		},
		menuItemImage: {
			width: '100%' as const,
			height: '100%' as const,
		},
		menuItemImagePlaceholder: {
			width: '100%' as const,
			height: '100%' as const,
			justifyContent: 'center' as const,
			alignItems: 'center' as const,
		},
		menuItemInfo: {
			flex: 1,
			justifyContent: 'center' as const,
		},
		menuItemName: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.text,
			marginBottom: spacing.xs / 2,
		},
		menuItemPrice: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.textSecondary,
			marginBottom: spacing.xs / 2,
		},
		menuItemStatusBadge: {
			alignSelf: 'flex-start' as const,
			paddingHorizontal: spacing.xs,
			paddingVertical: spacing.xs / 4,
			borderRadius: 4,
		},
		menuItemStatusBadgeAvailable: {
			backgroundColor: 'rgba(34, 197, 94, 0.1)',
		},
		menuItemStatusBadgeUnavailable: {
			backgroundColor: 'rgba(239, 68, 68, 0.1)',
		},
		menuItemStatusText: {
			fontSize: responsive.getResponsiveFontSize(12),
			fontWeight: '600' as const,
		},
		menuItemStatusTextAvailable: {
			color: '#22c55e',
		},
		menuItemStatusTextUnavailable: {
			color: '#ef4444',
		},
		menuItemActions: {
			justifyContent: 'center' as const,
		},
		menuItemMenuButton: {
			padding: spacing.xs,
		},
		menuModalOverlay: {
			flex: 1,
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			justifyContent: 'flex-end' as const,
		},
		menuModalContent: {
			backgroundColor: colors.surface,
			borderTopLeftRadius: 16,
			borderTopRightRadius: 16,
			paddingBottom: spacing.lg,
		},
		menuModalOption: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			paddingVertical: spacing.md,
			paddingHorizontal: spacing.lg,
			gap: spacing.md,
		},
		menuModalOptionText: {
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.text,
		},
		menuModalOptionTextDestructive: {
			color: '#ef4444',
		},
		variationsContainer: {
			marginTop: spacing.md,
			paddingTop: spacing.md,
			borderTopWidth: 1,
			borderTopColor: colors.border,
		},
		variationGroupContainer: {
			marginBottom: spacing.md,
		},
		variationGroupName: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600' as const,
			color: colors.text,
			marginBottom: spacing.xs,
		},
		variationOptionContainer: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			justifyContent: 'space-between' as const,
			paddingVertical: spacing.xs / 2,
			paddingHorizontal: spacing.sm,
			marginBottom: spacing.xs / 2,
			backgroundColor: colors.background,
			borderRadius: 6,
		},
		variationOptionName: {
			fontSize: responsive.getResponsiveFontSize(13),
			color: colors.text,
			flex: 1,
		},
		variationOptionPrice: {
			fontSize: responsive.getResponsiveFontSize(13),
			color: colors.textSecondary,
			marginRight: spacing.xs,
		},
		toggleVariationsButton: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
			paddingVertical: spacing.xs,
			marginTop: spacing.xs,
			gap: spacing.xs / 2,
		},
		toggleVariationsText: {
			fontSize: responsive.getResponsiveFontSize(13),
			color: colors.primary,
			fontWeight: '600' as const,
		},

		// MenuItemCard specific styles
		menuItemStatus: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			gap: spacing.xs / 2,
		},
		statusIndicator: {
			width: 8,
			height: 8,
			borderRadius: 4,
		},
		statusIndicatorAvailable: {
			backgroundColor: '#22c55e',
		},
		statusIndicatorUnavailable: {
			backgroundColor: '#ef4444',
		},
		statusText: {
			fontSize: responsive.getResponsiveFontSize(12),
			fontWeight: '600' as const,
		},
		statusTextAvailable: {
			color: '#22c55e',
		},
		statusTextUnavailable: {
			color: '#ef4444',
		},
		menuButton: {
			padding: spacing.xs,
		},
		dropdownModalOverlay: {
			flex: 1,
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			justifyContent: 'center' as const,
			alignItems: 'center' as const,
		},
		dropdownModalMenu: {
			backgroundColor: colors.surface,
			borderRadius: 12,
			minWidth: 200,
			maxWidth: '80%' as const,
			padding: spacing.sm,
			elevation: 5,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
		},
		dropdownMenuHeader: {
			paddingBottom: spacing.xs,
			marginBottom: spacing.xs,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
		},
		dropdownMenuTitle: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600' as const,
			color: colors.text,
		},
		dropdownItem: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			paddingVertical: spacing.sm,
			paddingHorizontal: spacing.xs,
			gap: spacing.sm,
			borderRadius: 6,
		},
		dropdownText: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
		},
		dropdownTextDanger: {
			color: '#dc3545',
		},
		dropdownDivider: {
			height: 1,
			backgroundColor: colors.border,
			marginVertical: spacing.xs / 2,
		},
		variationGroup: {
			marginBottom: spacing.sm,
		},
		variationOption: {
			flexDirection: 'row' as const,
			justifyContent: 'space-between' as const,
			alignItems: 'center' as const,
			paddingVertical: spacing.xs,
			paddingHorizontal: spacing.sm,
			marginBottom: spacing.xs / 2,
			backgroundColor: colors.background,
			borderRadius: 6,
		},
		variationOptionInfo: {
			flex: 1,
			flexDirection: 'row' as const,
			justifyContent: 'space-between' as const,
			alignItems: 'center' as const,
			marginRight: spacing.sm,
		},
		availabilityToggle: {
			paddingHorizontal: spacing.sm,
			paddingVertical: spacing.xs / 2,
			borderRadius: 12,
			backgroundColor: 'rgba(239, 68, 68, 0.1)',
		},
		availabilityToggleActive: {
			backgroundColor: 'rgba(34, 197, 94, 0.1)',
		},
		availabilityToggleText: {
			fontSize: responsive.getResponsiveFontSize(11),
			fontWeight: '600' as const,
			color: '#ef4444',
		},
		availabilityToggleTextActive: {
			color: '#22c55e',
		},
	})
}
