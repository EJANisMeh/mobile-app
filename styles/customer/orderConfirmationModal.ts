import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../../types'

export const createOrderConfirmationModalStyles = (
	colors: ThemeColors,
	responsive: ReturnType<
		typeof import('../../hooks/useDeviceOrientation').useResponsiveDimensions
	>
) => {
	return StyleSheet.create({
		scrollArea: {
			maxHeight: 400,
		},
		scrollContent: {
			paddingBottom: 8,
		},
		helperText: {
			fontSize: 14,
			color: colors.textSecondary,
			lineHeight: 20,
			marginBottom: 16,
		},
		section: {
			marginBottom: 20,
			paddingBottom: 16,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
		},
		sectionTitle: {
			fontSize: 16,
			fontWeight: '600',
			marginBottom: 12,
			color: colors.text,
		},
		detailRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: 8,
			gap: 12,
		},
		detailLabel: {
			fontSize: 14,
			color: colors.textSecondary,
			flex: 1,
		},
		detailValue: {
			fontSize: 14,
			color: colors.text,
			fontWeight: '500',
			flex: 2,
			textAlign: 'right',
		},
		totalValue: {
			fontSize: 16,
			fontWeight: '700',
			color: colors.primary,
		},
		actionsRow: {
			flexDirection: 'row',
			justifyContent: 'flex-end',
			marginTop: 16,
			paddingTop: 16,
			borderTopWidth: 1,
			borderTopColor: colors.border,
		},
		actionButton: {
			paddingVertical: 12,
			paddingHorizontal: 20,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.primary,
		},
		actionButtonSpacing: {
			marginLeft: 12,
		},
		cancelButton: {
			backgroundColor: colors.surface,
		},
		confirmButton: {
			backgroundColor: colors.primary,
			borderColor: colors.primary,
		},
		actionButtonText: {
			fontSize: 15,
			fontWeight: '600',
			color: colors.text,
		},
		confirmButtonText: {
			color: colors.surface,
		},
	})
}
