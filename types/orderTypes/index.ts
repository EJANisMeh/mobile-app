import type {
	CreateOrderPayload,
	CreateOrderResponse,
} from '../apiTypes/OrderApiTypes'

export type OrderMode = CreateOrderPayload['orderMode']

export interface OrderListResponse {
	success: boolean
	orders: unknown[]
	count?: number
	error?: string
}

export interface OrderStatusUpdateResponse {
	success: boolean
	message?: string
	error?: string
}

export interface OrderValidationErrorResponse {
	success: false
	error: string
	reasons?: string[]
}

export interface OrderBackendType {
	isProcessing: boolean
	error: string | null
	createOrder: (
		payload: CreateOrderPayload
	) => Promise<CreateOrderResponse | OrderValidationErrorResponse>
	getOrdersByCustomer: (customerId: number) => Promise<OrderListResponse>
	getOrdersByConcession: (concessionId: number) => Promise<OrderListResponse>
	updateOrderStatus: (
		orderId: number,
		statusPayload: Record<string, unknown>
	) => Promise<OrderStatusUpdateResponse>
}

export interface ScheduleSelectionState {
	mode: OrderMode
	scheduledAt: Date | null
}

export interface ScheduleOption {
	id: string
	label: string
	mode: OrderMode
	daysToAdd?: number
}
