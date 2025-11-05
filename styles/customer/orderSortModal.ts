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
		helperText: {
			fontSize: 14,
			color: colors.textSecondary,
			marginBottom: 16,
			lineHeight: 20,
		},
		sortRuleCard: {
			backgroundColor: colors.card,
			borderRadius: 12,
			padding: 16,
			marginBottom: 12,
			borderWidth: 1,
			borderColor: colors.border,
		},
		sortRuleHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 12,
		},
		sortRulePriority: {
			fontSize: 14,
			fontWeight: '600',
			color: colors.primary,
		},
		sortRuleMoveButtons: {
			flexDirection: 'row',
			gap: 8,
		},
		sortRuleMoveButton: {
			padding: 4,
		},
		sortRuleMoveButtonDisabled: {
			opacity: 0.3,
		},
		sortRuleRemoveButton: {
			padding: 4,
		},
		sortRuleBody: {
			gap: 12,
		},
		sortRuleLabel: {
			fontSize: 13,
			color: colors.textSecondary,
			marginBottom: 4,
		},
		sortFieldOptions: {
			flexDirection: 'row',
		},
		sortFieldOption: {
			paddingVertical: 8,
			paddingHorizontal: 14,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.surface,
			marginRight: 8,
		},
		sortFieldOptionSelected: {
			borderColor: colors.primary,
			backgroundColor: colors.primary + '10',
		},
		sortFieldOptionText: {
			fontSize: 13,
			color: colors.text,
		},
		sortFieldOptionTextSelected: {
			color: colors.primary,
			fontWeight: '600',
		},
		sortDirectionContainer: {
			flexDirection: 'row',
			gap: 8,
		},
		sortDirectionButton: {
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 6,
			paddingVertical: 10,
			paddingHorizontal: 12,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.surface,
		},
		sortDirectionButtonSelected: {
			borderColor: colors.primary,
			backgroundColor: colors.primary,
		},
		sortDirectionButtonText: {
			fontSize: 13,
			color: colors.textSecondary,
		},
		sortDirectionButtonTextSelected: {
			color: colors.surface,
			fontWeight: '600',
		},
		addSortRuleButton: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 8,
			paddingVertical: 14,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.primary,
			borderStyle: 'dashed',
			marginBottom: 16,
		},
		addSortRuleButtonText: {
			fontSize: 14,
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
