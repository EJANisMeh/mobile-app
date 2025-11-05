/**
 * Order Status Codes
 * Centralized location for all order status codes used in the application.
 * These codes must match the 'code' column in the 'order_statuses' database table.
 */

export const ORDER_STATUS_CODES = {
	PENDING: 'pending',
	ACCEPTED: 'accepted',
	DECLINED: 'declined',
	PREPARING: 'preparing',
	COMPLETED: 'completed',
	CANCELLED: 'cancelled',
	CONFIRMED: 'confirmed',
	READY: 'ready',
} as const

// Type for order status code values
export type OrderStatusCode =
	(typeof ORDER_STATUS_CODES)[keyof typeof ORDER_STATUS_CODES]

// Helper function to check if a string is a valid order status code
export const isValidOrderStatusCode = (
	code: string
): code is OrderStatusCode => {
	return Object.values(ORDER_STATUS_CODES).includes(code as OrderStatusCode)
}
