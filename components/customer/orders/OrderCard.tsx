import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { CustomerOrder } from '../../../types'
import type { ViewStyle, TextStyle } from 'react-native'

interface OrderCardProps {
	order: CustomerOrder
	onPress: (order: CustomerOrder) => void
	styles: {
		orderCard: ViewStyle
		orderHeader: ViewStyle
		orderIdText: TextStyle
		orderStatusBadge: ViewStyle
		orderStatusText: TextStyle
		orderBody: ViewStyle
		orderInfoRow: ViewStyle
		orderInfoLabel: TextStyle
		orderInfoValue: TextStyle
		orderFooter: ViewStyle
		orderTotalText: TextStyle
		orderDateText: TextStyle
		proofStatusBadge: ViewStyle
		proofStatusText: TextStyle
	}
	formatCurrency: (amount: number) => string
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
	const getStatusColor = (statusCode: string): string => {
		switch (statusCode.toLowerCase()) {
			case 'pending':
				return '#FFA500'
			case 'confirmed':
			case 'preparing':
				return '#2196F3'
			case 'ready':
				return '#4CAF50'
			case 'completed':
				return '#8BC34A'
			case 'cancelled':
			case 'declined':
				return '#F44336'
			default:
				return '#9E9E9E'
		}
	}

	const getOrderModeLabel = (mode: string): string => {
		return mode === 'now' ? 'Order Now' : 'Scheduled'
	}

	const getOrderModeIcon = (
		mode: string
	): React.ComponentProps<typeof MaterialCommunityIcons>['name'] => {
		return mode === 'now' ? 'clock-fast' : 'calendar-clock'
	}

	const statusColor = getStatusColor(order.order_statuses.code)
	const isCancelled = order.order_statuses.code.toLowerCase() === 'cancelled'

	// If cancelled, show minimal view
	if (isCancelled) {
		return (
			<View style={[styles.orderCard, { opacity: 0.7 }]}>
				<View style={styles.orderHeader}>
					<View>
						<Text style={styles.orderIdText}>
							Order #
							{order.concession_order_number
								? `${order.concession?.name?.substring(0, 1) || 'C'}-${
										order.concession_order_number
								  }`
								: order.id}
						</Text>
						<View
							style={[
								styles.orderStatusBadge,
								{ backgroundColor: statusColor, marginTop: 4 },
							]}>
							<Text style={styles.orderStatusText}>
								{order.order_statuses.description || order.order_statuses.code}
							</Text>
						</View>
					</View>
				</View>

				<View style={styles.orderBody}>
					<View style={styles.orderInfoRow}>
						<MaterialCommunityIcons
							name="clock-outline"
							size={16}
							color="#666"
						/>
						<Text style={styles.orderInfoLabel}>Cancelled:</Text>
						<Text style={styles.orderInfoValue}>
							{formatDate(new Date(order.updatedAt))}
						</Text>
					</View>
				</View>
			</View>
		)
	}

	return (
		<TouchableOpacity
			style={styles.orderCard}
			onPress={() => onPress(order)}>
			<View style={styles.orderHeader}>
				<View>
					<Text style={styles.orderIdText}>
						Order #
						{order.concession_order_number
							? `${order.concession?.name?.substring(0, 1) || 'C'}-${
									order.concession_order_number
							  }`
							: order.id}
					</Text>
					<View
						style={[
							styles.orderStatusBadge,
							{ backgroundColor: statusColor, marginTop: 4 },
						]}>
						<Text style={styles.orderStatusText}>
							{order.order_statuses.description || order.order_statuses.code}
						</Text>
					</View>
				</View>
			</View>

			<View style={styles.orderBody}>
				{order.concession && (
					<View style={styles.orderInfoRow}>
						<MaterialCommunityIcons
							name="store"
							size={16}
							color="#666"
						/>
						<Text style={styles.orderInfoLabel}>Concession:</Text>
						<Text style={styles.orderInfoValue}>{order.concession.name}</Text>
					</View>
				)}

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
								paymentProofStatus === 'Proof Submitted' ? '#4CAF50' : '#FF9800'
							}
						/>
						<Text style={styles.orderInfoLabel}>Payment:</Text>
						<View
							style={[
								styles.proofStatusBadge,
								{
									backgroundColor:
										paymentProofStatus === 'Proof Submitted'
											? '#4CAF5020'
											: '#FF980020',
								},
							]}>
							<Text
								style={[
									styles.proofStatusText,
									{
										color:
											paymentProofStatus === 'Proof Submitted'
												? '#4CAF50'
												: '#FF9800',
									},
								]}>
								{paymentProofStatus}
							</Text>
						</View>
					</View>
				)}

				<View style={styles.orderInfoRow}>
					<MaterialCommunityIcons
						name={getOrderModeIcon(order.orderMode)}
						size={16}
						color="#666"
					/>
					<Text style={styles.orderInfoLabel}>Mode:</Text>
					<Text style={styles.orderInfoValue}>
						{getOrderModeLabel(order.orderMode)}
					</Text>
				</View>

				{order.orderMode === 'scheduled' && order.scheduledFor && (
					<View style={styles.orderInfoRow}>
						<MaterialCommunityIcons
							name="calendar"
							size={16}
							color="#666"
						/>
						<Text style={styles.orderInfoLabel}>Scheduled:</Text>
						<Text style={styles.orderInfoValue}>
							{formatDate(new Date(order.scheduledFor))}
						</Text>
					</View>
				)}

				<View style={styles.orderInfoRow}>
					<MaterialCommunityIcons
						name="package-variant"
						size={16}
						color="#666"
					/>
					<Text style={styles.orderInfoLabel}>Items:</Text>
					<Text style={styles.orderInfoValue}>
						{order.orderItems.length}{' '}
						{order.orderItems.length === 1 ? 'item' : 'items'}
					</Text>
				</View>
			</View>

			<View style={styles.orderFooter}>
				<Text style={styles.orderTotalText}>
					{formatCurrency(Number(order.total))}
				</Text>
				<Text style={styles.orderDateText}>
					{formatDate(new Date(order.createdAt))}
				</Text>
			</View>
		</TouchableOpacity>
	)
}

export default OrderCard
