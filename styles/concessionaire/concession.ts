import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createConcessionStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) =>
	StyleSheet.create({
		container: {
			backgroundColor: colors.background,
		},
		scrollContent: {
			padding: responsive.getResponsivePadding().horizontal,
		},
		loadingContainer: {
			flex: 1,
			justifyContent: 'center' as const,
			alignItems: 'center' as const,
			backgroundColor: colors.background,
		},
		loadingText: {
			marginTop: responsive.getResponsiveMargin().small,
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.text,
		},
		headerSection: {
			marginBottom: responsive.getResponsiveMargin().large,
		},
		concessionName: {
			fontSize: responsive.getResponsiveFontSize(28),
			fontWeight: 'bold' as const,
			color: colors.text,
			marginBottom: responsive.getResponsiveMargin().small,
		},
		concessionDescription: {
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.placeholder,
			lineHeight: 22,
		},
		noDescription: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.placeholder,
			fontStyle: 'italic' as const,
		},
		statusSection: {
			marginBottom: responsive.getResponsiveMargin().large,
		},
		scheduleOverviewContainer: {
			marginBottom: responsive.getResponsiveMargin().large,
		},
		sectionTitle: {
			fontSize: responsive.getResponsiveFontSize(18),
			fontWeight: '600' as const,
			color: colors.text,
			marginBottom: responsive.getResponsiveMargin().medium,
		},
		scheduleOverviewCard: {
			backgroundColor: colors.card,
			borderRadius: 12,
			borderWidth: 1,
			borderColor: colors.border,
			padding: responsive.getResponsiveSpacing().md,
		},
		scheduleOverviewHeader: {
			flexDirection: 'row' as const,
			justifyContent: 'space-between' as const,
			alignItems: 'center' as const,
			marginBottom: responsive.getResponsiveMargin().small,
		},
		scheduleOverviewTitle: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.text,
		},
		scheduleStatusBadge: {
			paddingHorizontal: responsive.getResponsiveSpacing().sm,
			paddingVertical: 4,
			borderRadius: 12,
		},
		scheduleStatusBadgeOpen: {
			backgroundColor: '#e8f5e9',
		},
		scheduleStatusBadgeClosed: {
			backgroundColor: '#ffebee',
		},
		scheduleStatusBadgeText: {
			fontSize: responsive.getResponsiveFontSize(12),
			fontWeight: '600' as const,
			color: '#2e7d32',
		},
		scheduleStatusBadgeTextClosed: {
			color: '#c62828',
		},
		scheduleOverviewDayLabel: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.placeholder,
			marginBottom: responsive.getResponsiveMargin().small / 2,
		},
		scheduleOverviewHours: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.text,
			marginBottom: responsive.getResponsiveMargin().small / 2,
		},
		scheduleOverviewDuration: {
			fontSize: responsive.getResponsiveFontSize(13),
			color: colors.textSecondary,
			marginBottom: responsive.getResponsiveMargin().small,
		},
		scheduleOverviewFooter: {
			fontSize: responsive.getResponsiveFontSize(13),
			color: colors.textSecondary,
		},
		statusButton: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			justifyContent: 'space-between' as const,
			padding: responsive.getResponsiveSpacing().md,
			borderRadius: 12,
			borderWidth: 1,
		},
		statusButtonOpen: {
			backgroundColor: '#e8f5e9',
			borderColor: '#4caf50',
		},
		statusButtonClosed: {
			backgroundColor: '#ffebee',
			borderColor: '#f44336',
		},
		statusButtonContent: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
		},
		statusIcon: {
			marginRight: responsive.getResponsiveMargin().medium,
		},
		statusText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
		},
		statusTextOpen: {
			color: '#2e7d32',
		},
		statusTextClosed: {
			color: '#c62828',
		},
		statusToggleText: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.placeholder,
		},
		actionsSection: {
			marginBottom: responsive.getResponsiveMargin().large,
		},
		actionButton: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			padding: responsive.getResponsiveSpacing().md,
			backgroundColor: colors.card,
			borderRadius: 12,
			marginBottom: responsive.getResponsiveMargin().medium,
			borderWidth: 1,
			borderColor: colors.border,
		},
		actionIcon: {
			marginRight: responsive.getResponsiveMargin().medium,
		},
		actionText: {
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.text,
			flex: 1,
		},
		actionArrow: {
			marginLeft: responsive.getResponsiveMargin().small,
		},
		paymentMethodsSection: {
			marginBottom: responsive.getResponsiveMargin().large,
		},
		paymentMethodsList: {
			marginTop: responsive.getResponsiveMargin().small,
		},
		paymentMethodItem: {
			padding: 14,
			backgroundColor: colors.card,
			borderRadius: 10,
			marginBottom: responsive.getResponsiveMargin().small,
			borderWidth: 1,
			borderColor: colors.border,
		},
		paymentMethodDefault: {
			backgroundColor: colors.primary + '15',
			borderColor: colors.primary,
		},
		paymentMethodMainContent: {
			flex: 1,
		},
		paymentMethodTypeRow: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			marginBottom: 4,
		},
		paymentMethodType: {
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.text,
			fontWeight: '600' as const,
			textTransform: 'capitalize' as const,
		},
		inlineBadge: {
			backgroundColor: colors.primary,
			paddingHorizontal: 6,
			paddingVertical: 2,
			borderRadius: 4,
			marginLeft: 6,
		},
		inlineBadgeText: {
			color: '#fff',
			fontSize: responsive.getResponsiveFontSize(10),
			fontWeight: 'bold' as const,
		},
		paymentMethodContent: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
		},
		paymentMethodIcon: {
			marginRight: responsive.getResponsiveMargin().small,
		},
		paymentMethodText: {
			fontSize: responsive.getResponsiveFontSize(15),
			color: colors.text,
			textTransform: 'capitalize' as const,
		},
		paymentMethodDefaultText: {
			color: colors.primary,
			fontWeight: '600' as const,
		},
		defaultBadge: {
			backgroundColor: colors.primary,
			paddingHorizontal: responsive.getResponsiveMargin().small,
			paddingVertical: 4,
			borderRadius: 6,
		},
		defaultBadgeText: {
			color: '#fff',
			fontSize: responsive.getResponsiveFontSize(11),
			fontWeight: 'bold' as const,
		},
		paymentMethodDetails: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.textSecondary,
			fontWeight: '400' as const,
			marginBottom: 6,
		},
		proofInfoRow: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			marginTop: 8,
			paddingTop: 8,
			borderTopWidth: 1,
			borderTopColor: colors.border + '40',
			gap: 4,
		},
		proofInfoText: {
			fontSize: responsive.getResponsiveFontSize(13),
			color: colors.primary,
			fontWeight: '500' as const,
		},
		proofModeText: {
			fontSize: responsive.getResponsiveFontSize(13),
			color: colors.textSecondary,
			fontWeight: '500' as const,
		},
		addPaymentButton: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
			padding: 14,
			borderRadius: 10,
			borderWidth: 2,
			borderColor: colors.primary,
			borderStyle: 'dashed' as const,
			marginTop: 4,
		},
		addPaymentButtonText: {
			fontSize: responsive.getResponsiveFontSize(15),
			color: colors.primary,
			fontWeight: '600' as const,
			marginLeft: responsive.getResponsiveMargin().small,
		},
		showMoreText: {
			color: colors.primary,
			fontWeight: '600' as const,
			marginTop: 6,
			textAlign: 'right' as const,
		},
		scheduleModalScroll: {
			maxHeight: responsive.getHeightPercent(60),
		},
		scheduleModalSectionTitle: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.text,
			marginBottom: responsive.getResponsiveMargin().small,
		},
		scheduleDayRow: {
			flexDirection: 'row' as const,
			justifyContent: 'space-between' as const,
			alignItems: 'center' as const,
			paddingVertical: 6,
		},
		scheduleDayLabel: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
		},
		scheduleDayHours: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.textSecondary,
			fontWeight: '500' as const,
		},
		scheduleModalDivider: {
			height: 1,
			backgroundColor: colors.border,
			marginVertical: responsive.getResponsiveMargin().medium,
		},
		scheduleModalEmpty: {
			fontSize: responsive.getResponsiveFontSize(13),
			color: colors.placeholder,
			fontStyle: 'italic' as const,
			marginBottom: responsive.getResponsiveMargin().small,
		},
		scheduleBreakRow: {
			flexDirection: 'row' as const,
			justifyContent: 'space-between' as const,
			alignItems: 'center' as const,
			paddingVertical: 6,
		},
		scheduleBreakLabel: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
		},
		scheduleBreakHours: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.textSecondary,
			fontWeight: '500' as const,
		},
		scheduleSpecialRow: {
			flexDirection: 'row' as const,
			justifyContent: 'space-between' as const,
			alignItems: 'center' as const,
			paddingVertical: 8,
		},
		scheduleSpecialDate: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
			fontWeight: '600' as const,
		},
		scheduleSpecialReason: {
			fontSize: responsive.getResponsiveFontSize(13),
			color: colors.textSecondary,
			marginTop: 4,
			maxWidth: responsive.getContentMaxWidth() * 0.6,
		},
		scheduleSpecialBadge: {
			paddingHorizontal: responsive.getResponsiveSpacing().sm,
			paddingVertical: 4,
			borderRadius: 12,
		},
		scheduleSpecialBadgeOpen: {
			backgroundColor: '#e8f5e9',
		},
		scheduleSpecialBadgeClosed: {
			backgroundColor: '#ffebee',
		},
		scheduleSpecialBadgeText: {
			fontSize: responsive.getResponsiveFontSize(12),
			fontWeight: '600' as const,
			color: '#2e7d32',
		},
		scheduleSpecialBadgeTextClosed: {
			color: '#c62828',
		},
		scheduleModalEditButton: {
			marginTop: responsive.getResponsiveMargin().medium,
			paddingVertical: 12,
			borderRadius: 10,
			backgroundColor: colors.primary,
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
		},
		scheduleModalEditButtonText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.textOnPrimary,
		},
	})
