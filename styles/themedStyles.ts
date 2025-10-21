import { StyleSheet } from 'react-native'
import { ThemeColors } from '../types/theme'
import type { ResponsiveDimensionsReturn } from '../types/hookTypes/useResponsiveDimensions'

export { createConcessionStyles } from './concessionaire/concession'
export { createEditConcessionStyles } from './concessionaire/editConcession'
export { createPaymentMethodsStyles } from './concessionaire/paymentMethods'

export const createLoginStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) => ({
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
		alignItems: 'center',
		marginBottom: 32,
	},
	forgotPasswordText: {
		color: colors.primary,
		fontSize: 16,
		fontWeight: '500',
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
		fontWeight: 'bold',
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
		fontWeight: '600',
	},
})

export const createRegisterStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) => ({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: 'center' as const,
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
	},
	form: {
		marginBottom: responsive.getResponsiveMargin().medium,
	},
	nameRow: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: 16,
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
	nameInput: {
		flex: 1,
		marginBottom: 0,
	},
	roleContainer: {
		marginBottom: 16,
	},
	roleLabel: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 12,
		color: colors.text,
	},
	roleButtons: {
		flexDirection: 'row',
		gap: 12,
	},
	roleButton: {
		flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 2,
		borderColor: colors.border,
		backgroundColor: colors.surface,
		alignItems: 'center',
	},
	roleButtonActive: {
		borderColor: colors.primary,
		backgroundColor: colors.primary,
	},
	roleButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.text,
	},
	roleButtonTextActive: {
		color: colors.textOnPrimary,
	},
	registerButton: {
		backgroundColor: colors.primary,
		borderRadius: 8,
		paddingVertical: 14,
		alignItems: 'center',
		marginBottom: 16,
	},
	registerButtonText: {
		color: colors.textOnPrimary,
		fontSize: 18,
		fontWeight: 'bold',
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
	signInText: {
		fontSize: 16,
		color: colors.primary,
		fontWeight: '600',
	},
})

export const createForgotPasswordStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) => ({
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

export const createEmailVerificationStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) => ({
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

export const createChangePasswordStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) => ({
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

export const createProfileCreationStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) => ({
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
	title: {
		fontSize: responsive.getResponsiveFontSize(32),
		fontWeight: 'bold' as const,
		color: colors.text,
		marginBottom: responsive.getResponsiveMargin().small,
		textAlign: 'center' as const,
	},
	subtitle: {
		fontSize: responsive.getResponsiveFontSize(16),
		color: colors.textSecondary,
		marginBottom: responsive.getResponsiveMargin().medium,
		textAlign: 'center' as const,
	},
	form: {
		marginBottom: 24,
	},
	input: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 8,
		padding: 16,
		fontSize: 16,
		color: colors.text,
		marginBottom: 16,
	},
	imagePickerButton: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 8,
		padding: 16,
		marginBottom: 16,
		alignItems: 'center' as const,
	},
	imagePickerText: {
		fontSize: 16,
		color: colors.textSecondary,
	},
	selectedImageText: {
		fontSize: 14,
		color: colors.primary,
		marginTop: 4,
	},
	contactDetailsContainer: {
		marginBottom: 16,
	},
	contactDetailsLabel: {
		fontSize: 14,
		fontWeight: '600' as const,
		color: colors.text,
		marginBottom: 8,
	},
	contactDetailsHint: {
		fontSize: 12,
		color: colors.textSecondary,
		marginBottom: 8,
	},
	addContactButton: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.primary,
		borderRadius: 8,
		padding: 12,
		alignItems: 'center' as const,
		marginTop: 8,
	},
	addContactButtonText: {
		fontSize: 14,
		color: colors.primary,
		fontWeight: '600' as const,
	},
	contactItem: {
		flexDirection: 'row' as const,
		alignItems: 'center' as const,
		marginBottom: 8,
	},
	contactInput: {
		flex: 1,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 8,
		padding: 12,
		fontSize: 14,
		color: colors.text,
		marginRight: 8,
	},
	removeContactButton: {
		backgroundColor: colors.error,
		borderRadius: 8,
		padding: 8,
		justifyContent: 'center' as const,
		alignItems: 'center' as const,
		width: 36,
		height: 36,
	},
	removeContactText: {
		color: colors.textOnPrimary,
		fontSize: 18,
		fontWeight: 'bold' as const,
	},
	submitButton: {
		backgroundColor: colors.primary,
		borderRadius: 8,
		padding: 16,
		alignItems: 'center' as const,
		marginTop: 8,
	},
	disabledButton: {
		backgroundColor: colors.border,
		opacity: 0.6,
	},
	submitButtonText: {
		color: colors.textOnPrimary,
		fontSize: 16,
		fontWeight: 'bold' as const,
	},
})
