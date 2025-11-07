import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createCustomerOrdersStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		header: {
			padding: responsive.getHeightPercent(2),
			backgroundColor: colors.surface,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
		},
		headerTitle: {
			fontSize: responsive.getResponsiveFontSize(24),
			fontWeight: 'bold',
			color: colors.text,
		},
		searchContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 12,
			paddingHorizontal: responsive.getWidthPercent(4),
			paddingVertical: responsive.getHeightPercent(1.5),
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
			borderRadius: 8,
			backgroundColor: colors.background,
			borderWidth: 1,
			borderColor: colors.border,
		},
		searchInput: {
			flex: 1,
			fontSize: 15,
			color: colors.text,
		},
		searchIconButton: {
			padding: 8,
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
		ordersList: {
			flex: 1,
			paddingHorizontal: responsive.getWidthPercent(4),
		},
		ordersListContent: {
			paddingVertical: responsive.getHeightPercent(1),
			gap: 12,
		},
		orderCard: {
			backgroundColor: colors.surface,
			borderRadius: 12,
			padding: responsive.getHeightPercent(2),
			borderWidth: 1,
			borderColor: colors.border,
		},
		orderHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 12,
		},
		orderIdText: {
			fontSize: 16,
			fontWeight: '600',
			color: colors.text,
		},
		orderStatusBadge: {
			paddingHorizontal: 10,
			paddingVertical: 4,
			borderRadius: 12,
		},
		orderStatusText: {
			fontSize: 12,
			fontWeight: '600',
			color: '#FFFFFF',
		},
		orderBody: {
			gap: 8,
			marginBottom: 12,
		},
		orderInfoRow: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 8,
		},
		orderInfoLabel: {
			fontSize: 14,
			color: colors.textSecondary,
			fontWeight: '500',
		},
		orderInfoValue: {
			fontSize: 14,
			color: colors.text,
			flex: 1,
		},
		orderFooter: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingTop: 12,
			borderTopWidth: 1,
			borderTopColor: colors.border,
		},
		orderTotalText: {
			fontSize: 18,
			fontWeight: 'bold',
			color: colors.primary,
		},
		orderDateText: {
			fontSize: 13,
			color: colors.textSecondary,
		},
		proofStatusBadge: {
			paddingHorizontal: 8,
			paddingVertical: 3,
			borderRadius: 10,
			marginLeft: 'auto',
		},
		proofStatusText: {
			fontSize: 11,
			fontWeight: '600',
		},
		paginationContainer: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			paddingVertical: responsive.getHeightPercent(2),
			gap: 16,
			backgroundColor: colors.surface,
			borderTopWidth: 1,
			borderTopColor: colors.border,
		},
		paginationButton: {
			padding: 8,
			borderRadius: 8,
			backgroundColor: colors.background,
		},
		paginationButtonDisabled: {
			opacity: 0.4,
		},
		paginationText: {
			fontSize: 14,
			fontWeight: '600',
			color: colors.text,
		},
		stateContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			padding: responsive.getHeightPercent(3),
		},
		stateTitle: {
			fontSize: responsive.getResponsiveFontSize(20),
			fontWeight: '600',
			color: colors.text,
			marginBottom: 8,
			textAlign: 'center',
		},
		stateMessage: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.textSecondary,
			textAlign: 'center',
		},
	})
