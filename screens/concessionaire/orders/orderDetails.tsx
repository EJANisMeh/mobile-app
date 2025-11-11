import React, { useState, useCallback } from 'react'
import {
	View,
	Text,
	ScrollView,
	ActivityIndicator,
	TouchableOpacity,
} from 'react-native'
import { useFocusEffect, useRoute, RouteProp } from '@react-navigation/native'
import { DynamicKeyboardView } from '../../../components'
import {
	OrderActionButtons,
	ConfirmedOrderActionButtons,
	ReadyOrderActionButtons,
	OrderInformationSection,
	PaymentInformationSection,
} from '../../../components/concessionaire/orders/orderDetails'
import {
	AlertModal,
	ConfirmationModal,
	FeedbackInputModal,
	RescheduleModal,
	PriceAdjustmentModal,
} from '../../../components/modals'
import { useThemeContext, useAuthContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { useAlertModal, useConfirmationModal } from '../../../hooks/useModals'
import { createConcessionaireOrderDetailsStyles } from '../../../styles/concessionaire'
import { orderApi } from '../../../services/api'
import type { ConcessionaireStackParamList } from '../../../types/navigation'
import type { ConcessionOrder } from '../../../types'
import { ORDER_STATUS_CODES } from '../../../utils'

const OrderDetailsScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const { user } = useAuthContext()
	const responsive = useResponsiveDimensions()
	const route =
		useRoute<RouteProp<ConcessionaireStackParamList, 'OrderDetails'>>()
	const styles = createConcessionaireOrderDetailsStyles(colors, responsive)
	const alertModal = useAlertModal()
	const confirmationModal = useConfirmationModal()

	const [order, setOrder] = useState<ConcessionOrder | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [processing, setProcessing] = useState(false)
	const [acceptModalVisible, setAcceptModalVisible] = useState(false)
	const [declineModalVisible, setDeclineModalVisible] = useState(false)
	const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false)
	const [markReadyModalVisible, setMarkReadyModalVisible] = useState(false)
	const [cancelOrderModalVisible, setCancelOrderModalVisible] = useState(false)
	const [markCompleteModalVisible, setMarkCompleteModalVisible] =
		useState(false)
	const [priceAdjustmentModalVisible, setPriceAdjustmentModalVisible] =
		useState(false)

	const orderId = route.params?.orderId

	const loadOrderDetails = useCallback(async () => {
		if (!orderId) {
			setError('Order ID not provided')
			setLoading(false)
			return
		}

		setLoading(true)
		setError(null)
		try {
			const response = await orderApi.getOrderDetails(orderId)
			if (response.success && response.order) {
				setOrder(response.order as ConcessionOrder)
			} else {
				setError(response.error || 'Failed to load order details')
			}
		} catch (err) {
			console.error('Load order details error:', err)
			setError('Failed to load order details. Please try again.')
		} finally {
			setLoading(false)
		}
	}, [orderId])

	useFocusEffect(
		useCallback(() => {
			void loadOrderDetails()
		}, [loadOrderDetails])
	)

	const formatCurrency = (value: number | string | undefined) => {
		const numValue = typeof value === 'string' ? parseFloat(value) : value
		return numValue !== undefined && !isNaN(numValue)
			? `₱${numValue.toFixed(2)}`
			: '₱0.00'
	}

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	const handleAcceptOrder = async () => {
		if (!order) {
			return
		}
		setAcceptModalVisible(true)
	}

	const handleAcceptConfirm = async (feedback: string) => {
		if (!order) {
			return
		}

		setProcessing(true)
		try {
			const response = await orderApi.updateOrderStatus(
				order.id,
				ORDER_STATUS_CODES.CONFIRMED,
				feedback
			)

			if (response.success) {
				setAcceptModalVisible(false)
				alertModal.showAlert({
					title: 'Success',
					message: 'Order accepted successfully',
				})
				setTimeout(() => {
					void loadOrderDetails()
				}, 1500)
			} else {
				throw new Error(response.error || 'Failed to accept order')
			}
		} catch (err) {
			console.error('Accept order error:', err)
			alertModal.showAlert({
				title: 'Error',
				message: 'Failed to accept order. Please try again.',
			})
		} finally {
			setProcessing(false)
		}
	}

	const handleDeclineOrder = async () => {
		if (!order) {
			return
		}
		setDeclineModalVisible(true)
	}

	const handleDeclineConfirm = async (feedback: string) => {
		if (!order) {
			return
		}

		setProcessing(true)
		try {
			const response = await orderApi.updateOrderStatus(
				order.id,
				ORDER_STATUS_CODES.DECLINED,
				feedback
			)

			if (response.success) {
				setDeclineModalVisible(false)
				alertModal.showAlert({
					title: 'Success',
					message: 'Order declined',
				})
				setTimeout(() => {
					void loadOrderDetails()
				}, 1500)
			} else {
				throw new Error(response.error || 'Failed to decline order')
			}
		} catch (err) {
			console.error('Decline order error:', err)
			alertModal.showAlert({
				title: 'Error',
				message: 'Failed to decline order. Please try again.',
			})
		} finally {
			setProcessing(false)
		}
	}

	const handleRescheduleOrder = async () => {
		if (!order) {
			return
		}
		setRescheduleModalVisible(true)
	}

	const handleRescheduleConfirm = async (newDate: Date, feedback: string) => {
		if (!order) {
			return
		}

		setProcessing(true)
		try {
			const response = await orderApi.rescheduleOrder(
				order.id,
				newDate,
				feedback
			)

			if (response.success) {
				setRescheduleModalVisible(false)
				alertModal.showAlert({
					title: 'Success',
					message: 'Order rescheduled successfully',
				})
				setTimeout(() => {
					void loadOrderDetails()
				}, 1500)
			} else {
				throw new Error(response.error || 'Failed to reschedule order')
			}
		} catch (err) {
			console.error('Reschedule order error:', err)
			alertModal.showAlert({
				title: 'Error',
				message: 'Failed to reschedule order. Please try again.',
			})
		} finally {
			setProcessing(false)
		}
	}

	const handleMarkAsReady = async () => {
		if (!order) {
			return
		}
		setMarkReadyModalVisible(true)
	}

	const handleMarkReadyConfirm = async (feedback: string) => {
		if (!order) {
			return
		}

		setProcessing(true)
		try {
			const response = await orderApi.updateOrderStatus(
				order.id,
				ORDER_STATUS_CODES.READY,
				feedback
			)

			if (response.success) {
				setMarkReadyModalVisible(false)
				alertModal.showAlert({
					title: 'Success',
					message: 'Order marked as ready',
				})
				setTimeout(() => {
					void loadOrderDetails()
				}, 1500)
			} else {
				throw new Error(response.error || 'Failed to mark order as ready')
			}
		} catch (err) {
			console.error('Mark ready error:', err)
			alertModal.showAlert({
				title: 'Error',
				message: 'Failed to mark order as ready. Please try again.',
			})
		} finally {
			setProcessing(false)
		}
	}

	const handleCancelOrder = async () => {
		if (!order) {
			return
		}
		setCancelOrderModalVisible(true)
	}

	const handleCancelOrderConfirm = async (feedback: string) => {
		if (!order) {
			return
		}

		setProcessing(true)
		try {
			const response = await orderApi.updateOrderStatus(
				order.id,
				ORDER_STATUS_CODES.CANCELLED,
				feedback
			)

			if (response.success) {
				setCancelOrderModalVisible(false)
				alertModal.showAlert({
					title: 'Success',
					message: 'Order cancelled',
				})
				setTimeout(() => {
					void loadOrderDetails()
				}, 1500)
			} else {
				throw new Error(response.error || 'Failed to cancel order')
			}
		} catch (err) {
			console.error('Cancel order error:', err)
			alertModal.showAlert({
				title: 'Error',
				message: 'Failed to cancel order. Please try again.',
			})
		} finally {
			setProcessing(false)
		}
	}

	const handleMarkAsComplete = async () => {
		if (!order) {
			return
		}
		setMarkCompleteModalVisible(true)
	}

	const handleMarkCompleteConfirm = async (feedback: string) => {
		if (!order) {
			return
		}

		setProcessing(true)
		try {
			const response = await orderApi.updateOrderStatus(
				order.id,
				ORDER_STATUS_CODES.COMPLETED,
				feedback
			)

			if (response.success) {
				setMarkCompleteModalVisible(false)
				alertModal.showAlert({
					title: 'Success',
					message: 'Order marked as complete',
				})
				setTimeout(() => {
					void loadOrderDetails()
				}, 1500)
			} else {
				throw new Error(response.error || 'Failed to mark order as complete')
			}
		} catch (err) {
			console.error('Mark complete error:', err)
			alertModal.showAlert({
				title: 'Error',
				message: 'Failed to mark order as complete. Please try again.',
			})
		} finally {
			setProcessing(false)
		}
	}

	const handlePriceAdjustment = () => {
		if (!order) {
			return
		}
		setPriceAdjustmentModalVisible(true)
	}

	const handlePriceAdjustmentConfirm = async (
		newTotal: number,
		reason: string
	) => {
		if (!order) {
			return
		}

		setProcessing(true)
		try {
			const response = await orderApi.adjustOrderPrice(
				order.id,
				newTotal,
				reason
			)

			if (response.success) {
				setPriceAdjustmentModalVisible(false)
				alertModal.showAlert({
					title: 'Success',
					message: 'Order price adjusted successfully',
				})
				setTimeout(() => {
					void loadOrderDetails()
				}, 1500)
			} else {
				throw new Error(response.error || 'Failed to adjust order price')
			}
		} catch (err) {
			console.error('Adjust price error:', err)
			alertModal.showAlert({
				title: 'Error',
				message: 'Failed to adjust order price. Please try again.',
			})
		} finally {
			setProcessing(false)
		}
	}

	const canManageOrder =
		order?.order_statuses?.code === ORDER_STATUS_CODES.PENDING

	const canMarkReady =
		order?.order_statuses?.code === ORDER_STATUS_CODES.CONFIRMED

	const canMarkComplete =
		order?.order_statuses?.code === ORDER_STATUS_CODES.READY

	if (loading) {
		return (
			<DynamicKeyboardView
				style={styles.container}
				useSafeArea={true}>
				<View style={styles.centerContainer}>
					<ActivityIndicator
						size="large"
						color={colors.primary}
					/>
					<Text style={styles.loadingText}>Loading order details...</Text>
				</View>
			</DynamicKeyboardView>
		)
	}

	if (error || !order) {
		return (
			<DynamicKeyboardView
				style={styles.container}
				useSafeArea={true}>
				<View style={styles.centerContainer}>
					<Text style={styles.errorTitle}>Unable to load order</Text>
					<Text style={styles.errorMessage}>{error || 'Order not found'}</Text>
					<TouchableOpacity
						style={styles.retryButton}
						onPress={loadOrderDetails}>
						<Text style={styles.retryButtonText}>Retry</Text>
					</TouchableOpacity>
				</View>
			</DynamicKeyboardView>
		)
	}

	return (
		<DynamicKeyboardView style={styles.container}>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={true}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>
						Order #
						{order.concession_order_number
							? `${order.concession_order_number}`
							: order.id}
					</Text>
					<View style={styles.statusBadge}>
						<Text style={styles.statusText}>
							{order.order_statuses?.code || 'Unknown'}
						</Text>
					</View>
				</View>

				{/* Action Buttons - only show for pending orders */}
				{canManageOrder && (
					<OrderActionButtons
						onAcceptOrder={handleAcceptOrder}
						onDeclineOrder={handleDeclineOrder}
						onRescheduleOrder={handleRescheduleOrder}
						isProcessing={processing}
						colors={colors}
						styles={styles}
					/>
				)}

				{/* Action Buttons for confirmed orders */}
				{canMarkReady && (
					<ConfirmedOrderActionButtons
						onMarkAsReady={handleMarkAsReady}
						onCancelOrder={handleCancelOrder}
						isProcessing={processing}
						colors={colors}
						styles={styles}
					/>
				)}

				{/* Action Buttons for ready orders */}
				{canMarkComplete && (
					<ReadyOrderActionButtons
						onMarkAsComplete={handleMarkAsComplete}
						onCancelOrder={handleCancelOrder}
						isProcessing={processing}
						colors={colors}
						styles={styles}
					/>
				)}

				{/* Order Information */}
				<OrderInformationSection
					orderMode={order.orderMode}
					orderItems={order.orderItems}
					total={Number(order.total)}
					scheduledFor={order.scheduledFor}
					createdAt={order.createdAt}
					updatedAt={order.updatedAt}
					formatCurrency={formatCurrency}
					formatDate={formatDate}
					styles={styles}
				/>

				{/* Price Adjustment Section */}
				{order.original_total && order.price_adjustment_reason && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Price Adjustment</Text>
						<View style={styles.detailRow}>
							<Text style={styles.detailLabel}>Original Total:</Text>
							<Text style={styles.detailValue}>
								{formatCurrency(Number(order.original_total))}
							</Text>
						</View>
						<View style={styles.detailRow}>
							<Text style={styles.detailLabel}>Adjusted Total:</Text>
							<Text style={[styles.detailValue, { fontWeight: 'bold' }]}>
								{formatCurrency(Number(order.total))}
							</Text>
						</View>
						<View style={styles.detailRow}>
							<Text style={styles.detailLabel}>Reason:</Text>
							<Text
								style={[styles.detailValue, { flex: 1, textAlign: 'right' }]}>
								{order.price_adjustment_reason}
							</Text>
						</View>
					</View>
				)}

				{/* Price Adjustment Button - only show for certain statuses */}
				{(order.order_statuses?.code === ORDER_STATUS_CODES.PENDING ||
					order.order_statuses?.code === ORDER_STATUS_CODES.CONFIRMED) && (
					<TouchableOpacity
						style={styles.priceAdjustmentButton}
						onPress={handlePriceAdjustment}
						disabled={processing}>
						<Text style={styles.priceAdjustmentButtonText}>Adjust Price</Text>
					</TouchableOpacity>
				)}

				{/* Payment Information */}
				<PaymentInformationSection
					paymentMode={order.payment_mode}
					paymentProof={order.payment_proof}
					formatDate={formatDate}
					styles={styles}
					colors={colors}
				/>

				{/* Concession Note if exists */}
				{order.concession_note && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Concession Note</Text>
						<Text style={styles.detailValue}>{order.concession_note}</Text>
					</View>
				)}
			</ScrollView>

			<AlertModal
				visible={alertModal.visible}
				onClose={alertModal.handleClose}
				title={alertModal.title}
				message={alertModal.message}
			/>

			<ConfirmationModal
				visible={confirmationModal.visible}
				onClose={confirmationModal.hideConfirmation}
				title={confirmationModal.props.title}
				message={confirmationModal.props.message}
				confirmText={confirmationModal.props.confirmText}
				cancelText={confirmationModal.props.cancelText}
				onConfirm={confirmationModal.props.onConfirm}
				onCancel={confirmationModal.props.onCancel}
				confirmStyle={confirmationModal.props.confirmStyle}
			/>

			<FeedbackInputModal
				visible={acceptModalVisible}
				onClose={() => setAcceptModalVisible(false)}
				onConfirm={handleAcceptConfirm}
				title="Accept Order"
				message="Provide feedback to the customer about accepting their order."
				confirmText="Accept Order"
				cancelText="Cancel"
				confirmStyle="default"
				placeholder="e.g., Your order has been accepted and will be ready soon!"
				required={false}
				isProcessing={processing}
			/>

			<FeedbackInputModal
				visible={declineModalVisible}
				onClose={() => setDeclineModalVisible(false)}
				onConfirm={handleDeclineConfirm}
				title="Decline Order"
				message="You must provide a reason for declining this order."
				confirmText="Decline Order"
				cancelText="Cancel"
				confirmStyle="destructive"
				placeholder="e.g., Sorry, we're out of stock for this item..."
				required={true}
				isProcessing={processing}
			/>

			<RescheduleModal
				visible={rescheduleModalVisible}
				onClose={() => setRescheduleModalVisible(false)}
				onConfirm={handleRescheduleConfirm}
				currentScheduledDate={order?.scheduledFor || null}
				isProcessing={processing}
			/>

			<FeedbackInputModal
				visible={markReadyModalVisible}
				onClose={() => setMarkReadyModalVisible(false)}
				onConfirm={handleMarkReadyConfirm}
				title="Mark Order as Ready"
				message="Optionally provide a note to the customer about their order being ready."
				confirmText="Mark as Ready"
				cancelText="Cancel"
				confirmStyle="default"
				placeholder="Optionally provide a comment"
				required={false}
				isProcessing={processing}
			/>

			<FeedbackInputModal
				visible={cancelOrderModalVisible}
				onClose={() => setCancelOrderModalVisible(false)}
				onConfirm={handleCancelOrderConfirm}
				title="Cancel Order"
				message="Optionally provide a reason for cancelling this order."
				confirmText="Cancel Order"
				cancelText="Go Back"
				confirmStyle="destructive"
				placeholder="e.g., Unable to fulfill this order..."
				required={false}
				isProcessing={processing}
			/>

			<FeedbackInputModal
				visible={markCompleteModalVisible}
				onClose={() => setMarkCompleteModalVisible(false)}
				onConfirm={handleMarkCompleteConfirm}
				title="Mark Order as Complete"
				message="Optionally provide a note to the customer about their completed order."
				confirmText="Mark as Complete"
				cancelText="Cancel"
				confirmStyle="default"
				placeholder="e.g., Thank you for your order!"
				required={false}
				isProcessing={processing}
			/>

			<PriceAdjustmentModal
				visible={priceAdjustmentModalVisible}
				onClose={() => setPriceAdjustmentModalVisible(false)}
				onConfirm={handlePriceAdjustmentConfirm}
				currentTotal={Number(order?.total || 0)}
				isProcessing={processing}
			/>
		</DynamicKeyboardView>
	)
}

export default OrderDetailsScreen
