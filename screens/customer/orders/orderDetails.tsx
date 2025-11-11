import React, { useState, useCallback } from 'react'
import {
	View,
	Text,
	ScrollView,
	ActivityIndicator,
	TouchableOpacity,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { DynamicKeyboardView } from '../../../components'
import {
	PaymentInformationSection,
	PaymentProofInput,
	OrderInformationSection,
} from '../../../components/customer/orders/orderDetails'
import { AlertModal, ConfirmationModal } from '../../../components/modals'
import { useThemeContext, useAuthContext } from '../../../context'
import { useResponsiveDimensions, useCustomerNavigation } from '../../../hooks'
import { useAlertModal, useConfirmationModal } from '../../../hooks/useModals'
import { createOrderDetailsStyles } from '../../../styles/customer'
import { orderApi } from '../../../services/api'
import type { PaymentProof } from '../../../types'
import { ORDER_STATUS_CODES } from '../../../utils'

interface OrderDetailsScreenProps {}

const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = () => {
	const { colors } = useThemeContext()
	const { user } = useAuthContext()
	const responsive = useResponsiveDimensions()
	const navigation = useCustomerNavigation()
	const styles = createOrderDetailsStyles(colors, responsive)
	const alertModal = useAlertModal()
	const confirmationModal = useConfirmationModal()

	const [order, setOrder] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [proofText, setProofText] = useState('')
	const [proofImage, setProofImage] = useState<string | null>(null)
	const [submittingProof, setSubmittingProof] = useState(false)
	const [editingProof, setEditingProof] = useState(false)
	const [cancelling, setCancelling] = useState(false)

	const orderId = (
		navigation.getState().routes[navigation.getState().index]?.params as
			| { orderId?: number }
			| undefined
	)?.orderId

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
				setOrder(response.order)
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

	const handlePickImage = async () => {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync()

		if (!permissionResult.granted) {
			alertModal.showAlert({
				title: 'Permission Required',
				message: 'Permission to access gallery is required!',
			})
			return
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			quality: 0.7,
		})

		if (!result.canceled && result.assets[0]) {
			setProofImage(result.assets[0].uri)
		}
	}

	const handleRemoveImage = () => {
		setProofImage(null)
	}

	const handleSubmitProof = async () => {
		if (!order || (!proofText.trim() && !proofImage)) {
			return
		}

		setSubmittingProof(true)
		try {
			const proofData: PaymentProof = proofImage
				? { mode: 'screenshot', value: proofImage }
				: { mode: 'text', value: proofText.trim() }

			const response = await orderApi.updatePaymentProof(order.id, proofData)

			if (response.success && response.paymentProof) {
				// Update local state with server response
				setOrder({
					...order,
					payment_proof: response.paymentProof,
				})
				setProofText('')
				setProofImage(null)
				setEditingProof(false)
			} else {
				throw new Error(response.error || 'Failed to submit payment proof')
			}
		} catch (err) {
			console.error('Submit proof error:', err)
			alertModal.showAlert({
				title: 'Error',
				message: 'Failed to submit payment proof. Please try again.',
			})
		} finally {
			setSubmittingProof(false)
		}
	}

	const handleCancelOrder = async () => {
		if (!order) {
			return
		}

		if (order.order_statuses?.code !== ORDER_STATUS_CODES.PENDING) {
			alertModal.showAlert({
				title: 'Cannot Delete',
				message: 'Only pending orders can be deleted',
			})
			return
		}

		// Show confirmation modal
		confirmationModal.showConfirmation({
			title: 'Delete Order',
			message:
				'Are you sure you want to delete this order? This action cannot be undone.',
			confirmText: 'Yes, Delete',
			cancelText: 'No, Keep Order',
			confirmStyle: 'destructive',
			onConfirm: async () => {
				confirmationModal.hideConfirmation()
				setCancelling(true)
				try {
					const response = await orderApi.cancelOrder(order.id)

					if (response.success) {
						alertModal.showAlert({
							title: 'Success',
							message: 'Order deleted successfully',
						})
						// Navigate back to orders list
						setTimeout(() => {
							navigation.goBack()
						}, 1500)
					} else {
						throw new Error(response.error || 'Failed to delete order')
					}
				} catch (err) {
					console.error('Delete order error:', err)
					alertModal.showAlert({
						title: 'Error',
						message: 'Failed to delete order. Please try again.',
					})
				} finally {
					setCancelling(false)
				}
			},
			onCancel: () => {
				confirmationModal.hideConfirmation()
			},
		})
	}

	const handleEditProof = () => {
		// Load existing proof into edit fields
		if (order?.payment_proof) {
			if (order.payment_proof.mode === 'text') {
				setProofText(order.payment_proof.value || '')
				setProofImage(null)
			} else if (order.payment_proof.mode === 'screenshot') {
				setProofImage(order.payment_proof.value || null)
				setProofText('')
			}
		}
		setEditingProof(true)
	}

	const handleCancelEdit = () => {
		setProofText('')
		setProofImage(null)
		setEditingProof(false)
	}

	const isProofEditable =
		order &&
		order.order_statuses?.code !== ORDER_STATUS_CODES.COMPLETED &&
		order.order_statuses?.code !== ORDER_STATUS_CODES.CANCELLED

	// Check if payment proof is required based on payment_mode.needsProof
	const needsProof = order?.payment_mode?.needsProof === true

	// Get proof mode from payment_mode (text or screenshot)
	const proofMode = order?.payment_mode?.proofMode || null

	const showPaymentFirst = needsProof && (!order?.payment_proof || editingProof)

	const canCancelOrder =
		order?.order_statuses?.code === ORDER_STATUS_CODES.PENDING

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
							? `${order.concession?.name?.substring(0, 1) || 'C'}-${
									order.concession_order_number
							  }`
							: order.id}
					</Text>
					<View style={styles.statusBadge}>
						<Text style={styles.statusText}>
							{order.order_statuses?.description || 'Unknown'}
						</Text>
					</View>
				</View>

				{order.concession_note && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Concession Note</Text>
						<Text style={styles.noteText}>{order.concession_note}</Text>
					</View>
				)}

				{/* Show Payment Section First if proof is required but missing */}
				{showPaymentFirst && (
					<PaymentInformationSection
						paymentMode={order.payment_mode}
						paymentProof={null}
						formatDate={formatDate}
						styles={styles}
						colors={colors}>
						<PaymentProofInput
							proofText={proofText}
							proofImage={proofImage}
							submittingProof={submittingProof}
							proofMode={proofMode}
							onProofTextChange={setProofText}
							onPickImage={handlePickImage}
							onRemoveImage={handleRemoveImage}
							onSubmit={handleSubmitProof}
							styles={styles}
							colors={colors}
						/>
					</PaymentInformationSection>
				)}

				{/* Order Information */}
				<OrderInformationSection
					concessionName={order.concession?.name || 'N/A'}
					orderMode={order.orderMode}
					orderItems={order.orderItems}
					total={order.total}
					scheduledFor={order.scheduledFor}
					createdAt={order.createdAt}
					updatedAt={order.updatedAt}
					formatCurrency={formatCurrency}
					formatDate={formatDate}
					styles={styles}
				/>

				{/* Price Adjustment Section - only show if price was adjusted */}
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

				{/* Show Payment Section After if proof exists or not required */}
				{!showPaymentFirst && (
					<PaymentInformationSection
						paymentMode={order.payment_mode}
						paymentProof={order.payment_proof}
						formatDate={formatDate}
						styles={styles}
						colors={colors}>
						{/* Show edit button if proof exists and order is editable */}
						{order.payment_proof && isProofEditable && !editingProof && (
							<TouchableOpacity
								style={styles.editProofButton}
								onPress={handleEditProof}>
								<Text style={styles.editProofButtonText}>
									Edit Payment Proof
								</Text>
							</TouchableOpacity>
						)}
						{/* Show cancel edit button if editing */}
						{editingProof && (
							<TouchableOpacity
								style={styles.cancelEditButton}
								onPress={handleCancelEdit}>
								<Text style={styles.cancelEditButtonText}>Cancel Edit</Text>
							</TouchableOpacity>
						)}
					</PaymentInformationSection>
				)}

				{/* Delete Order Button */}
				{canCancelOrder && (
					<TouchableOpacity
						style={[
							styles.cancelOrderButton,
							cancelling && styles.disabledButton,
						]}
						onPress={handleCancelOrder}
						disabled={cancelling}>
						{cancelling ? (
							<ActivityIndicator
								size="small"
								color={colors.surface}
							/>
						) : (
							<Text style={styles.cancelOrderButtonText}>Delete Order</Text>
						)}
					</TouchableOpacity>
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
		</DynamicKeyboardView>
	)
}

export default OrderDetailsScreen
