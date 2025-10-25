import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createConcessionaireProfileStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) =>
	StyleSheet.create({
		profileContainer: {
			backgroundColor: colors.background,
		},
		profileContent: {
			padding: responsive.getResponsivePadding().horizontal,
		},
		profileTitle: {
			fontSize: responsive.getResponsiveFontSize(28),
			fontWeight: 'bold' as const,
			color: colors.text,
			marginBottom: responsive.getResponsiveMargin().large,
			textAlign: 'center' as const,
		},
		userInfo: {
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
		infoLabel: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: 'bold' as const,
			color: colors.text,
			marginTop: responsive.getResponsiveMargin().medium,
			marginBottom: 4,
		},
		infoValue: {
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.text,
			marginBottom: responsive.getResponsiveMargin().small,
		},
	})
