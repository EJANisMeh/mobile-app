/**
 * Order Status Colors
 * Centralized location for all order status colors used in the application.
 */

export const ORDER_STATUS_COLORS = {
	PENDING: '#FFC107', // Yellow
	CONFIRMED: '#2196F3', // Blue
	DECLINED: '#F44336', // Red
	READY: '#9C27B0', // Purple/Violet
	COMPLETED: '#4CAF50', // Green
	CANCELLED: '#9E9E9E', // Gray
	ACCEPTED: '#2196F3', // Blue (same as confirmed)
} as const

// Type for order status color keys
export type OrderStatusColorKey = keyof typeof ORDER_STATUS_COLORS

/**
 * Get color for an order status code
 * @param statusCode - The order status code (e.g., 'pending', 'confirmed')
 * @returns The hex color code for the status
 */
export const getOrderStatusColor = (statusCode: string): string => {
	const normalizedCode = statusCode.toUpperCase()
	return ORDER_STATUS_COLORS[normalizedCode as OrderStatusColorKey] || '#9E9E9E'
}
