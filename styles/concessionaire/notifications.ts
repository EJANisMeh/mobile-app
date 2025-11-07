import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createConcessionaireNotificationsStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) => {
	const padding = responsive.getResponsivePadding()
	const margin = responsive.getResponsiveMargin()
	const spacing = responsive.getResponsiveSpacing()

	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		header: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingHorizontal: padding.horizontal,
			paddingVertical: spacing.sm,
			backgroundColor: colors.card,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
		},
		headerText: {
			color: colors.text,
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600',
		},
		markAllButton: {
			color: colors.primary,
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600',
		},
		listContent: {
			paddingVertical: spacing.sm,
		},
		notificationCard: {
			flexDirection: 'row',
			backgroundColor: colors.card,
			padding: padding.horizontal,
			marginHorizontal: margin.medium,
			marginVertical: spacing.xs,
			borderRadius: 12,
			borderWidth: 1,
			borderColor: colors.border,
		},
		unreadCard: {
			backgroundColor: colors.surface,
			borderColor: colors.primary,
		},
		notificationIcon: {
			width: 40,
			height: 40,
			borderRadius: 20,
			backgroundColor: colors.background,
			justifyContent: 'center',
			alignItems: 'center',
			marginRight: margin.small,
		},
		notificationContent: {
			flex: 1,
		},
		notificationTitle: {
			color: colors.text,
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '500',
			marginBottom: 4,
		},
		unreadTitle: {
			fontWeight: '700',
		},
		notificationMessage: {
			color: colors.textSecondary,
			fontSize: responsive.getResponsiveFontSize(14),
			marginBottom: 4,
		},
		notificationTime: {
			color: colors.textSecondary,
			fontSize: responsive.getResponsiveFontSize(12),
		},
		unreadDot: {
			width: 8,
			height: 8,
			borderRadius: 4,
			backgroundColor: colors.primary,
			marginLeft: margin.small,
			marginTop: 4,
		},
		centerContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			paddingHorizontal: margin.large * 2,
		},
		loadingText: {
			color: colors.textSecondary,
			fontSize: responsive.getResponsiveFontSize(16),
			marginTop: margin.medium,
		},
		errorText: {
			color: colors.error,
			fontSize: responsive.getResponsiveFontSize(16),
			textAlign: 'center',
		},
		emptyText: {
			color: colors.text,
			fontSize: responsive.getResponsiveFontSize(18),
			fontWeight: '600',
			marginTop: margin.medium,
			textAlign: 'center',
		},
		emptySubtext: {
			color: colors.textSecondary,
			fontSize: responsive.getResponsiveFontSize(14),
			marginTop: margin.small,
			textAlign: 'center',
		},
	})
}
