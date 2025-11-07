import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../../types'

export const createOrderSortModalStyles = (
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
		section: {
			marginBottom: 24,
		},
		sectionTitle: {
			fontSize: 16,
			fontWeight: '600',
			color: colors.text,
			marginBottom: 8,
		},
		sectionHint: {
			fontSize: 13,
			color: colors.textSecondary,
			marginBottom: 12,
		},
		sortRuleCard: {
			backgroundColor: colors.surface,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.border,
			marginBottom: 12,
			overflow: 'hidden',
		},
		sortRuleHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			padding: 12,
			backgroundColor: colors.background,
		},
		sortRuleInfo: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 8,
			flex: 1,
		},
		sortRulePriority: {
			fontSize: 14,
			fontWeight: '700',
			color: colors.primary,
			width: 20,
		},
		sortRuleLabel: {
			fontSize: 14,
			fontWeight: '500',
			color: colors.text,
		},
		removeButton: {
			padding: 4,
		},
		sortRuleActions: {
			flexDirection: 'row',
			gap: 8,
			padding: 12,
		},
		directionButton: {
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 6,
			paddingVertical: 10,
			paddingHorizontal: 12,
			borderRadius: 6,
			borderWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.surface,
		},
		directionButtonActive: {
			backgroundColor: colors.primary,
			borderColor: colors.primary,
		},
		directionButtonText: {
			fontSize: 13,
			fontWeight: '500',
			color: colors.text,
		},
		directionButtonTextActive: {
			color: colors.surface,
		},
		moveButtons: {
			flexDirection: 'row',
			justifyContent: 'center',
			gap: 8,
			paddingHorizontal: 12,
			paddingBottom: 12,
		},
		moveButton: {
			width: 36,
			height: 36,
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 6,
			borderWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.surface,
		},
		moveButtonDisabled: {
			opacity: 0.3,
		},
		availableFields: {
			gap: 8,
		},
		availableFieldButton: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 8,
			paddingVertical: 12,
			paddingHorizontal: 16,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.surface,
		},
		availableFieldText: {
			flex: 1,
			fontSize: 14,
			color: colors.text,
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
