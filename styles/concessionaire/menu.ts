import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createConcessionaireMenuStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) => {
	const spacing = responsive.getResponsiveSpacing()
	const padding = responsive.getResponsivePadding()
	const margin = responsive.getResponsiveMargin()

	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		scrollContent: {
			paddingHorizontal: padding.horizontal,
			paddingTop: spacing.md,
			paddingBottom: spacing.lg,
		},

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

		// Header Actions
		headerActions: {
			flexDirection: 'row' as const,
			justifyContent: 'space-between' as const,
			alignItems: 'center' as const,
			marginBottom: spacing.lg,
			gap: margin.small,
		},
		addButton: {
			flex: 1,
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
			backgroundColor: colors.primary,
			paddingVertical: spacing.sm,
			paddingHorizontal: spacing.md,
			borderRadius: 8,
			gap: margin.small,
		},
		addButtonText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: '#fff',
		},
		categoryButton: {
			flex: 1,
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
			backgroundColor: colors.surface,
			paddingVertical: spacing.sm,
			paddingHorizontal: spacing.sm,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.primary,
			gap: margin.small,
		},
		categoryButtonText: {
			fontSize: responsive.getResponsiveFontSize(15),
			fontWeight: '600' as const,
			color: colors.primary,
		},

		// Empty State
		emptyState: {
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
			paddingVertical: spacing.xl * 2,
			paddingHorizontal: spacing.xl,
		},
		emptyStateText: {
			fontSize: responsive.getResponsiveFontSize(18),
			fontWeight: '600' as const,
			color: colors.text,
			marginTop: margin.medium,
			marginBottom: margin.small,
			textAlign: 'center' as const,
		},
		emptyStateSubtext: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.textSecondary,
			textAlign: 'center' as const,
		},

		// Menu Items List
		menuItemsList: {
			gap: margin.small,
			overflow: 'visible' as const,
		},

		// Menu Item Card Styles
		menuItemCard: {
			flexDirection: 'column' as const,
			backgroundColor: colors.surface,
			borderRadius: 12,
			padding: spacing.md,
			gap: margin.small,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 2,
			overflow: 'visible' as const,
		},
		menuItemImageContainer: {
			width: 80,
			height: 80,
			borderRadius: 8,
			overflow: 'hidden' as const,
			backgroundColor: colors.border,
		},
		menuItemImage: {
			width: '100%',
			height: '100%',
		},
		menuItemImagePlaceholder: {
			width: '100%',
			height: '100%',
			justifyContent: 'center' as const,
			alignItems: 'center' as const,
			backgroundColor: colors.placeholder + '20',
		},
		menuItemInfo: {
			flex: 1,
			gap: spacing.xs,
		},
		menuItemName: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.text,
		},
		menuItemPrice: {
			fontSize: responsive.getResponsiveFontSize(15),
			fontWeight: '500' as const,
			color: colors.primary,
		},
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
			backgroundColor: '#10b981',
		},
		statusIndicatorUnavailable: {
			backgroundColor: '#ef4444',
		},
		statusText: {
			fontSize: responsive.getResponsiveFontSize(13),
			fontWeight: '500' as const,
		},
		statusTextAvailable: {
			color: '#10b981',
		},
		statusTextUnavailable: {
			color: '#ef4444',
		},
		menuItemActions: {
			justifyContent: 'center' as const,
			position: 'relative' as const,
		},
		menuButton: {
			width: 40,
			height: 40,
			justifyContent: 'center' as const,
			alignItems: 'center' as const,
			borderRadius: 20,
		},
		dropdownMenu: {
			position: 'absolute' as const,
			top: 0,
			right: 40,
			backgroundColor: colors.surface,
			borderRadius: 8,
			minWidth: 180,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.2,
			shadowRadius: 8,
			elevation: 8,
			borderWidth: 1,
			borderColor: colors.border,
			zIndex: 9999,
		},
		dropdownItem: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			paddingVertical: spacing.sm,
			paddingHorizontal: spacing.md,
			gap: spacing.sm,
		},
		dropdownText: {
			fontSize: responsive.getResponsiveFontSize(15),
			color: colors.text,
		},
		dropdownTextDanger: {
			color: '#ef4444',
		},
		dropdownDivider: {
			height: 1,
			backgroundColor: colors.border,
			marginVertical: spacing.xs / 2,
		},

		// Dropdown Modal Styles
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
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.3,
			shadowRadius: 12,
			elevation: 10,
			borderWidth: 1,
			borderColor: colors.border,
		},
		dropdownMenuHeader: {
			paddingVertical: spacing.md,
			paddingHorizontal: spacing.md,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
			backgroundColor: colors.background,
			borderTopLeftRadius: 12,
			borderTopRightRadius: 12,
		},
		dropdownMenuTitle: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.text,
			textAlign: 'center' as const,
		},

		// Variations Section
		variationsContainer: {
			marginTop: spacing.sm,
			paddingTop: spacing.sm,
			borderTopWidth: 1,
			borderTopColor: colors.border,
			gap: spacing.md,
		},
		variationGroup: {
			gap: spacing.xs,
		},
		variationGroupName: {
			fontSize: responsive.getResponsiveFontSize(15),
			fontWeight: '600' as const,
			color: colors.text,
			marginBottom: spacing.xs / 2,
		},
		variationOption: {
			flexDirection: 'row' as const,
			justifyContent: 'space-between' as const,
			alignItems: 'center' as const,
			paddingVertical: spacing.xs,
			gap: spacing.sm,
		},
		variationOptionInfo: {
			flex: 1,
			flexDirection: 'row' as const,
			justifyContent: 'space-between' as const,
			alignItems: 'center' as const,
		},
		variationOptionName: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
		},
		variationOptionPrice: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '500' as const,
			color: colors.textSecondary,
			marginLeft: spacing.xs,
		},
		availabilityToggle: {
			paddingHorizontal: spacing.sm,
			paddingVertical: spacing.xs / 2,
			borderRadius: 6,
			backgroundColor: colors.border,
			borderWidth: 1,
			borderColor: colors.border,
		},
		availabilityToggleActive: {
			backgroundColor: '#10b981',
			borderColor: '#10b981',
		},
		availabilityToggleText: {
			fontSize: responsive.getResponsiveFontSize(12),
			fontWeight: '600' as const,
			color: colors.textSecondary,
		},
		availabilityToggleTextActive: {
			color: '#fff',
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
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600' as const,
			color: colors.primary,
		},

		// Legacy styles (for backward compatibility)
		containerText: {
			fontSize: responsive.getResponsiveFontSize(24),
			fontWeight: 'bold' as const,
			color: colors.text,
			marginBottom: margin.small,
		},
		containerSubtext: {
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.textSecondary,
		},

		// Category Management Styles
		categoryManagementContainer: {
			backgroundColor: colors.background,
		},
		sectionTitle: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.text,
			marginBottom: spacing.xs,
			marginTop: spacing.md,
		},
		currencySymbol: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.text,
			marginRight: spacing.xs,
		},
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
