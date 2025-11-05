import AsyncStorage from '@react-native-async-storage/async-storage'
import { apiCall } from './api'
import type {
	CreateOrderPayload,
	CreateOrderResponse,
	OrderListResponse,
	OrderDetailsResponse,
	OrderStatusUpdateResponse,
	PaymentProof,
} from '../../types'

interface PaymentProofUpdateResponse {
	success: boolean
	message?: string
	error?: string
	paymentProof?: PaymentProof
}

export const orderApi = {
	createOrder: async (
		payload: CreateOrderPayload
	): Promise<CreateOrderResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall<CreateOrderResponse>('/orders/create', {
			method: 'POST',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			body: JSON.stringify(payload),
		})
	},

	getOrdersByCustomer: async (
		customerId: number
	): Promise<OrderListResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall<OrderListResponse>(`/orders/customer/${customerId}`, {
			method: 'GET',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		})
	},

	getOrdersByConcession: async (
		concessionId: number
	): Promise<OrderListResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall<OrderListResponse>(
			`/orders/concession/${concessionId}`,
			{
				method: 'GET',
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			}
		)
	},

	getOrderDetails: async (orderId: number): Promise<OrderDetailsResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall<OrderDetailsResponse>(`/orders/${orderId}`, {
			method: 'GET',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		})
	},

	updateOrderStatus: async (
		orderId: number,
		statusPayload: Record<string, unknown>
	): Promise<OrderStatusUpdateResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall<OrderStatusUpdateResponse>(
			`/orders/status/${orderId}`,
			{
				method: 'PUT',
				headers: token ? { Authorization: `Bearer ${token}` } : {},
				body: JSON.stringify(statusPayload),
			}
		)
	},

	updatePaymentProof: async (
		orderId: number,
		paymentProof: PaymentProof
	): Promise<PaymentProofUpdateResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall<PaymentProofUpdateResponse>(
			`/orders/payment-proof/${orderId}`,
			{
				method: 'PUT',
				headers: token ? { Authorization: `Bearer ${token}` } : {},
				body: JSON.stringify({ paymentProof }),
			}
		)
	},

	cancelOrder: async (
		orderId: number
	): Promise<{ success: boolean; message?: string; error?: string }> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall<{
			success: boolean
			message?: string
			error?: string
		}>(`/orders/cancel/${orderId}`, {
			method: 'PUT',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		})
	},
}
