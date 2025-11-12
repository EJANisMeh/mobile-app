import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createCustomerProfileStyles = (
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
		profileHeader: {
			alignItems: 'center' as const,
			marginBottom: responsive.getResponsiveMargin().large,
		},
		profileImageContainer: {
			width: 120,
			height: 120,
			borderRadius: 60,
			backgroundColor: colors.card,
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
			marginBottom: responsive.getResponsiveMargin().medium,
			shadowColor: '#000',
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.1,
			shadowRadius: 3.84,
			elevation: 5,
		},
		profileImage: {
			width: 120,
			height: 120,
			borderRadius: 60,
		},
		profileImagePlaceholder: {
			fontSize: responsive.getResponsiveFontSize(48),
			color: colors.textSecondary,
		},
		profileName: {
			fontSize: responsive.getResponsiveFontSize(24),
			fontWeight: 'bold' as const,
			color: colors.text,
			textAlign: 'center' as const,
		},
		profileEmail: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.textSecondary,
			textAlign: 'center' as const,
			marginTop: 4,
		},
		editButtonContainer: {
			position: 'absolute' as const,
			top: 0,
			right: 0,
		},
		editButton: {
			backgroundColor: colors.primary,
			padding: 12,
			borderRadius: 25,
			shadowColor: '#000',
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
			elevation: 5,
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
		sectionTitle: {
			fontSize: responsive.getResponsiveFontSize(18),
			fontWeight: 'bold' as const,
			color: colors.text,
			marginBottom: responsive.getResponsiveMargin().medium,
		},
		infoLabel: {
			fontSize: responsive.getResponsiveFontSize(14),
			fontWeight: '600' as const,
			color: colors.textSecondary,
			marginTop: responsive.getResponsiveMargin().small,
			marginBottom: 4,
		},
		infoValue: {
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.text,
			marginBottom: responsive.getResponsiveMargin().small,
		},
		contactItem: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			marginBottom: responsive.getResponsiveMargin().small,
		},
		contactIcon: {
			marginRight: 8,
		},
		contactText: {
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.text,
		},
		noContactsText: {
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.textSecondary,
			fontStyle: 'italic' as const,
		},
	})
