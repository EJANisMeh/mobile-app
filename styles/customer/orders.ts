import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createCustomerOrdersStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) =>
	StyleSheet.create({
		placeholder: {
			flex: 1,
			justifyContent: 'center' as const,
			alignItems: 'center' as const,
			backgroundColor: colors.background,
		},
		placeholderText: {
			fontSize: responsive.getResponsiveFontSize(24),
			fontWeight: 'bold' as const,
			color: colors.text,
			marginBottom: responsive.getResponsiveMargin().small,
		},
		placeholderSubtext: {
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.textSecondary,
		},
	})
