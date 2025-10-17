import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'

export const createPaymentMethodsStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		scrollContent: {
			padding: 20,
			paddingBottom: 100, // Space for action buttons
		},
		loadingContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: colors.background,
		},
		loadingText: {
			marginTop: 10,
			fontSize: 16,
			color: colors.text,
		},
		// Info Section
		infoSection: {
			flexDirection: 'row',
			padding: 12,
			backgroundColor: colors.primary + '15',
			borderRadius: 10,
			marginBottom: 24,
			alignItems: 'flex-start',
		},
		infoText: {
			flex: 1,
			marginLeft: 10,
			fontSize: 14,
			color: colors.text,
			lineHeight: 20,
		},
		// Methods Section
		methodsSection: {
			marginBottom: 20,
		},
		sectionTitle: {
			fontSize: 18,
			fontWeight: '600',
			color: colors.text,
			marginBottom: 16,
		},
		methodCard: {
			backgroundColor: colors.card,
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: 12,
			padding: 16,
			marginBottom: 12,
		},
		methodHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 12,
		},
		methodTitleRow: {
			flexDirection: 'row',
			alignItems: 'center',
			flex: 1,
		},
		methodIcon: {
			marginRight: 10,
		},
		methodTitle: {
			fontSize: 18,
			fontWeight: '600',
			color: colors.text,
		},
		defaultBadge: {
			backgroundColor: colors.primary,
			paddingHorizontal: 8,
			paddingVertical: 4,
			borderRadius: 6,
			marginLeft: 10,
		},
		defaultBadgeText: {
			color: '#fff',
			fontSize: 11,
			fontWeight: 'bold',
		},
		removeButton: {
			padding: 4,
		},
		detailsInput: {
			backgroundColor: colors.background,
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: 8,
			padding: 12,
			fontSize: 15,
			color: colors.text,
			minHeight: 48,
		},
		detailsInputReadonly: {
			backgroundColor: colors.card,
			color: colors.placeholder,
		},
		// Add Button
		addButton: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			padding: 16,
			borderRadius: 10,
			borderWidth: 2,
			borderColor: colors.primary,
			borderStyle: 'dashed',
			marginTop: 8,
		},
		addButtonText: {
			fontSize: 16,
			color: colors.primary,
			fontWeight: '600',
			marginLeft: 8,
		},
		// Add Options
		addOptionsContainer: {
			marginTop: 12,
			gap: 8,
		},
		addOptionButton: {
			flexDirection: 'row',
			alignItems: 'center',
			padding: 14,
			backgroundColor: colors.card,
			borderRadius: 10,
			borderWidth: 1,
			borderColor: colors.border,
		},
		addOptionButtonDisabled: {
			opacity: 0.5,
		},
		optionIcon: {
			marginRight: 12,
		},
		addOptionText: {
			flex: 1,
			fontSize: 16,
			color: colors.text,
			fontWeight: '500',
		},
		addOptionTextDisabled: {
			color: colors.placeholder,
		},
		addedLabel: {
			fontSize: 12,
			color: colors.placeholder,
			fontStyle: 'italic',
		},
		// Action Buttons
		actionButtonsContainer: {
			position: 'absolute',
			bottom: 0,
			left: 0,
			right: 0,
			flexDirection: 'row',
			padding: 16,
			backgroundColor: colors.background,
			borderTopWidth: 1,
			borderTopColor: colors.border,
			gap: 12,
		},
		cancelButton: {
			flex: 1,
			padding: 16,
			borderRadius: 10,
			borderWidth: 1,
			borderColor: colors.border,
			alignItems: 'center',
			justifyContent: 'center',
		},
		cancelButtonText: {
			fontSize: 16,
			fontWeight: '600',
			color: colors.text,
		},
		saveButton: {
			flex: 1,
			flexDirection: 'row',
			padding: 16,
			borderRadius: 10,
			backgroundColor: colors.primary,
			alignItems: 'center',
			justifyContent: 'center',
		},
		saveButtonDisabled: {
			opacity: 0.6,
		},
		saveButtonIcon: {
			marginRight: 8,
		},
		saveButtonText: {
			fontSize: 16,
			fontWeight: '600',
			color: '#fff',
		},
	})
