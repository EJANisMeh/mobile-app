import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createPaymentMethodsStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) =>
	StyleSheet.create({
		container: {
			backgroundColor: colors.background,
		},
		scrollContent: {
			paddingHorizontal: responsive.getResponsiveSpacing().xl,
			paddingVertical: responsive.getResponsiveSpacing().md,
			paddingBottom: 100, // Space for action buttons
		},
		loadingContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: colors.background,
		},
		loadingText: {
			marginTop: responsive.getResponsiveMargin().small,
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.text,
		},
		// Info Section
		infoSection: {
			flexDirection: 'row',
			marginBottom: responsive.getResponsiveMargin().large,
			alignItems: 'flex-start',
		},
		infoText: {
			flex: 1,
			fontSize: responsive.getResponsiveFontSize(14),
			color: colors.text,
			lineHeight: 20,
		},
		// Methods Section
		methodsSection: {
			marginBottom: responsive.getResponsivePadding().vertical,
		},
		sectionTitle: {
			fontSize: responsive.getResponsiveFontSize(18),
			fontWeight: '600',
			color: colors.text,
			marginBottom: responsive.getResponsiveSpacing().md,
		},
		methodCard: {
			backgroundColor: colors.card,
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: 12,
			padding: responsive.getResponsiveSpacing().md,
			marginBottom: responsive.getResponsiveMargin().medium,
		},
		methodHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: responsive.getResponsiveMargin().medium,
		},
		methodTitleRow: {
			flexDirection: 'row',
			alignItems: 'center',
			flex: 1,
		},
		methodIcon: {
			marginRight: responsive.getResponsiveMargin().small,
		},
		methodTitle: {
			fontSize: responsive.getResponsiveFontSize(18),
			fontWeight: '600',
			color: colors.text,
		},
		defaultBadge: {
			backgroundColor: colors.primary,
			paddingHorizontal: responsive.getResponsiveMargin().small,
			paddingVertical: 4,
			borderRadius: 6,
			marginLeft: responsive.getResponsiveMargin().small,
		},
		defaultBadgeText: {
			color: '#fff',
			fontSize: responsive.getResponsiveFontSize(11),
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
			padding: responsive.getResponsiveMargin().medium,
			fontSize: responsive.getResponsiveFontSize(15),
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
			padding: responsive.getResponsiveSpacing().md,
			borderRadius: 10,
			borderWidth: 2,
			borderColor: colors.primary,
			borderStyle: 'dashed',
			marginTop: responsive.getResponsiveMargin().small,
			marginBottom: responsive.getResponsiveMargin().large,
		},
		addButtonText: {
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.primary,
			fontWeight: '600',
			marginLeft: responsive.getResponsiveMargin().small,
		},
		// Add Input Container
		addInputContainer: {
			backgroundColor: colors.card,
			borderWidth: 1,
			borderColor: colors.primary,
			borderRadius: 12,
			padding: responsive.getResponsiveSpacing().md,
			marginTop: responsive.getResponsiveMargin().small,
			marginBottom: responsive.getResponsiveMargin().large,
		},
		addInputTitle: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600',
			color: colors.text,
			marginBottom: responsive.getResponsiveMargin().medium,
		},
		addInput: {
			backgroundColor: colors.background,
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: 8,
			padding: responsive.getResponsiveMargin().medium,
			fontSize: responsive.getResponsiveFontSize(15),
			color: colors.text,
			minHeight: 48,
			marginBottom: responsive.getResponsiveMargin().small,
		},
		addInputMultiline: {
			minHeight: 80,
			textAlignVertical: 'top',
		},
		addInputActions: {
			flexDirection: 'row',
			gap: responsive.getResponsiveMargin().small,
			marginTop: responsive.getResponsiveMargin().small,
		},
		addInputCancelButton: {
			flex: 1,
			padding: responsive.getResponsiveSpacing().sm,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.border,
			alignItems: 'center',
			justifyContent: 'center',
		},
		addInputCancelText: {
			fontSize: responsive.getResponsiveFontSize(15),
			fontWeight: '600',
			color: colors.text,
		},
		addInputAddButton: {
			flex: 1,
			flexDirection: 'row',
			padding: responsive.getResponsiveSpacing().sm,
			borderRadius: 8,
			backgroundColor: colors.primary,
			alignItems: 'center',
			justifyContent: 'center',
			gap: responsive.getResponsiveMargin().small,
		},
		addInputAddButtonDisabled: {
			opacity: 0.5,
		},
		addInputAddText: {
			fontSize: responsive.getResponsiveFontSize(15),
			fontWeight: '600',
			color: '#fff',
		},
		// Add Options
		addOptionsContainer: {
			marginTop: responsive.getResponsiveMargin().medium,
			gap: responsive.getResponsiveMargin().small,
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
			marginRight: responsive.getResponsiveMargin().medium,
		},
		addOptionText: {
			flex: 1,
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.text,
			fontWeight: '500',
		},
		addOptionTextDisabled: {
			color: colors.placeholder,
		},
		addedLabel: {
			fontSize: responsive.getResponsiveFontSize(12),
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
			padding: responsive.getResponsiveSpacing().md,
			backgroundColor: colors.background,
			borderTopWidth: 1,
			borderTopColor: colors.border,
			gap: 12,
		},
		cancelButton: {
			flex: 1,
			padding: responsive.getResponsiveSpacing().md,
			borderRadius: 10,
			borderWidth: 1,
			borderColor: colors.border,
			alignItems: 'center',
			justifyContent: 'center',
		},
		cancelButtonText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600',
			color: colors.text,
		},
		saveButton: {
			flex: 1,
			flexDirection: 'row',
			paddingHorizontal: responsive.getResponsiveSpacing().md,
			borderRadius: 10,
			backgroundColor: colors.primary,
			alignItems: 'center',
			justifyContent: 'center',
		},
		saveButtonDisabled: {
			opacity: 0.6,
		},
		saveButtonIcon: {
			marginRight: responsive.getResponsiveMargin().small,
		},
		saveButtonText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600',
			color: '#fff',
		},
	})
