import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createCustomerMenuStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) =>
	StyleSheet.create({
		container: {
			backgroundColor: colors.background,
		},
		containerText: {
			fontSize: responsive.getResponsiveFontSize(24),
			fontWeight: 'bold' as const,
			color: colors.text,
			marginBottom: responsive.getResponsiveMargin().small,
		},
		containerSubtext: {
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.textSecondary,
		},
		cafeteriaSection: {
			marginBottom: responsive.getResponsiveMargin().large,
		},
		cafeteriaHeader: {
			paddingHorizontal: responsive.getResponsivePadding().horizontal,
			marginBottom: responsive.getResponsiveMargin().medium,
		},
		cafeteriaName: {
			fontSize: responsive.getResponsiveFontSize(20),
			fontWeight: '600' as const,
			color: colors.text,
			marginBottom: responsive.getResponsiveSpacing().xs,
		},
		cafeteriaLocation: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.textSecondary,
		},
		concessionCard: {
			backgroundColor: colors.card,
			borderRadius: 12,
			marginBottom: responsive.getResponsiveMargin().medium,
			paddingVertical: responsive.getResponsivePadding().vertical,
			marginHorizontal: responsive.getResponsiveMargin().medium,
			elevation: 2,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
		},
		concessionHeader: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			paddingHorizontal: responsive.getResponsivePadding().horizontal,
			marginBottom: responsive.getResponsiveMargin().medium,
		},
		concessionImage: {
			width: 50,
			height: 50,
			borderRadius: 25,
			marginRight: responsive.getResponsiveMargin().small,
		},
		concessionInfo: {
			flex: 1,
		},
		concessionName: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.text,
		},
		concessionStatus: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.success,
			marginTop: 2,
		},
		menuItemsContainer: {
			paddingLeft: responsive.getResponsivePadding().horizontal,
		},
		menuItemCard: {
			width: 140,
			marginRight: responsive.getResponsiveMargin().small,
		},
		menuItemImageContainer: {
			width: '100%',
			height: 100,
			borderRadius: 8,
			backgroundColor: colors.border,
			marginBottom: responsive.getResponsiveMargin().small,
			overflow: 'hidden' as const,
		},
		menuItemImage: {
			width: '100%',
			height: '100%',
		},
		menuItemName: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '500' as const,
			color: colors.text,
			marginBottom: responsive.getResponsiveSpacing().xs,
		},
		menuItemPrice: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600' as const,
			color: colors.primary,
		},
		viewAllButton: {
			justifyContent: 'center' as const,
			alignItems: 'center' as const,
			width: 80,
			marginRight: responsive.getResponsiveMargin().medium,
		},
		viewAllText: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.primary,
			fontWeight: '600' as const,
		},
		closedConcessionsSection: {
			marginTop: responsive.getResponsiveMargin().small,
		},
		closedConcessionsHeader: {
			flexDirection: 'row' as const,
			justifyContent: 'space-between' as const,
			alignItems: 'center' as const,
			paddingHorizontal: responsive.getResponsivePadding().horizontal,
			paddingVertical: responsive.getResponsivePadding().vertical / 2,
			marginBottom: responsive.getResponsiveMargin().small,
		},
		closedConcessionsTitle: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '500' as const,
			color: colors.textSecondary,
		},
		concessionClosedStatus: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.error,
			marginTop: 2,
		},
		closedMessage: {
			paddingHorizontal: responsive.getResponsivePadding().horizontal,
			paddingVertical: responsive.getResponsivePadding().vertical,
			alignItems: 'center' as const,
		},
		closedMessageText: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.textSecondary,
			fontStyle: 'italic' as const,
		},
		emptyStateContainer: {
			paddingHorizontal: responsive.getResponsivePadding().horizontal,
			paddingVertical: responsive.getResponsivePadding().vertical * 2,
			alignItems: 'center' as const,
		},
		emptyStateText: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.textSecondary,
			textAlign: 'center' as const,
		},
		cafeteriaDivider: {
			height: 1,
			backgroundColor: colors.border,
			marginTop: responsive.getResponsiveMargin().medium,
			marginHorizontal: responsive.getResponsivePadding().horizontal,
		},
	})
