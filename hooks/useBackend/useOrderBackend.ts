import { useState } from 'react'
import type {
	CreateOrderPayload,
	CreateOrderResponse,
	OrderBackendType,
	OrderListResponse,
	OrderDetailsResponse,
	OrderStatusUpdateResponse,
	OrderValidationErrorResponse,
} from '../../types'
import {
	createOrder,
	getOrdersByConcession,
	getOrdersByCustomer,
	getOrderDetails,
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

	const getOrderDetailsHandler = (
		orderId: number
	): Promise<OrderDetailsResponse> =>
		getOrderDetails(setProcessing, setError)(orderId)

	const updateOrderStatusHandler = (
		orderId: number,
		statusCode: string,
		feedback?: string
	): Promise<OrderStatusUpdateResponse> =>
		updateOrderStatus(setProcessing, setError)(orderId, statusCode, feedback)

	return {
		isProcessing,
		error,
		createOrder: createOrderHandler,
		getOrdersByCustomer: getCustomerOrders,
		getOrdersByConcession: getConcessionOrders,
		getOrderDetails: getOrderDetailsHandler,
		updateOrderStatus: updateOrderStatusHandler,
	}
}
