import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createCustomerCartStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) => {
	const spacing = responsive.getResponsiveSpacing()
	const padding = responsive.getResponsivePadding()
	const fontSize = responsive.getResponsiveFontSize.bind(responsive)

	return StyleSheet.create({
		container: {
			backgroundColor: colors.background,
		},
		header: {
			marginHorizontal: padding.horizontal,
			marginTop: padding.vertical,
			marginBottom: spacing.sm,
		},
		headerTitle: {
			fontSize: fontSize(24),
			fontWeight: '700',
			color: colors.text,
		},
		headerSubtext: {
			marginTop: spacing.xs,
			fontSize: fontSize(14),
			color: colors.textSecondary,
		},
		stateContainer: {
			marginHorizontal: padding.horizontal,
			marginTop: padding.vertical,
			alignItems: 'center',
		},
		stateTitle: {
			fontSize: fontSize(18),
			fontWeight: '600',
			color: colors.text,
			marginBottom: spacing.xs,
			textAlign: 'center',
		},
		stateMessage: {
			fontSize: fontSize(14),
			color: colors.textSecondary,
			textAlign: 'center',
		},
		metaErrorText: {
			fontSize: fontSize(12),
			color: colors.warning,
			marginBottom: spacing.xs,
		},
		cartContent: {
			marginHorizontal: padding.horizontal,
			marginBottom: padding.vertical,
			gap: spacing.sm,
		},
		cartGroupCard: {
			paddingVertical: padding.vertical,
			paddingHorizontal: padding.horizontal,
			borderRadius: 16,
			backgroundColor: colors.card,
			borderWidth: 1,
			borderColor: colors.border,
			shadowColor: '#00000014',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.08,
			shadowRadius: 6,
			elevation: 3,
		},
		cartGroupHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'flex-start',
			gap: spacing.sm,
		},
		cartGroupHeaderText: {
			flex: 1,
		},
		cartGroupTitle: {
			fontSize: fontSize(18),
			fontWeight: '700',
			color: colors.text,
		},
		groupSubtext: {
			marginTop: spacing.xs,
			fontSize: fontSize(13),
			color: colors.textSecondary,
		},
		groupBadge: {
			paddingHorizontal: spacing.sm,
			paddingVertical: spacing.xs,
			borderRadius: 999,
			borderWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.surface,
			alignSelf: 'flex-start',
		},
		groupBadgeSuccess: {
			borderColor: colors.success,
		},
		groupBadgeWarning: {
			borderColor: colors.warning,
		},
		groupBadgeError: {
			borderColor: colors.error,
		},
		groupBadgeInfo: {
			borderColor: colors.info,
		},
		groupBadgeText: {
			fontSize: fontSize(12),
			fontWeight: '600',
			color: colors.text,
		},
		groupHelperText: {
			marginTop: spacing.xs,
			fontSize: fontSize(12),
			color: colors.textSecondary,
		},
		groupHelperWarning: {
			color: colors.warning,
		},
		groupStatusLabel: {
			marginTop: spacing.sm,
			fontSize: fontSize(13),
			fontWeight: '600',
			color: colors.text,
		},
		groupStatusLabelSuccess: {
			color: colors.success,
		},
		groupStatusLabelWarning: {
			color: colors.warning,
		},
		groupStatusLabelError: {
			color: colors.error,
		},
		groupStatusLabelInfo: {
			color: colors.info,
		},
		cartGroupScheduleRow: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			gap: spacing.xs,
		},
		scheduleChip: {
			paddingHorizontal: spacing.sm,
			paddingVertical: spacing.xs,
			borderRadius: 999,
			borderWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.surface,
		},
		scheduleChipActive: {
			borderColor: colors.primary,
		},
		scheduleChipInactive: {
			opacity: 0.6,
		},
		scheduleChipText: {
			fontSize: fontSize(11),
			fontWeight: '600',
			color: colors.textSecondary,
		},
		scheduleChipTextActive: {
			color: colors.primary,
		},
		scheduleChipTextInactive: {
			color: colors.textSecondary,
		},
		cartGroupItems: {
			marginTop: spacing.md,
			gap: spacing.sm,
		},
		cartGroupItem: {
			paddingVertical: spacing.sm,
			borderBottomWidth: 0,
			overflow: 'hidden',
		},
		cartGroupItemMain: {
			flexDirection: 'row',
			alignItems: 'flex-start',
		},
		cartGroupItemImageWrapper: {
			width: 72,
			height: 72,
			borderRadius: 12,
			backgroundColor: colors.border,
			alignItems: 'center',
			justifyContent: 'center',
			overflow: 'hidden',
			marginRight: spacing.md,
		},
		cartGroupItemImage: {
			width: '100%',
			height: '100%',
		},
		cartGroupItemPlaceholder: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
		},
		cartGroupItemDetails: {
			flex: 1,
		},
		cartGroupItemName: {
			fontSize: fontSize(15),
			fontWeight: '600',
			color: colors.text,
		},
		cartGroupItemStatusRow: {
			marginTop: spacing.sm,
		},
		cartGroupItemCategory: {
			marginTop: spacing.xs,
			fontSize: fontSize(12),
			color: colors.textSecondary,
		},
		cartGroupItemMeta: {
			marginTop: spacing.xs,
			fontSize: fontSize(12),
			color: colors.textSecondary,
		},
		cartGroupItemFooter: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginTop: spacing.sm,
		},
		cartGroupItemActionsRow: {
			flexDirection: 'row',
			marginTop: spacing.sm,
			alignItems: 'center',
		},
		itemActionButtonWrapper: {
			flex: 1,
			marginRight: spacing.sm,
		},
		itemActionButton: {
			flex: 1,
			paddingVertical: spacing.xs,
			paddingHorizontal: spacing.sm,
			borderRadius: 999,
			borderWidth: 1,
			borderColor: colors.primary,
			backgroundColor: colors.surface,
			alignItems: 'center',
			justifyContent: 'center',
		},
		itemActionButtonText: {
			fontSize: fontSize(12),
			fontWeight: '600',
			color: colors.primary,
		},
		itemActionButtonDisabled: {
			opacity: 0.4,
		},
		itemRemoveIconButton: {
			width: 44,
			height: 44,
			borderRadius: 22,
			borderWidth: 1,
			borderColor: colors.error,
			backgroundColor: colors.surface,
			alignItems: 'center',
			justifyContent: 'center',
		},
		itemRemoveIcon: {
			color: colors.error,
		},
		cartGroupItemDivider: {
			height: 1,
			backgroundColor: colors.border,
			marginTop: spacing.sm,
		},
		cartGroupItemQuantityControl: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: spacing.sm,
		},
		quantityButton: {
			width: 28,
			height: 28,
			borderRadius: 14,
			borderWidth: 1,
			borderColor: colors.primary,
			backgroundColor: colors.surface,
			alignItems: 'center',
			justifyContent: 'center',
		},
		quantityButtonDisabled: {
			borderColor: colors.border,
			opacity: 0.5,
		},
		cartGroupItemQuantity: {
			fontSize: fontSize(14),
			fontWeight: '600',
			color: colors.text,
			minWidth: 24,
			textAlign: 'center',
		},
		cartGroupItemPrice: {
			fontSize: fontSize(14),
			fontWeight: '700',
			color: colors.text,
		},
		cartGroupFooter: {
			marginTop: spacing.md,
			flexDirection: 'column',
			gap: spacing.md,
			paddingTop: spacing.sm,
			borderTopWidth: 1,
			borderTopColor: colors.border,
		},
		cartGroupScheduleBlock: {
			gap: spacing.xs,
		},
		cartGroupScheduleLabel: {
			fontSize: fontSize(12),
			fontWeight: '600',
			color: colors.textSecondary,
		},
		cartGroupFooterRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'flex-end',
			gap: spacing.md,
		},
		cartGroupTotals: {
			flex: 1,
		},
		cartGroupButtons: {
			flexShrink: 0,
			minWidth: 160,
			gap: spacing.xs,
			flexDirection: 'column',
		},
		groupTotalLabel: {
			fontSize: fontSize(13),
			color: colors.textSecondary,
		},
		groupTotalValue: {
			marginTop: spacing.xs,
			fontSize: fontSize(18),
			fontWeight: '700',
			color: colors.primary,
		},
		placeOrderButton: {
			paddingHorizontal: spacing.lg,
			paddingVertical: spacing.sm,
			borderRadius: 999,
			backgroundColor: colors.primary,
			alignItems: 'center',
			justifyContent: 'center',
			minWidth: 140,
			alignSelf: 'stretch',
		},
		placeOrderButtonDisabled: {
			backgroundColor: colors.border,
		},
		placeOrderButtonText: {
			fontSize: fontSize(14),
			fontWeight: '700',
			color: colors.textOnPrimary,
		},
		itemStatusBadge: {
			paddingHorizontal: spacing.sm,
			paddingVertical: spacing.xs,
			borderRadius: 999,
			borderWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.surface,
			alignSelf: 'flex-start',
		},
		itemStatusBadgeSuccess: {
			borderColor: colors.success,
		},
		itemStatusBadgeWarning: {
			borderColor: colors.warning,
		},
		itemStatusBadgeError: {
			borderColor: colors.error,
		},
		itemStatusBadgeInfo: {
			borderColor: colors.info,
		},
		itemStatusBadgeText: {
			fontSize: fontSize(11),
			fontWeight: '600',
			color: colors.textSecondary,
		},
		itemStatusBadgeTextSuccess: {
			color: colors.success,
		},
		itemStatusBadgeTextWarning: {
			color: colors.warning,
		},
		itemStatusBadgeTextError: {
			color: colors.error,
		},
		itemStatusBadgeTextInfo: {
			color: colors.info,
		},
		cartItemCard: {
			flexDirection: 'row',
			paddingVertical: padding.vertical,
			paddingHorizontal: padding.horizontal / 1.2,
			borderRadius: 12,
			backgroundColor: colors.card,
			marginBottom: spacing.xs,
			elevation: 2,
			shadowColor: '#00000022',
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.08,
			shadowRadius: 3,
		},
		cartItemImageWrapper: {
			width: 80,
			height: 80,
			borderRadius: 10,
			overflow: 'hidden',
			marginRight: spacing.md,
			backgroundColor: colors.border,
			alignItems: 'center',
			justifyContent: 'center',
		},
		cartItemImage: {
			width: '100%',
			height: '100%',
		},
		cartItemPlaceholder: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
		},
		cartItemDetails: {
			flex: 1,
		},
		cartItemName: {
			fontSize: fontSize(16),
			fontWeight: '600',
			color: colors.text,
		},
		cartItemCategory: {
			marginTop: spacing.xs,
			fontSize: fontSize(12),
			color: colors.textSecondary,
		},
		cartItemMetaText: {
			marginTop: spacing.xs,
			fontSize: fontSize(12),
			color: colors.textSecondary,
		},
		cartItemUnitPrice: {
			marginTop: spacing.xs,
			fontSize: fontSize(12),
			color: colors.textSecondary,
		},
		cartItemFooter: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginTop: spacing.sm,
		},
		cartItemQuantity: {
			fontSize: fontSize(14),
			color: colors.text,
		},
		cartItemPrice: {
			fontSize: fontSize(16),
			fontWeight: '700',
			color: colors.text,
		},
		totalsCard: {
			marginTop: spacing.md,
			paddingVertical: padding.vertical,
			paddingHorizontal: padding.horizontal,
			borderRadius: 12,
			backgroundColor: colors.card,
			borderWidth: 1,
			borderColor: colors.border,
		},
		totalRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		totalLabel: {
			fontSize: fontSize(16),
			color: colors.text,
		},
		totalValue: {
			fontSize: fontSize(18),
			fontWeight: '700',
			color: colors.primary,
		},
	})
}
