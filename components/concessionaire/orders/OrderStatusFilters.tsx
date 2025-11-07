import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { getOrderStatusColor } from '../../../utils'
import type { ViewStyle, TextStyle } from 'react-native'

interface OrderStatusFiltersProps {
	selectedStatus: string | null
	onStatusChange: (status: string | null) => void
	orderCounts: Record<string, number>
	styles: {
		statusFiltersContainer: ViewStyle
		statusFilterButton: ViewStyle
		statusFilterButtonActive: ViewStyle
		statusFilterText: TextStyle
		statusFilterTextActive: TextStyle
		statusFilterCount: TextStyle
		statusFilterCountActive: TextStyle
	}
}

const STATUS_ORDER = [
	{ code: null, label: 'All' },
	{ code: 'pending', label: 'Pending' },
	{ code: 'confirmed', label: 'Confirmed' },
	{ code: 'declined', label: 'Declined' },
	{ code: 'ready', label: 'Ready' },
	{ code: 'completed', label: 'Completed' },
	{ code: 'cancelled', label: 'Cancelled' },
]

const OrderStatusFilters: React.FC<OrderStatusFiltersProps> = ({
	selectedStatus,
	onStatusChange,
	orderCounts,
	styles,
}) => {
	return (
		<View style={styles.statusFiltersContainer}>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
				{STATUS_ORDER.map((status) => {
					const isActive = selectedStatus === status.code
					const count = status.code
						? orderCounts[status.code] || 0
						: orderCounts.all || 0
					const statusColor = status.code
						? getOrderStatusColor(status.code)
						: '#666'

					return (
						<TouchableOpacity
							key={status.code || 'all'}
							style={[
								styles.statusFilterButton,
								isActive && styles.statusFilterButtonActive,
								isActive && status.code && { borderColor: statusColor },
							]}
							onPress={() => onStatusChange(status.code)}>
							<Text
								style={[
									styles.statusFilterText,
									isActive && styles.statusFilterTextActive,
									isActive && status.code && { color: statusColor },
								]}>
								{status.label}
							</Text>
							<Text
								style={[
									styles.statusFilterCount,
									isActive && styles.statusFilterCountActive,
									isActive && status.code && { color: statusColor },
								]}>
								{count}
							</Text>
						</TouchableOpacity>
					)
				})}
			</ScrollView>
		</View>
	)
}

export default OrderStatusFilters
