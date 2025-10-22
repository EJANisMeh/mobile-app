import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createEmailVerificationStyles = (
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
		marginBottom: 16,
		color: colors.text,
	},
	subtitle: {
		fontSize: responsive.getResponsiveFontSize(16),
		textAlign: 'center' as const,
		marginBottom: responsive.getResponsiveMargin().small,
		color: colors.textSecondary,
	},
	description: {
		fontSize: responsive.getResponsiveFontSize(16),
		textAlign: 'center' as const,
		marginBottom: 40,
		color: colors.textSecondary,
		lineHeight: 24,
	},
	codeInputContainer: {
		flexDirection: 'row' as const,
		justifyContent: 'center' as const,
		gap: 10,
		marginVertical: 30,
	},
	codeInput: {
		width: 50,
		height: 60,
		borderWidth: 2,
		borderRadius: 8,
		fontSize: 24,
		fontWeight: 'bold' as const,
		textAlign: 'center' as const,
		color: colors.text,
		backgroundColor: colors.background,
	},
	codeInputFilled: {
		borderColor: colors.primary,
	},
	codeInputEmpty: {
		borderColor: colors.border,
	},
	actionsContainer: {
		gap: 16,
	},
	primaryButton: {
		backgroundColor: colors.primary,
		borderRadius: 8,
		paddingVertical: 14,
		alignItems: 'center' as const,
	},
	primaryButtonText: {
		color: colors.textOnPrimary,
		fontSize: 18,
		fontWeight: 'bold' as const,
	},
	secondaryButton: {
		borderWidth: 2,
		borderColor: colors.primary,
		borderRadius: 8,
		paddingVertical: 14,
		alignItems: 'center' as const,
		minHeight: 48,
		justifyContent: 'center' as const,
	},
	secondaryButtonText: {
		color: colors.primary,
		fontSize: 16,
		fontWeight: '600' as const,
	},
	disabledButton: {
		borderColor: colors.textSecondary,
	},
	backToLoginButton: {
		alignItems: 'center' as const,
		paddingVertical: 12,
	},
	backToLoginButtonText: {
		color: colors.textSecondary,
		fontSize: 16,
		fontWeight: '500' as const,
	},
})
