import React, { useState, useCallback } from 'react'
import {
	View,
	Text,
	ScrollView,
	ActivityIndicator,
	TouchableOpacity,
	TextInput,
	Image,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { DynamicKeyboardView } from '../../../components'
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
			// TODO: Replace with actual API call when backend endpoint is ready
			// const response = await orderApi.getOrderDetails(orderId)
			// For now, using placeholder
			setOrder({
				id: orderId,
				total: 150.0,
				orderMode: 'now',
				scheduledFor: null,
				payment_mode: { type: 'GCash', details: '09XX XXX XXXX' },
				payment_proof: null,
				concession_note: null,
				createdAt: new Date(),
				order_statuses: {
					code: ORDER_STATUS_CODES.PENDING,
					description: 'Pending',
				},
				concession: { name: 'Sample Concession' },
				orderItems: [],
			})
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

	const formatCurrency = (value: number) => `₱${value.toFixed(2)}`

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

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Order Information</Text>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Concession:</Text>
						<Text style={styles.infoValue}>{order.concession?.name}</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Total:</Text>
						<Text style={[styles.infoValue, styles.totalValue]}>
							{formatCurrency(order.total)}
						</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Order Type:</Text>
						<Text style={styles.infoValue}>
							{order.orderMode === 'now' ? 'Order Now' : 'Scheduled'}
						</Text>
					</View>
					{order.orderMode === 'scheduled' && order.scheduledFor && (
						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Scheduled For:</Text>
							<Text style={styles.infoValue}>
								{formatDate(new Date(order.scheduledFor))}
							</Text>
						</View>
					)}
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Placed On:</Text>
						<Text style={styles.infoValue}>
							{formatDate(new Date(order.createdAt))}
						</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Payment Information</Text>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Method:</Text>
						<Text style={styles.infoValue}>
							{order.payment_mode?.type || 'N/A'}
						</Text>
					</View>
					{order.payment_mode?.details && (
						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Details:</Text>
							<Text style={styles.infoValue}>{order.payment_mode.details}</Text>
						</View>
					)}
					{order.payment_proof ? (
						<View style={styles.proofSection}>
							<Text style={styles.proofLabel}>Payment Proof Submitted:</Text>
							{order.payment_proof.mode === 'text' ? (
								<View style={styles.proofTextContainer}>
									<Text style={styles.proofText}>
										{order.payment_proof.value}
									</Text>
								</View>
							) : (
								<Image
									source={{ uri: order.payment_proof.value }}
									style={styles.proofImage}
									resizeMode="contain"
								/>
							)}
							<Text style={styles.proofTimestamp}>
								Submitted on:{' '}
								{order.payment_proof.submittedAt
									? formatDate(new Date(order.payment_proof.submittedAt))
									: 'N/A'}
							</Text>
						</View>
					) : needsProof && isProofEditable ? (
						<View style={styles.proofInputSection}>
							<View style={styles.proofNotice}>
								<MaterialCommunityIcons
									name="information-outline"
									size={20}
									color={colors.primary}
								/>
								<Text style={styles.proofNoticeText}>
									Please submit payment proof to help the concessionaire verify
									your payment.
								</Text>
							</View>

							<View style={styles.proofInputContainer}>
								<Text style={styles.inputLabel}>
									Transaction ID or Reference Number
								</Text>
								<TextInput
									style={styles.proofTextInput}
									placeholder="Enter transaction ID, reference number, etc."
									placeholderTextColor={colors.placeholder}
									value={proofText}
									onChangeText={setProofText}
									multiline
									numberOfLines={3}
									editable={!proofImage}
								/>
							</View>

							<Text style={styles.orText}>OR</Text>

							<View style={styles.proofInputContainer}>
								<Text style={styles.inputLabel}>Upload Screenshot</Text>
								{!proofImage ? (
									<TouchableOpacity
										style={styles.uploadButton}
										onPress={handlePickImage}
										disabled={Boolean(proofText.trim())}>
										<MaterialCommunityIcons
											name="image-plus"
											size={24}
											color={
												proofText.trim() ? colors.textSecondary : colors.primary
											}
										/>
										<Text
											style={[
												styles.uploadButtonText,
												proofText.trim() && styles.uploadButtonTextDisabled,
											]}>
											Choose from gallery
										</Text>
									</TouchableOpacity>
								) : (
									<View style={styles.imagePreviewContainer}>
										<Image
											source={{ uri: proofImage }}
											style={styles.imagePreview}
											resizeMode="cover"
										/>
										<TouchableOpacity
											style={styles.removeImageButton}
											onPress={handleRemoveImage}>
											<MaterialCommunityIcons
												name="close-circle"
												size={24}
												color={colors.error}
											/>
										</TouchableOpacity>
									</View>
								)}
							</View>

							<TouchableOpacity
								style={[
									styles.submitButton,
									!proofText.trim() &&
										!proofImage &&
										styles.submitButtonDisabled,
								]}
								onPress={handleSubmitProof}
								disabled={
									(!proofText.trim() && !proofImage) || submittingProof
								}>
								{submittingProof ? (
									<ActivityIndicator
										size="small"
										color={colors.surface}
									/>
								) : (
									<Text style={styles.submitButtonText}>
										Submit Payment Proof
									</Text>
								)}
							</TouchableOpacity>
						</View>
					) : null}
				</View>

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
