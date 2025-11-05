import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../../types'

export const createPaymentMethodModalStyles = (
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
			marginBottom: 16,
			lineHeight: 20,
		},
		methodsContainer: {
			gap: 12,
		},
		methodCard: {
			flexDirection: 'row',
			alignItems: 'center',
			padding: 16,
			borderRadius: 12,
			borderWidth: 2,
			borderColor: colors.border,
			backgroundColor: colors.surface,
		},
		methodCardSelected: {
			borderColor: colors.primary,
			backgroundColor: colors.primary + '08',
		},
		methodIcon: {
			marginRight: 16,
		},
		methodInfo: {
			flex: 1,
		},
		methodName: {
			fontSize: 16,
			fontWeight: '600',
			color: colors.text,
			marginBottom: 4,
		},
		methodNameSelected: {
			color: colors.primary,
		},
		methodDescription: {
			fontSize: 13,
			color: colors.textSecondary,
		},
		actionsRow: {
			flexDirection: 'row',
			justifyContent: 'flex-end',
			marginTop: 24,
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
		confirmButtonDisabled: {
			opacity: 0.6,
		},
		actionButtonText: {
			fontSize: 15,
			fontWeight: '600',
			color: colors.text,
		},
		confirmButtonText: {
			color: colors.surface,
		},
		confirmButtonTextDisabled: {
			color: colors.border,
		},
	})
}
