import { Dispatch, SetStateAction } from 'react'
import { orderApi } from '../../../../services/api'
import type { OrderListResponse } from '../../../../types'

export const getOrdersByCustomer =
	(
		setProcessing: Dispatch<SetStateAction<boolean>>,
		setError: Dispatch<SetStateAction<string | null>>
	) =>
	async (customerId: number): Promise<OrderListResponse> => {
		setProcessing(true)
		setError(null)

		try {
			const response = await orderApi.getOrdersByCustomer(customerId)

			if (!response.success) {
				setError(response.error ?? 'Failed to load orders.')
			}

			return response
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Failed to load orders.'
			setError(message)
			return {
				success: false,
				error: message,
				orders: [],
			}
		} finally {
			setProcessing(false)
		}
	}
