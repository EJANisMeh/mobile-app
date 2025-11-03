import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createCustomerFullMenuStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) => {
	const spacing = responsive.getResponsiveSpacing()
	const padding = responsive.getResponsivePadding()
	const fontSize = responsive.getResponsiveFontSize.bind(responsive)

	return StyleSheet.create({
		container: {
			backgroundColor: colors.background,
			paddingBottom: padding.vertical,
		},
		headerContainer: {
			marginHorizontal: padding.horizontal,
			marginTop: padding.vertical,
			marginBottom: spacing.sm,
		},
		concessionTitle: {
			fontSize: fontSize(24),
			fontWeight: '700',
			color: colors.text,
			marginBottom: spacing.xs,
		},
		itemCountLabel: {
			fontSize: fontSize(14),
			color: colors.textSecondary,
		},
		stateContainer: {
			marginHorizontal: padding.horizontal,
			marginTop: spacing.lg,
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
			marginBottom: spacing.md,
		},
		retryButton: {
			paddingHorizontal: padding.horizontal,
			paddingVertical: padding.vertical / 2,
			borderRadius: 8,
			backgroundColor: colors.primary,
		},
		retryButtonText: {
			fontSize: fontSize(14),
			color: colors.surface,
			fontWeight: '600',
		},
		listItemContainer: {
			flexDirection: 'row',
			paddingHorizontal: padding.horizontal,
			paddingVertical: padding.vertical,
			marginHorizontal: padding.horizontal,
			marginBottom: spacing.sm,
			borderRadius: 12,
			backgroundColor: colors.card,
			elevation: 2,
			shadowColor: '#00000033',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.08,
			shadowRadius: 4,
		},
		listItemDisabled: {
			opacity: 0.75,
		},
		listItemImageWrapper: {
			width: 96,
			height: 96,
			borderRadius: 12,
			overflow: 'hidden',
			marginRight: spacing.md,
			backgroundColor: colors.border,
			alignItems: 'center',
			justifyContent: 'center',
		},
		listItemImage: {
			width: '100%',
			height: '100%',
		},
		listItemImagePlaceholder: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
		},
		listItemContent: {
			flex: 1,
			justifyContent: 'space-between',
		},
		listItemHeaderRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'flex-start',
			marginBottom: spacing.xs,
		},
		listItemName: {
			flex: 1,
			fontSize: fontSize(18),
			fontWeight: '600',
			color: colors.text,
			marginRight: spacing.sm,
		},
		listItemPrice: {
			fontSize: fontSize(16),
			fontWeight: '700',
			color: colors.primary,
		},
		listItemDescription: {
			fontSize: fontSize(14),
			color: colors.textSecondary,
			marginBottom: spacing.sm,
		},
		listItemFooter: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		statusBadge: {
			borderRadius: 12,
			paddingHorizontal: padding.horizontal / 2,
			paddingVertical: padding.vertical / 3,
		},
		statusBadgeAvailable: {
			backgroundColor: colors.success,
		},
		statusBadgeUnavailable: {
			backgroundColor: colors.error,
		},
		statusBadgeText: {
			fontSize: fontSize(12),
			fontWeight: '600',
		},
		statusBadgeTextAvailable: {
			color: colors.surface,
		},
		statusBadgeTextUnavailable: {
			color: colors.surface,
		},
	})
}
