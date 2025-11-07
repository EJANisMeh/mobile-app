import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createConcessionaireOrderDetailsStyles = (
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
		scrollView: {
			flex: 1,
		},
		scrollContent: {
			paddingHorizontal: padding.horizontal,
			paddingTop: spacing.md,
			paddingBottom: spacing.xl * 2,
		},

		// Loading/Error States
		centerContainer: {
			flex: 1,
			justifyContent: 'center' as const,
			alignItems: 'center' as const,
			paddingHorizontal: padding.horizontal,
		},
		loadingText: {
			marginTop: margin.medium,
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.textSecondary,
		},
		errorTitle: {
			fontSize: responsive.getResponsiveFontSize(20),
			fontWeight: '600' as const,
			color: colors.text,
			marginBottom: margin.small,
			textAlign: 'center' as const,
		},
		errorMessage: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.textSecondary,
			textAlign: 'center' as const,
			marginBottom: margin.large,
		},
		retryButton: {
			backgroundColor: colors.primary,
			paddingVertical: spacing.sm,
			paddingHorizontal: spacing.lg,
			borderRadius: 8,
		},
		retryButtonText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: '#fff',
		},

		// Header
		header: {
			marginBottom: spacing.lg,
		},
		headerTitle: {
			fontSize: responsive.getResponsiveFontSize(24),
			fontWeight: 'bold' as const,
			color: colors.text,
			marginBottom: spacing.xs,
		},
		statusBadge: {
			backgroundColor: colors.primary + '20',
			paddingVertical: spacing.xs,
			paddingHorizontal: spacing.sm,
			borderRadius: 6,
			alignSelf: 'flex-start' as const,
		},
		statusText: {
			fontSize: responsive.getResponsiveFontSize(12),
			fontWeight: '600' as const,
			color: colors.primary,
			textTransform: 'uppercase' as const,
		},

		// Action Buttons Container
		actionButtonsContainer: {
			flexDirection: 'row' as const,
			gap: margin.small,
			marginBottom: spacing.lg,
		},
		actionButton: {
			flex: 1,
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
			paddingVertical: spacing.md,
			borderRadius: 8,
			gap: margin.small,
		},
		acceptButton: {
			backgroundColor: '#10b981',
		},
		declineButton: {
			backgroundColor: '#ef4444',
		},
		rescheduleButton: {
			backgroundColor: '#f59e0b',
		},
		readyButton: {
			backgroundColor: '#10b981',
		},
		cancelButton: {
			backgroundColor: '#ef4444',
		},
		actionButtonText: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600' as const,
			color: '#fff',
		},

		// Section
		section: {
			backgroundColor: colors.surface,
			borderRadius: 12,
			padding: padding.horizontal,
			marginBottom: spacing.md,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 2,
		},
		sectionTitle: {
			fontSize: responsive.getResponsiveFontSize(18),
			fontWeight: '600' as const,
			color: colors.text,
			marginBottom: spacing.md,
		},

		// Detail Rows
		detailRow: {
			flexDirection: 'row' as const,
			justifyContent: 'space-between' as const,
			alignItems: 'center' as const,
			marginBottom: spacing.sm,
		},
		detailLabel: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.textSecondary,
		},
		detailValue: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
			fontWeight: '500' as const,
		},
		detailLabelBold: {
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.text,
			fontWeight: '600' as const,
		},
		detailValueBold: {
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.primary,
			fontWeight: 'bold' as const,
		},

		// Divider
		divider: {
			height: 1,
			backgroundColor: colors.border,
			marginVertical: spacing.md,
		},

		// Items List
		itemsListTitle: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.text,
			marginBottom: spacing.sm,
		},
		orderItem: {
			marginBottom: spacing.sm,
		},
		orderItemHeader: {
			flexDirection: 'row' as const,
			justifyContent: 'space-between' as const,
			alignItems: 'center' as const,
			marginBottom: spacing.xs,
		},
		orderItemName: {
			fontSize: responsive.getResponsiveFontSize(15),
			fontWeight: '600' as const,
			color: colors.text,
			flex: 1,
		},
		orderItemPrice: {
			fontSize: responsive.getResponsiveFontSize(15),
			fontWeight: '600' as const,
			color: colors.primary,
		},
		orderItemDetails: {
			fontSize: responsive.getResponsiveFontSize(13),
			color: colors.textSecondary,
			marginLeft: spacing.md,
			marginBottom: spacing.xs / 2,
		},
		orderItemOptions: {
			marginLeft: spacing.md,
		},
		orderItemAddons: {
			marginLeft: spacing.md,
		},
		orderItemUnitPrice: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.textSecondary,
			fontStyle: 'italic' as const,
			marginTop: spacing.xs / 2,
		},
		customerRequestContainer: {
			marginTop: spacing.sm,
			padding: spacing.sm,
			backgroundColor: colors.background,
			borderRadius: 6,
		},
		customerRequestLabel: {
			fontSize: responsive.getResponsiveFontSize(12),
			fontWeight: '600' as const,
			color: colors.textSecondary,
			marginBottom: spacing.xs / 2,
		},
		customerRequestText: {
			fontSize: responsive.getResponsiveFontSize(13),
			color: colors.text,
			fontStyle: 'italic' as const,
		},
		itemDivider: {
			height: 1,
			backgroundColor: colors.border,
			marginTop: spacing.sm,
		},

		// Payment Information
		proofLabel: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600' as const,
			color: colors.text,
			marginTop: spacing.sm,
			marginBottom: spacing.xs,
		},
		proofTextContainer: {
			backgroundColor: colors.background,
			padding: spacing.md,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.border,
		},
		proofText: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
		},
		proofImageContainer: {
			backgroundColor: colors.background,
			padding: spacing.sm,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.border,
			alignItems: 'center' as const,
		},
		proofImage: {
			width: '100%',
			height: 300,
			borderRadius: 6,
		},
		proofMissingContainer: {
			backgroundColor: colors.background,
			padding: spacing.md,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: '#f59e0b',
			borderStyle: 'dashed' as const,
		},
		proofMissingText: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: '#f59e0b',
			textAlign: 'center' as const,
			fontStyle: 'italic' as const,
		},
		instructionsLabel: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600' as const,
			color: colors.text,
			marginTop: spacing.md,
			marginBottom: spacing.xs,
		},
		instructionsText: {
			fontSize: responsive.getResponsiveFontSize(13),
			color: colors.textSecondary,
			fontStyle: 'italic' as const,
		},
	})
}
