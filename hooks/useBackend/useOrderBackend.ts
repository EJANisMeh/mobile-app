import { useState } from 'react'
import type {
	CreateOrderPayload,
	CreateOrderResponse,
	OrderBackendType,
	OrderListResponse,
	OrderStatusUpdateResponse,
	OrderValidationErrorResponse,
} from '../../types'
import {
	createOrder,
	getOrdersByConcession,
	getOrdersByCustomer,
	updateOrderStatus,
} from './useBackend_backend/order'

export const useOrderBackend = (): OrderBackendType => {
	const [isProcessing, setProcessing] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const createOrderHandler = (
		payload: CreateOrderPayload
	): Promise<CreateOrderResponse | OrderValidationErrorResponse> =>
		createOrder(setProcessing, setError)(payload)

	const getCustomerOrders = (customerId: number): Promise<OrderListResponse> =>
		getOrdersByCustomer(setProcessing, setError)(customerId)

	const getConcessionOrders = (
		concessionId: number
	): Promise<OrderListResponse> =>
		getOrdersByConcession(setProcessing, setError)(concessionId)

	const updateOrderStatusHandler = (
		orderId: number,
		statusPayload: Record<string, unknown>
	): Promise<OrderStatusUpdateResponse> =>
		updateOrderStatus(setProcessing, setError)(orderId, statusPayload)

	return {
		isProcessing,
		error,
		createOrder: createOrderHandler,
		getOrdersByCustomer: getCustomerOrders,
		getOrdersByConcession: getConcessionOrders,
		updateOrderStatus: updateOrderStatusHandler,
	}
}
