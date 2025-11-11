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
		screenHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingHorizontal: padding.horizontal,
			paddingVertical: spacing.md,
			backgroundColor: colors.card,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
		},
		screenTitle: {
			color: colors.text,
			fontSize: responsive.getResponsiveFontSize(20),
			fontWeight: '700',
		},
		archiveButton: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 6,
		},
		archiveButtonText: {
			color: colors.primary,
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600',
		},
		filterScrollView: {
			backgroundColor: colors.background,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
			maxHeight: 60,
		},
		filterScrollContent: {
			paddingHorizontal: padding.horizontal,
			paddingVertical: spacing.sm,
			flexDirection: 'row',
			gap: spacing.xs,
		},
		filterButton: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: 12,
			backgroundColor: colors.card,
			borderRadius: 20,
			borderWidth: 1,
			borderColor: colors.border,
			gap: 6,
		},
		filterButtonActive: {
			backgroundColor: colors.primary,
			borderColor: colors.primary,
		},
		filterButtonText: {
			color: colors.text,
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '500',
		},
		filterButtonTextActive: {
			color: colors.background,
			fontWeight: '600',
		},
		filterBadge: {
			minWidth: 18,
			height: 18,
			paddingHorizontal: 5,
			backgroundColor: colors.background,
			borderRadius: 9,
			justifyContent: 'center',
			alignItems: 'center',
		},
		filterBadgeActive: {
			backgroundColor: colors.background,
		},
		filterBadgeText: {
			color: colors.text,
			fontSize: responsive.getResponsiveFontSize(11),
			fontWeight: '600',
		},
		filterBadgeTextActive: {
			color: colors.primary,
		},
		unreadHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingHorizontal: padding.horizontal,
			paddingVertical: spacing.sm,
			backgroundColor: colors.surface,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
		},
		unreadHeaderText: {
			color: colors.text,
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600',
		},
		deleteButton: {
			width: 36,
			height: 36,
			justifyContent: 'center',
			alignItems: 'center',
			marginLeft: margin.small,
		},
	})
}
