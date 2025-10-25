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
		sectionTitle: {
			fontSize: responsive.getResponsiveFontSize(18),
			fontWeight: '600' as const,
			color: colors.text,
			marginBottom: responsive.getResponsiveMargin().medium,
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
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			justifyContent: 'space-between' as const,
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
	})
