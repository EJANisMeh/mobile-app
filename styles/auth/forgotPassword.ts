import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createForgotPasswordStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	content: {
		flex: 1,
		justifyContent: 'center' as const,
		paddingHorizontal: 24,
		paddingVertical: responsive.getResponsivePadding().vertical,
		maxWidth: responsive.getContentMaxWidth(),
		width: '100%' as const,
		alignSelf: 'center' as const,
	},
	iconContainer: {
		alignItems: 'center' as const,
		marginBottom: 24,
	},
	icon: {
		fontSize: 64,
	},
	title: {
		fontSize: responsive.getResponsiveFontSize(32),
		fontWeight: 'bold' as const,
		textAlign: 'center' as const,
		marginBottom: responsive.getResponsiveMargin().small,
		color: colors.text,
	},
	subtitle: {
		fontSize: responsive.getResponsiveFontSize(16),
		textAlign: 'center' as const,
		marginBottom: responsive.getResponsiveMargin().medium,
		color: colors.textSecondary,
		lineHeight: 24,
	},
	form: {
		marginBottom: responsive.getResponsiveMargin().medium,
	},
	input: {
		backgroundColor: colors.inputBackground,
		borderRadius: 8,
		paddingHorizontal: 16,
		paddingVertical: 12,
		marginBottom: 24,
		borderWidth: 1,
		borderColor: colors.inputBorder,
		fontSize: 16,
		color: colors.inputText,
	},
	submitButton: {
		backgroundColor: colors.primary,
		borderRadius: 8,
		paddingVertical: 14,
		alignItems: 'center' as const,
		marginBottom: 32,
	},
	submitButtonText: {
		color: colors.textOnPrimary,
		fontSize: 18,
		fontWeight: 'bold' as const,
	},
	disabledButton: {
		backgroundColor: colors.textSecondary,
	},
	backButton: {
		alignItems: 'center' as const,
		paddingVertical: 12,
	},
	backButtonText: {
		color: colors.primary,
		fontSize: 16,
		fontWeight: '600' as const,
	},
})
