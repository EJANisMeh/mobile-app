import { StyleSheet } from 'react-native'
import { ThemeColors } from '../../types/theme'

export const createConcessionStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		scrollContent: {
			padding: 20,
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
		headerSection: {
			marginBottom: 24,
		},
		concessionName: {
			fontSize: 28,
			fontWeight: 'bold',
			color: colors.text,
			marginBottom: 8,
		},
		concessionDescription: {
			fontSize: 16,
			color: colors.placeholder,
			lineHeight: 22,
		},
		noDescription: {
			fontSize: 14,
			color: colors.placeholder,
			fontStyle: 'italic',
		},
		statusSection: {
			marginBottom: 24,
		},
		sectionTitle: {
			fontSize: 18,
			fontWeight: '600',
			color: colors.text,
			marginBottom: 12,
		},
		statusButton: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: 16,
			borderRadius: 12,
			borderWidth: 1,
		},
		statusButtonOpen: {
			backgroundColor: '#e8f5e9',
			borderColor: '#4caf50',
		},
		statusButtonClosed: {
			backgroundColor: '#ffebee',
			borderColor: '#f44336',
		},
		statusButtonContent: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		statusIcon: {
			marginRight: 12,
		},
		statusText: {
			fontSize: 16,
			fontWeight: '600',
		},
		statusTextOpen: {
			color: '#2e7d32',
		},
		statusTextClosed: {
			color: '#c62828',
		},
		statusToggleText: {
			fontSize: 14,
			color: colors.placeholder,
		},
		actionsSection: {
			marginBottom: 24,
		},
		actionButton: {
			flexDirection: 'row',
			alignItems: 'center',
			padding: 16,
			backgroundColor: colors.card,
			borderRadius: 12,
			marginBottom: 12,
			borderWidth: 1,
			borderColor: colors.border,
		},
		actionIcon: {
			marginRight: 12,
		},
		actionText: {
			fontSize: 16,
			color: colors.text,
			flex: 1,
		},
		actionArrow: {
			marginLeft: 8,
		},
		paymentMethodsSection: {
			marginBottom: 24,
		},
		paymentMethodsList: {
			marginTop: 8,
		},
		paymentMethodItem: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: 14,
			backgroundColor: colors.card,
			borderRadius: 10,
			marginBottom: 8,
			borderWidth: 1,
			borderColor: colors.border,
		},
		paymentMethodDefault: {
			backgroundColor: colors.primary + '15',
			borderColor: colors.primary,
		},
		paymentMethodContent: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		paymentMethodIcon: {
			marginRight: 10,
		},
		paymentMethodText: {
			fontSize: 15,
			color: colors.text,
			textTransform: 'capitalize',
		},
		paymentMethodDefaultText: {
			color: colors.primary,
			fontWeight: '600',
		},
		defaultBadge: {
			backgroundColor: colors.primary,
			paddingHorizontal: 8,
			paddingVertical: 4,
			borderRadius: 6,
		},
		defaultBadgeText: {
			color: '#fff',
			fontSize: 11,
			fontWeight: 'bold',
		},
		addPaymentButton: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			padding: 14,
			borderRadius: 10,
			borderWidth: 2,
			borderColor: colors.primary,
			borderStyle: 'dashed',
			marginTop: 4,
		},
		addPaymentButtonText: {
			fontSize: 15,
			color: colors.primary,
			fontWeight: '600',
			marginLeft: 8,
		},
		showMoreText: {
			color: colors.primary,
			fontWeight: '600',
			marginTop: 6,
			textAlign: 'right',
		},
	})
