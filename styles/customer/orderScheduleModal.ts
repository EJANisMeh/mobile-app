import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../../types'

export const createOrderScheduleModalStyles = (
	colors: ThemeColors,
	responsive: ReturnType<
		typeof import('../../hooks/useDeviceOrientation').useResponsiveDimensions
	>
) => {
	return StyleSheet.create({
		scrollArea: {
			maxHeight: 350,
		},
		scrollContent: {
			paddingBottom: 8,
		},
		section: {
			marginBottom: 20,
		},
		sectionTitle: {
			fontSize: 16,
			fontWeight: '600',
			marginBottom: 8,
			color: colors.text,
		},
		helperText: {
			fontSize: 14,
			color: colors.textSecondary,
			lineHeight: 20,
		},
		scheduleDaysRow: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			gap: 8,
			marginTop: 8,
		},
		scheduleDayChip: {
			paddingVertical: 6,
			paddingHorizontal: 12,
			borderRadius: 16,
			borderWidth: 1,
		},
		scheduleDayChipActive: {
			backgroundColor: colors.primary + '15',
			borderColor: colors.primary,
		},
		scheduleDayChipInactive: {
			backgroundColor: colors.surface,
			borderColor: colors.border,
		},
		scheduleDayChipText: {
			fontSize: 13,
			fontWeight: '600',
		},
		scheduleDayChipTextActive: {
			color: colors.primary,
		},
		scheduleDayChipTextInactive: {
			color: colors.textSecondary,
		},
		modeRow: {
			flexDirection: 'row',
			gap: 12,
		},
		modeButton: {
			flex: 1,
			paddingVertical: 12,
			borderRadius: 10,
			borderWidth: 1,
			borderColor: colors.border,
			alignItems: 'center',
		},
		modeButtonActive: {
			backgroundColor: colors.primary + '10',
			borderColor: colors.primary,
		},
		modeButtonDisabled: {
			opacity: 0.4,
		},
		modeButtonText: {
			fontSize: 14,
			fontWeight: '600',
			color: colors.text,
		},
		modeButtonTextActive: {
			color: colors.primary,
		},
		modeButtonTextDisabled: {
			color: colors.textSecondary,
		},
		presetRow: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			gap: 10,
		},
		presetButton: {
			paddingVertical: 10,
			paddingHorizontal: 12,
			borderRadius: 20,
			borderWidth: 1,
			borderColor: colors.primary,
		},
		presetButtonDisabled: {
			opacity: 0.3,
		},
		presetButtonText: {
			fontSize: 13,
			fontWeight: '600',
			color: colors.primary,
		},
		presetButtonTextDisabled: {
			color: colors.textSecondary,
		},
		sectionSpacer: {
			height: 12,
		},
		dateTimeSection: {
			gap: 12,
		},
		pickerButton: {
			paddingVertical: 12,
			paddingHorizontal: 16,
			borderRadius: 10,
			borderWidth: 1,
			borderColor: colors.primary,
			backgroundColor: colors.primary + '10',
			alignItems: 'center',
		},
		pickerButtonText: {
			fontSize: 14,
			fontWeight: '600',
			color: colors.primary,
		},
		selectedDateTimeCard: {
			padding: 12,
			borderRadius: 10,
			backgroundColor: colors.surface,
			borderWidth: 1,
			borderColor: colors.border,
		},
		selectedDateTimeLabel: {
			fontSize: 12,
			color: colors.textSecondary,
			marginBottom: 4,
		},
		selectedDateTimeValue: {
			fontSize: 16,
			fontWeight: '600',
			color: colors.text,
		},
		datetimeButton: {
			paddingVertical: 12,
			paddingHorizontal: 12,
			borderRadius: 10,
			borderWidth: 1,
			borderColor: colors.border,
			alignItems: 'center',
		},
		datetimeButtonText: {
			fontSize: 14,
			fontWeight: '600',
			color: colors.text,
		},
		errorText: {
			color: colors.error,
			marginBottom: 12,
			fontSize: 13,
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
