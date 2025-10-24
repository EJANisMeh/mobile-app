import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'
import type { ResponsiveDimensionsReturn } from '../../types/hookTypes/useResponsiveDimensions'

export const createPaymentMethodsStyles = (
	colors: ThemeColors,
	responsive: ResponsiveDimensionsReturn
) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		scrollContent: {
			padding: responsive.getResponsivePadding().horizontal,
			paddingBottom: 100, // Space for action buttons
		},
		loadingContainer: {
			flex: 1,
			justifyContent: 'center' as const,
			alignItems: 'center' as const,
			backgroundColor: colors.background,
		},
		loadingText: {
			marginTop: responsive.getResponsiveMargin().small,
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.text,
		},
		// Info Section
		infoSection: {
			flexDirection: 'row' as const,
			padding: responsive.getResponsiveMargin().medium,
			backgroundColor: colors.primary + '15',
			borderRadius: 10,
			marginBottom: responsive.getResponsiveMargin().large,
			alignItems: 'flex-start' as const,
		},
		infoText: {
			flex: 1,
			marginLeft: responsive.getResponsiveMargin().small,
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
			fontWeight: '600' as const,
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
			flexDirection: 'row' as const,
			justifyContent: 'space-between' as const,
			alignItems: 'center' as const,
			marginBottom: responsive.getResponsiveMargin().medium,
		},
		methodTitleRow: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			flex: 1,
		},
		methodIcon: {
			marginRight: responsive.getResponsiveMargin().small,
		},
		methodTitle: {
			fontSize: responsive.getResponsiveFontSize(18),
			fontWeight: '600' as const,
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
			fontWeight: 'bold' as const,
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
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
			padding: responsive.getResponsiveSpacing().md,
			borderRadius: 10,
			borderWidth: 2,
			borderColor: colors.primary,
			borderStyle: 'dashed' as const,
			marginTop: responsive.getResponsiveMargin().small,
		},
		addButtonText: {
			fontSize: responsive.getResponsiveFontSize(16),
			color: colors.primary,
			fontWeight: '600' as const,
			marginLeft: responsive.getResponsiveMargin().small,
		},
		// Add Options
		addOptionsContainer: {
			marginTop: responsive.getResponsiveMargin().medium,
			gap: responsive.getResponsiveMargin().small,
		},
		addOptionButton: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
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
			fontWeight: '500' as const,
		},
		addOptionTextDisabled: {
			color: colors.placeholder,
		},
		addedLabel: {
			fontSize: responsive.getResponsiveFontSize(12),
			color: colors.placeholder,
			fontStyle: 'italic' as const,
		},
		// Action Buttons
		actionButtonsContainer: {
			position: 'absolute' as const,
			bottom: 0,
			left: 0,
			right: 0,
			flexDirection: 'row' as const,
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
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
		},
		cancelButtonText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: colors.text,
		},
		saveButton: {
			flex: 1,
			flexDirection: 'row' as const,
			padding: responsive.getResponsiveSpacing().md,
			borderRadius: 10,
			backgroundColor: colors.primary,
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
		},
		saveButtonDisabled: {
			opacity: 0.6,
		},
		saveButtonIcon: {
			marginRight: responsive.getResponsiveMargin().small,
		},
		saveButtonText: {
			fontSize: responsive.getResponsiveFontSize(16),
			fontWeight: '600' as const,
			color: '#fff',
		},
	})
