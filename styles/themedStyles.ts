import { StyleSheet } from 'react-native'
import { ThemeColors } from '../context/ThemeContext'

export const createLoginStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		content: {
			flex: 1,
			justifyContent: 'center',
			paddingHorizontal: 24,
		},
		title: {
			fontSize: 32,
			fontWeight: 'bold',
			textAlign: 'center',
			marginBottom: 8,
			color: colors.text,
		},
		subtitle: {
			fontSize: 16,
			textAlign: 'center',
			marginBottom: 32,
			color: colors.textSecondary,
		},
		form: {
			marginBottom: 32,
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
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
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

export const createRegisterStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		scrollContent: {
			flexGrow: 1,
			justifyContent: 'center',
			paddingHorizontal: 24,
			paddingVertical: 20,
		},
		content: {
			flex: 1,
			justifyContent: 'center',
		},
		title: {
			fontSize: 32,
			fontWeight: 'bold',
			textAlign: 'center',
			marginBottom: 8,
			color: colors.text,
		},
		subtitle: {
			fontSize: 16,
			textAlign: 'center',
			marginBottom: 32,
			color: colors.textSecondary,
		},
		form: {
			marginBottom: 32,
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
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
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

export const createForgotPasswordStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		content: {
			flex: 1,
			justifyContent: 'center',
			paddingHorizontal: 24,
		},
		iconContainer: {
			alignItems: 'center',
			marginBottom: 24,
		},
		icon: {
			fontSize: 64,
		},
		title: {
			fontSize: 32,
			fontWeight: 'bold',
			textAlign: 'center',
			marginBottom: 8,
			color: colors.text,
		},
		subtitle: {
			fontSize: 16,
			textAlign: 'center',
			marginBottom: 32,
			color: colors.textSecondary,
			lineHeight: 24,
		},
		form: {
			marginBottom: 32,
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
			alignItems: 'center',
			marginBottom: 16,
		},
		submitButtonText: {
			color: colors.textOnPrimary,
			fontSize: 18,
			fontWeight: 'bold',
		},
		disabledButton: {
			backgroundColor: colors.textSecondary,
		},
		backButton: {
			alignItems: 'center',
			paddingVertical: 12,
		},
		backButtonText: {
			color: colors.primary,
			fontSize: 16,
			fontWeight: '600',
		},
	})

export const createEmailVerificationStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		content: {
			flex: 1,
			justifyContent: 'center',
			paddingHorizontal: 24,
		},
		iconContainer: {
			alignItems: 'center',
			marginBottom: 24,
		},
		icon: {
			fontSize: 64,
		},
		title: {
			fontSize: 32,
			fontWeight: 'bold',
			textAlign: 'center',
			marginBottom: 16,
			color: colors.text,
		},
		subtitle: {
			fontSize: 16,
			textAlign: 'center',
			marginBottom: 8,
			color: colors.textSecondary,
		},
		email: {
			fontSize: 18,
			fontWeight: '600',
			textAlign: 'center',
			marginBottom: 16,
			color: colors.primary,
		},
		description: {
			fontSize: 16,
			textAlign: 'center',
			marginBottom: 40,
			color: colors.textSecondary,
			lineHeight: 24,
		},
		actions: {
			gap: 16,
		},
		primaryButton: {
			backgroundColor: colors.primary,
			borderRadius: 8,
			paddingVertical: 14,
			alignItems: 'center',
		},
		primaryButtonText: {
			color: colors.textOnPrimary,
			fontSize: 18,
			fontWeight: 'bold',
		},
		secondaryButton: {
			borderWidth: 2,
			borderColor: colors.primary,
			borderRadius: 8,
			paddingVertical: 14,
			alignItems: 'center',
			minHeight: 48,
			justifyContent: 'center',
		},
		secondaryButtonText: {
			color: colors.primary,
			fontSize: 16,
			fontWeight: '600',
		},
		disabledButton: {
			borderColor: colors.textSecondary,
		},
		logoutButton: {
			alignItems: 'center',
			paddingVertical: 12,
		},
		logoutButtonText: {
			color: colors.textSecondary,
			fontSize: 16,
			fontWeight: '500',
		},
	})

export const createChangePasswordStyles = (colors: ThemeColors) =>
	StyleSheet.create({
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
			justifyContent: 'center',
		},
		title: {
			fontSize: 32,
			fontWeight: 'bold',
			textAlign: 'center',
			marginBottom: 8,
			color: colors.text,
		},
		subtitle: {
			fontSize: 16,
			textAlign: 'center',
			marginBottom: 32,
			color: colors.textSecondary,
			lineHeight: 24,
		},
		form: {
			marginBottom: 32,
		},
		inputContainer: {
			position: 'relative',
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
			position: 'absolute',
			right: 12,
			top: 12,
			padding: 4,
		},
		showPasswordText: {
			color: colors.primary,
			fontSize: 14,
			fontWeight: '600',
		},
		eyeButton: {
			position: 'absolute',
			right: 12,
			top: 12,
			padding: 4,
		},
		eyeText: {
			color: colors.primary,
			fontSize: 14,
			fontWeight: '600',
		},
		requirements: {
			marginBottom: 24,
		},
		requirementsTitle: {
			fontSize: 16,
			fontWeight: '600',
			marginBottom: 8,
			color: colors.text,
		},
		requirement: {
			flexDirection: 'row',
			alignItems: 'center',
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
			flexDirection: 'row',
			gap: 12,
		},
		changeButton: {
			flex: 1,
			backgroundColor: colors.primary,
			borderRadius: 8,
			paddingVertical: 14,
			alignItems: 'center',
		},
		changeButtonText: {
			color: colors.textOnPrimary,
			fontSize: 18,
			fontWeight: 'bold',
		},
		submitButton: {
			flex: 1,
			backgroundColor: colors.primary,
			borderRadius: 8,
			paddingVertical: 14,
			alignItems: 'center',
		},
		submitButtonText: {
			color: colors.textOnPrimary,
			fontSize: 18,
			fontWeight: 'bold',
		},
		cancelButton: {
			flex: 1,
			borderWidth: 2,
			borderColor: colors.border,
			borderRadius: 8,
			paddingVertical: 14,
			alignItems: 'center',
		},
		cancelButtonText: {
			color: colors.textSecondary,
			fontSize: 16,
			fontWeight: '600',
		},
		disabledButton: {
			backgroundColor: colors.textSecondary,
		},
	})
