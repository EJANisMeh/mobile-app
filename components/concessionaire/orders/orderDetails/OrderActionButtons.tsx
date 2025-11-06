import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { ThemeColors } from '../../../../types/theme'

interface OrderActionButtonsProps {
	onAcceptOrder: () => void
	onDeclineOrder: () => void
	onRescheduleOrder: () => void
	isProcessing: boolean
	colors: ThemeColors
	styles: any
}

const OrderActionButtons: React.FC<OrderActionButtonsProps> = ({
	onAcceptOrder,
	onDeclineOrder,
	onRescheduleOrder,
	isProcessing,
	colors,
	styles,
}) => {
	return (
		<View style={styles.actionButtonsContainer}>
			<TouchableOpacity
				style={[styles.actionButton, styles.acceptButton]}
				onPress={onAcceptOrder}
				disabled={isProcessing}>
				{isProcessing ? (
					<ActivityIndicator
						size="small"
						color="#fff"
					/>
				) : (
					<>
						<MaterialCommunityIcons
							name="check-circle"
							size={24}
							color="#fff"
						/>
						<Text style={styles.actionButtonText}>Accept</Text>
					</>
				)}
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.actionButton, styles.declineButton]}
				onPress={onDeclineOrder}
				disabled={isProcessing}>
				{isProcessing ? (
					<ActivityIndicator
						size="small"
						color="#fff"
					/>
				) : (
					<>
						<MaterialCommunityIcons
							name="close-circle"
							size={24}
							color="#fff"
						/>
						<Text style={styles.actionButtonText}>Decline</Text>
					</>
				)}
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.actionButton, styles.rescheduleButton]}
				onPress={onRescheduleOrder}
				disabled={isProcessing}>
				{isProcessing ? (
					<ActivityIndicator
						size="small"
						color="#fff"
					/>
				) : (
					<>
						<MaterialCommunityIcons
							name="calendar-clock"
							size={24}
							color="#fff"
						/>
						<Text style={styles.actionButtonText}>Reschedule</Text>
					</>
				)}
			</TouchableOpacity>
		</View>
	)
}

export default OrderActionButtons
