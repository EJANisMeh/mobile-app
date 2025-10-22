import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createLoginStyles = (
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
		paddingHorizontal: 5,
		paddingVertical: responsive.getResponsivePadding().vertical,
		maxWidth: responsive.getContentMaxWidth(),
		width: '100%' as const,
		alignSelf: 'center' as const,
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
	},
	form: {
		marginBottom: responsive.getResponsiveMargin().medium,
	},
	input: {
		backgroundColor: colors.inputBackground,
		borderRadius: 8,
		paddingHorizontal: 16,
		paddingVertical: 12,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: colors.inputBorder,
		fontSize: 16,
		color: colors.inputText,
	},
	forgotPassword: {
		alignItems: 'center' as const,
		marginBottom: 32,
	},
	forgotPasswordText: {
		color: colors.primary,
		fontSize: 16,
		fontWeight: '500' as const,
	},
	loginButton: {
		backgroundColor: colors.primary,
		borderRadius: 8,
		paddingVertical: 14,
		alignItems: 'center',
		marginBottom: 16,
	},
	loginButtonText: {
		color: colors.textOnPrimary,
		fontSize: 18,
		fontWeight: 'bold' as const,
	},
	disabledButton: {
		backgroundColor: colors.textSecondary,
	},
	footer: {
		flexDirection: 'row' as const,
		justifyContent: 'center' as const,
		alignItems: 'center' as const,
	},
	footerText: {
		fontSize: 16,
		color: colors.textSecondary,
	},
	signUpText: {
		fontSize: 16,
		color: colors.primary,
		fontWeight: '600' as const,
	},
})