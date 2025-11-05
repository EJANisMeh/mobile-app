import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../../types'

export const createOrderFilterModalStyles = (
	colors: ThemeColors,
	responsive: ReturnType<
		typeof import('../../hooks/useDeviceOrientation').useResponsiveDimensions
	>
) => {
	return StyleSheet.create({
		scrollArea: {
			maxHeight: 500,
		},
		scrollContent: {
			paddingBottom: 8,
		},
		filterSection: {
			marginBottom: 24,
		},
		filterSectionTitle: {
			fontSize: 16,
			fontWeight: '600',
			color: colors.text,
			marginBottom: 12,
		},
		filterOptions: {
			gap: 8,
		},
		filterOption: {
			paddingVertical: 12,
			paddingHorizontal: 16,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.surface,
		},
		filterOptionSelected: {
			borderColor: colors.primary,
			backgroundColor: colors.primary + '10',
		},
		filterOptionText: {
			fontSize: 14,
			color: colors.text,
		},
		filterOptionTextSelected: {
			color: colors.primary,
			fontWeight: '600',
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
			flexDirection: 'row',
			alignItems: 'center',
			gap: 8,
			paddingVertical: 12,
			paddingHorizontal: 20,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.primary,
		},
		actionButtonSpacing: {
			marginLeft: 12,
		},
		resetButton: {
			backgroundColor: colors.surface,
		},
		applyButton: {
			backgroundColor: colors.primary,
			borderColor: colors.primary,
		},
		actionButtonText: {
			fontSize: 15,
			fontWeight: '600',
			color: colors.text,
		},
		applyButtonText: {
			fontSize: 15,
			fontWeight: '600',
			color: colors.surface,
		},
	})
}
