import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import BaseModal from '../../modals/BaseModal'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createOrderConfirmationModalStyles } from '../../../styles/customer'
import type { PaymentProof } from '../../../types'

interface OrderConfirmationModalProps {
	visible: boolean
	onClose: () => void
	onConfirm: () => void
	orderSummary: {
		itemName: string
		quantity: number
		total: number
		orderMode: 'now' | 'scheduled'
		scheduledFor: Date | null
		paymentMethod: string
		paymentDetails: string
		paymentProof: PaymentProof | null
		concessionName: string
	}
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
	visible,
	onClose,
	onConfirm,
	orderSummary,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createOrderConfirmationModalStyles(colors, responsive)

	const formatCurrency = (value: number) => `₱${value.toFixed(2)}`

	const formatScheduledDateTime = (date: Date): string => {
		const dateStr = date.toLocaleDateString(undefined, {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		})

		const hours = date.getHours()
		const minutes = date.getMinutes()
		const period = hours >= 12 ? 'PM' : 'AM'
		const twelveHour = hours % 12 === 0 ? 12 : hours % 12
		const timeStr = `${twelveHour}:${minutes
			.toString()
			.padStart(2, '0')} ${period}`

		return `${dateStr} at ${timeStr}`
	}

	return (
		<BaseModal
			visible={visible}
			onClose={onClose}
			title="Confirm Your Order">
			<ScrollView
				style={styles.scrollArea}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={true}>
				<Text style={styles.helperText}>
					Please review your order details before confirming.
				</Text>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Order Details</Text>
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Concession:</Text>
						<Text style={styles.detailValue}>
							{orderSummary.concessionName}
						</Text>
					</View>
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Item:</Text>
						<Text style={styles.detailValue}>{orderSummary.itemName}</Text>
					</View>
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Quantity:</Text>
						<Text style={styles.detailValue}>{orderSummary.quantity}</Text>
					</View>
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Total:</Text>
						<Text style={[styles.detailValue, styles.totalValue]}>
							{formatCurrency(orderSummary.total)}
						</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Order Timing</Text>
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Mode:</Text>
						<Text style={styles.detailValue}>
							{orderSummary.orderMode === 'now' ? 'Order Now' : 'Scheduled'}
						</Text>
					</View>
					{orderSummary.orderMode === 'scheduled' &&
						orderSummary.scheduledFor && (
							<View style={styles.detailRow}>
								<Text style={styles.detailLabel}>Scheduled for:</Text>
								<Text style={styles.detailValue}>
									{formatScheduledDateTime(orderSummary.scheduledFor)}
								</Text>
							</View>
						)}
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Payment</Text>
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Method:</Text>
						<Text style={styles.detailValue}>{orderSummary.paymentMethod}</Text>
					</View>
					{orderSummary.paymentDetails && (
						<View style={styles.detailRow}>
							<Text style={styles.detailLabel}>Details:</Text>
							<Text style={styles.detailValue}>
								{orderSummary.paymentDetails}
							</Text>
						</View>
					)}
					{orderSummary.paymentProof && (
						<View style={styles.detailRow}>
							<Text style={styles.detailLabel}>Proof:</Text>
							<Text style={styles.detailValue}>
								{orderSummary.paymentProof.mode === 'text'
									? 'Transaction ID provided'
									: 'Screenshot attached'}
							</Text>
						</View>
					)}
				</View>

				<View style={styles.actionsRow}>
					<TouchableOpacity
						style={[styles.actionButton, styles.cancelButton]}
						onPress={onClose}>
						<Text style={styles.actionButtonText}>Go Back</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.actionButton,
							styles.confirmButton,
							styles.actionButtonSpacing,
						]}
						onPress={onConfirm}>
						<Text style={[styles.actionButtonText, styles.confirmButtonText]}>
							Place Order
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</BaseModal>
	)
}

export default OrderConfirmationModal
