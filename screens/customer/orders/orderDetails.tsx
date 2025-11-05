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
import { useThemeContext, useAuthContext } from '../../../context'
import { useResponsiveDimensions, useCustomerNavigation } from '../../../hooks'
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

	const [order, setOrder] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [proofText, setProofText] = useState('')
	const [proofImage, setProofImage] = useState<string | null>(null)
	const [submittingProof, setSubmittingProof] = useState(false)

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
			alert('Permission to access gallery is required!')
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

			// TODO: Replace with actual API call when backend endpoint is ready
			// await orderApi.updateOrderPaymentProof(order.id, proofData)

			// Update local state
			setOrder({
				...order,
				payment_proof: {
					...proofData,
					submittedAt: new Date().toISOString(),
				},
			})
			setProofText('')
			setProofImage(null)
		} catch (err) {
			console.error('Submit proof error:', err)
			alert('Failed to submit payment proof. Please try again.')
		} finally {
			setSubmittingProof(false)
		}
	}

	const isProofEditable =
		order &&
		order.order_statuses?.code !== ORDER_STATUS_CODES.COMPLETED &&
		order.order_statuses?.code !== ORDER_STATUS_CODES.CANCELLED

	const needsProof =
		order?.payment_mode?.type &&
		order.payment_mode.type.toLowerCase() !== 'cash'

	const showPaymentFirst = needsProof && !order?.payment_proof

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
		<DynamicKeyboardView
			style={styles.container}
			useSafeArea={true}>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={true}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>Order #{order.id}</Text>
					<View style={styles.statusBadge}>
						<Text style={styles.statusText}>
							{order.order_statuses?.description || 'Unknown'}
						</Text>
					</View>
				</View>

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

				{/* Show Payment Section After if proof exists or not required */}
				{!showPaymentFirst && (
					<PaymentInformationSection
						paymentMode={order.payment_mode}
						paymentProof={order.payment_proof}
						formatDate={formatDate}
						styles={styles}
						colors={colors}
					/>
				)}

				{order.concession_note && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Concession Note</Text>
						<Text style={styles.noteText}>{order.concession_note}</Text>
					</View>
				)}
			</ScrollView>
		</DynamicKeyboardView>
	)
}

export default OrderDetailsScreen
