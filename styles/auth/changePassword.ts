import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createChangePasswordStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingVertical: 20,
	},
	content: {
		flex: 1,
		justifyContent: 'center' as const,
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
		lineHeight: 24,
	},
	form: {
		marginBottom: responsive.getResponsiveMargin().medium,
	},
	inputContainer: {
		position: 'relative' as const,
		marginBottom: 16,
	},
	input: {
		backgroundColor: colors.inputBackground,
		borderRadius: 8,
		paddingHorizontal: 16,
		paddingVertical: 12,
		paddingRight: 50,
		borderWidth: 1,
		borderColor: colors.inputBorder,
		fontSize: 16,
		color: colors.inputText,
	},
	showPasswordButton: {
		position: 'absolute' as const,
		right: 12,
		top: 12,
		padding: 4,
	},
	showPasswordText: {
		color: colors.primary,
		fontSize: 14,
		fontWeight: '600' as const,
	},
	eyeButton: {
		position: 'absolute' as const,
		right: 12,
		top: 12,
		padding: 4,
	},
	eyeText: {
		color: colors.primary,
		fontSize: 14,
		fontWeight: '600' as const,
	},
	requirements: {
		marginBottom: 24,
	},
	requirementsTitle: {
		fontSize: 16,
		fontWeight: '600' as const,
		marginBottom: 8,
		color: colors.text,
	},
	requirement: {
		flexDirection: 'row' as const,
		alignItems: 'center' as const,
		marginBottom: 4,
	},
	requirementText: {
		fontSize: 14,
		marginLeft: 8,
		color: colors.textSecondary,
	},
	requirementValid: {
		color: colors.success,
	},
	actionButtons: {
		flexDirection: 'row' as const,
		gap: 12,
	},
	changeButton: {
		flex: 1,
		backgroundColor: colors.primary,
		borderRadius: 8,
		paddingVertical: 14,
		alignItems: 'center' as const,
	},
	changeButtonText: {
		color: colors.textOnPrimary,
		fontSize: 18,
		fontWeight: 'bold' as const,
	},
	submitButton: {
		flex: 1,
		backgroundColor: colors.primary,
		borderRadius: 8,
		paddingVertical: 14,
		alignItems: 'center' as const,
	},
	submitButtonText: {
		color: colors.textOnPrimary,
		fontSize: 18,
		fontWeight: 'bold' as const,
	},
	cancelButton: {
		flex: 1,
		borderWidth: 2,
		borderColor: colors.border,
		borderRadius: 8,
		paddingVertical: 14,
		alignItems: 'center' as const,
	},
	cancelButtonText: {
		color: colors.textSecondary,
		fontSize: 16,
		fontWeight: '600' as const,
	},
	disabledButton: {
		backgroundColor: colors.textSecondary,
	},
})
