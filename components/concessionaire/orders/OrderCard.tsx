import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { getOrderStatusColor } from '../../../utils'
import type { ConcessionOrder } from '../../../types'

interface OrderCardProps {
	order: ConcessionOrder
	onPress: (order: ConcessionOrder) => void
	styles: any
	formatCurrency: (value: number) => string
	formatDate: (date: Date) => string
	paymentProofStatus: string | null
}

const OrderCard: React.FC<OrderCardProps> = ({
	order,
	onPress,
	styles,
	formatCurrency,
	formatDate,
	paymentProofStatus,
}) => {
	const isCancelled = order.order_statuses?.code === 'CANCELLED'

	// Don't show cancelled orders
	if (isCancelled) {
		return null
	}

	const itemCount = order.orderItems?.length || 0
	const customerEmail = order.customer?.email || 'Unknown'
	const statusColor = getOrderStatusColor(order.order_statuses?.code || '')

	return (
		<TouchableOpacity
			style={styles.orderCard}
			onPress={() => onPress(order)}
			activeOpacity={0.7}>
			<View style={styles.orderCardHeader}>
				<View style={styles.orderNumberContainer}>
					<Text style={styles.orderNumberLabel}>Order #</Text>
					<Text style={styles.orderNumber}>
						{order.concession_order_number || order.id}
					</Text>
				</View>
				<View
					style={[
						styles.statusBadge,
						{ backgroundColor: statusColor },
					]}>
					<Text style={styles.statusText}>{order.order_statuses?.code}</Text>
				</View>
			</View>

			<View style={styles.orderCardBody}>
				{/* Customer Email */}
				<View style={styles.orderInfoRow}>
					<MaterialCommunityIcons
						name="email"
						size={16}
						color={styles.orderInfoIcon.color}
					/>
					<Text style={styles.orderInfoLabel}>Customer:</Text>
					<Text
						style={styles.orderInfoValue}
						numberOfLines={1}>
						{customerEmail}
					</Text>
				</View>

				{/* Payment Mode */}
				<View style={styles.orderInfoRow}>
					<MaterialCommunityIcons
						name="credit-card"
						size={16}
						color={styles.orderInfoIcon.color}
					/>
					<Text style={styles.orderInfoLabel}>Payment:</Text>
					<Text style={styles.orderInfoValue}>
						{order.payment_mode?.type || 'Not specified'}
					</Text>
				</View>

				{/* Payment Proof Status */}
				{paymentProofStatus && (
					<View style={styles.orderInfoRow}>
						<MaterialCommunityIcons
							name={
								paymentProofStatus === 'Proof Submitted'
									? 'check-circle'
									: 'alert-circle'
							}
							size={16}
							color={
								paymentProofStatus === 'Proof Submitted' ? '#4CAF50' : '#FFA500'
							}
						/>
						<Text style={styles.orderInfoLabel}>Proof:</Text>
						<Text
							style={[
								styles.orderInfoValue,
								{
									color:
										paymentProofStatus === 'Proof Submitted'
											? '#4CAF50'
											: '#FFA500',
								},
							]}>
							{paymentProofStatus}
						</Text>
					</View>
				)}

				{/* Order Mode */}
				<View style={styles.orderInfoRow}>
					<MaterialCommunityIcons
						name={order.orderMode === 'scheduled' ? 'clock-outline' : 'flash'}
						size={16}
						color={styles.orderInfoIcon.color}
					/>
					<Text style={styles.orderInfoLabel}>Mode:</Text>
					<Text style={styles.orderInfoValue}>
						{order.orderMode === 'scheduled' ? 'Scheduled' : 'Order Now'}
					</Text>
				</View>

				{/* Scheduled Time */}
				{order.orderMode === 'scheduled' && order.scheduledFor && (
					<View style={styles.orderInfoRow}>
						<MaterialCommunityIcons
							name="calendar"
							size={16}
							color={styles.orderInfoIcon.color}
						/>
						<Text style={styles.orderInfoLabel}>For:</Text>
						<Text style={styles.orderInfoValue}>
							{formatDate(order.scheduledFor)}
						</Text>
					</View>
				)}

				{/* Item Count */}
				<View style={styles.orderInfoRow}>
					<MaterialCommunityIcons
						name="food"
						size={16}
						color={styles.orderInfoIcon.color}
					/>
					<Text style={styles.orderInfoLabel}>Items:</Text>
					<Text style={styles.orderInfoValue}>
						{itemCount} {itemCount === 1 ? 'item' : 'items'}
					</Text>
				</View>

				{/* Total */}
				<View style={styles.orderInfoRow}>
					<MaterialCommunityIcons
						name="currency-php"
						size={16}
						color={styles.orderInfoIcon.color}
					/>
					<Text style={styles.orderInfoLabel}>Total:</Text>
					<Text style={[styles.orderInfoValue, styles.orderTotal]}>
						{formatCurrency(order.total)}
					</Text>
				</View>

				{/* Order Time */}
				<View style={styles.orderInfoRow}>
					<MaterialCommunityIcons
						name="clock-outline"
						size={16}
						color={styles.orderInfoIcon.color}
					/>
					<Text style={styles.orderInfoLabel}>Placed:</Text>
					<Text style={styles.orderInfoValue}>
						{formatDate(order.createdAt)}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

export default OrderCard
