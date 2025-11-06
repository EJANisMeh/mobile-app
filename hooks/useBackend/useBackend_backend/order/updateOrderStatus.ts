import { Dispatch, SetStateAction } from 'react'
import { orderApi } from '../../../../services/api'
import type { OrderStatusUpdateResponse } from '../../../../types'

export const updateOrderStatus =
	(
		setProcessing: Dispatch<SetStateAction<boolean>>,
		setError: Dispatch<SetStateAction<string | null>>
	) =>
	async (
		orderId: number,
		statusCode: string,
		feedback?: string
	): Promise<OrderStatusUpdateResponse> => {
		setProcessing(true)
		setError(null)

		try {
			const response = await orderApi.updateOrderStatus(
				orderId,
				statusCode,
				feedback
			)

			if (!response.success) {
				setError(response.error ?? 'Failed to update order status.')
			}

			return response
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: 'Failed to update order status.'
			setError(message)
			return {
				success: false,
				error: message,
			}
		} finally {
			setProcessing(false)
		}
	}
