import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../context/ThemeContext'

export const createProfileCreationStyles = (colors: ThemeColors) =>
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
			color: colors.text,
			marginBottom: 8,
			textAlign: 'center',
		},
		subtitle: {
			fontSize: 16,
			color: colors.textSecondary,
			marginBottom: 32,
			textAlign: 'center',
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
			alignItems: 'center',
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
			fontWeight: '600',
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
			alignItems: 'center',
			marginTop: 8,
		},
		addContactButtonText: {
			fontSize: 14,
			color: colors.primary,
			fontWeight: '600',
		},
		contactItem: {
			flexDirection: 'row',
			alignItems: 'center',
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
			justifyContent: 'center',
			alignItems: 'center',
			width: 36,
			height: 36,
		},
		removeContactText: {
			color: colors.textOnPrimary,
			fontSize: 18,
			fontWeight: 'bold',
		},
		submitButton: {
			backgroundColor: colors.primary,
			borderRadius: 8,
			padding: 16,
			alignItems: 'center',
			marginTop: 8,
		},
		disabledButton: {
			backgroundColor: colors.border,
			opacity: 0.6,
		},
		submitButtonText: {
			color: colors.textOnPrimary,
			fontSize: 16,
			fontWeight: 'bold',
		},
	})
