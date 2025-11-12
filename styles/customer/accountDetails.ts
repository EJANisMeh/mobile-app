import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createCustomerAccountDetailsStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		scrollContent: {
			padding: responsive.getResponsivePadding().horizontal,
		},
		title: {
			fontSize: responsive.getResponsiveFontSize(24),
			fontWeight: 'bold' as const,
			color: colors.text,
			marginBottom: responsive.getResponsiveMargin().large,
			textAlign: 'center' as const,
		},
		section: {
			backgroundColor: colors.card,
			padding: responsive.getResponsivePadding().horizontal,
			borderRadius: 12,
			marginBottom: responsive.getResponsivePadding().vertical,
			shadowColor: '#000',
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.1,
			shadowRadius: 3.84,
			elevation: 5,
		},
		sectionTitle: {
			fontSize: responsive.getResponsiveFontSize(18),
			fontWeight: 'bold' as const,
			color: colors.text,
			marginBottom: responsive.getResponsiveMargin().medium,
		},
		inputLabel: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600' as const,
			color: colors.text,
			marginBottom: 8,
			marginTop: responsive.getResponsiveMargin().small,
		},
		input: {
			backgroundColor: colors.background,
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: 8,
			padding: 12,
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.text,
			marginBottom: responsive.getResponsiveMargin().medium,
		},
		inputError: {
			borderColor: colors.error,
		},
		errorText: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.error,
			marginTop: -8,
			marginBottom: responsive.getResponsiveMargin().small,
		},
		saveButton: {
			backgroundColor: colors.primary,
			padding: 16,
			borderRadius: 8,
			alignItems: 'center' as const,
			marginTop: responsive.getResponsiveMargin().medium,
		},
		saveButtonDisabled: {
			backgroundColor: colors.border,
		},
		saveButtonText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: 'bold' as const,
			color: colors.background,
		},
		saveButtonTextDisabled: {
			color: colors.textSecondary,
		},
		loadingContainer: {
			flex: 1,
			justifyContent: 'center' as const,
			alignItems: 'center' as const,
		},
		loadingText: {
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.textSecondary,
			marginTop: responsive.getResponsiveMargin().medium,
		},
	})
