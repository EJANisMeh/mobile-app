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
		cartContent: {
			marginHorizontal: padding.horizontal,
			marginBottom: padding.vertical,
			gap: spacing.sm,
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
