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
		cartGroupScheduleRow: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			gap: spacing.xs,
			marginTop: spacing.sm,
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
			flexDirection: 'row',
			alignItems: 'flex-start',
			gap: spacing.md,
		},
		cartGroupItemImageWrapper: {
			width: 72,
			height: 72,
			borderRadius: 12,
			backgroundColor: colors.border,
			alignItems: 'center',
			justifyContent: 'center',
			overflow: 'hidden',
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
		cartGroupItemQuantity: {
			fontSize: fontSize(13),
			color: colors.text,
		},
		cartGroupItemPrice: {
			fontSize: fontSize(14),
			fontWeight: '700',
			color: colors.text,
		},
		cartGroupFooter: {
			marginTop: spacing.md,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingTop: spacing.sm,
			borderTopWidth: 1,
			borderTopColor: colors.border,
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
		},
		placeOrderButtonDisabled: {
			backgroundColor: colors.border,
		},
		placeOrderButtonText: {
			fontSize: fontSize(14),
			fontWeight: '700',
			color: colors.textOnPrimary,
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
