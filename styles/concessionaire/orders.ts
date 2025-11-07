import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createConcessionaireOrdersStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		header: {
			paddingHorizontal: 20,
			paddingVertical: 16,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
			backgroundColor: colors.surface,
		},
		headerTitle: {
			fontSize: 24,
			fontWeight: '700',
			color: colors.text,
		},
		searchContainer: {
			flexDirection: 'row',
			gap: 12,
			paddingHorizontal: 20,
			paddingVertical: 12,
			backgroundColor: colors.surface,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
		},
		searchInputContainer: {
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center',
			gap: 8,
			paddingHorizontal: 12,
			paddingVertical: 10,
			backgroundColor: colors.background,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.border,
		},
		searchInput: {
			flex: 1,
			fontSize: 14,
			color: colors.text,
		},
		statusFiltersContainer: {
			backgroundColor: colors.surface,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
			paddingVertical: responsive.getHeightPercent(1.5),
		},
		statusFilterButton: {
			paddingHorizontal: 16,
			paddingVertical: 8,
			borderRadius: 20,
			backgroundColor: colors.background,
			borderWidth: 2,
			borderColor: colors.border,
			flexDirection: 'row',
			alignItems: 'center',
			gap: 6,
		},
		statusFilterButtonActive: {
			backgroundColor: colors.surface,
			borderWidth: 2,
		},
		statusFilterText: {
			fontSize: 14,
			fontWeight: '600',
			color: colors.textSecondary,
		},
		statusFilterTextActive: {
			color: colors.text,
		},
		statusFilterCount: {
			fontSize: 12,
			fontWeight: '600',
			color: colors.textSecondary,
			backgroundColor: colors.border,
			paddingHorizontal: 6,
			paddingVertical: 2,
			borderRadius: 10,
			minWidth: 20,
			textAlign: 'center',
		},
		statusFilterCountActive: {
			backgroundColor: colors.background,
		},
		actionButtons: {
			flexDirection: 'row',
			gap: 8,
		},
		actionButton: {
			width: 44,
			height: 44,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: colors.background,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.border,
		},
		stateContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			padding: 32,
		},
		stateTitle: {
			fontSize: 20,
			fontWeight: '600',
			color: colors.text,
			marginBottom: 8,
			textAlign: 'center',
		},
		stateMessage: {
			fontSize: 14,
			color: colors.textSecondary,
			textAlign: 'center',
		},
		ordersList: {
			flex: 1,
		},
		ordersListContent: {
			padding: 20,
			gap: 16,
		},
		orderCard: {
			backgroundColor: colors.surface,
			borderRadius: 12,
			borderWidth: 1,
			borderColor: colors.border,
			overflow: 'hidden',
		},
		orderCardHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingHorizontal: 16,
			paddingVertical: 12,
			backgroundColor: colors.background,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
		},
		orderNumberContainer: {
			flexDirection: 'row',
			alignItems: 'baseline',
			gap: 4,
		},
		orderNumberLabel: {
			fontSize: 12,
			fontWeight: '500',
			color: colors.textSecondary,
		},
		orderNumber: {
			fontSize: 18,
			fontWeight: '700',
			color: colors.text,
		},
		statusBadge: {
			paddingHorizontal: 12,
			paddingVertical: 6,
			borderRadius: 16,
		},
		statusText: {
			fontSize: 12,
			fontWeight: '600',
			color: '#FFFFFF',
		},
		orderCardBody: {
			padding: 16,
			gap: 12,
		},
		orderInfoRow: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 8,
		},
		orderInfoIcon: {
			color: colors.textSecondary,
		},
		orderInfoLabel: {
			fontSize: 14,
			fontWeight: '500',
			color: colors.textSecondary,
			minWidth: 70,
		},
		orderInfoValue: {
			flex: 1,
			fontSize: 14,
			color: colors.text,
		},
		orderTotal: {
			fontWeight: '700',
			color: colors.primary,
		},
		paginationContainer: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			paddingVertical: 16,
			paddingHorizontal: 20,
			gap: 16,
			backgroundColor: colors.surface,
			borderTopWidth: 1,
			borderTopColor: colors.border,
		},
		paginationButton: {
			width: 40,
			height: 40,
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.background,
		},
		paginationButtonDisabled: {
			opacity: 0.4,
		},
		paginationText: {
			fontSize: 14,
			fontWeight: '500',
			color: colors.text,
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
	})
