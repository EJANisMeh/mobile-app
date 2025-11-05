import { Dispatch, SetStateAction } from 'react'
import { orderApi } from '../../../../services/api'
import type { OrderDetailsResponse } from '../../../../types'

export const getOrderDetails =
	(
		setProcessing: Dispatch<SetStateAction<boolean>>,
		setError: Dispatch<SetStateAction<string | null>>
	) =>
	async (orderId: number): Promise<OrderDetailsResponse> => {
		setProcessing(true)
		setError(null)

		try {
			const response = await orderApi.getOrderDetails(orderId)

			if (!response.success) {
				setError(response.error ?? 'Failed to load order details.')
			}

			return response
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Failed to load order details.'
			setError(message)
			return {
				success: false,
				error: message,
			}
		} finally {
			setProcessing(false)
		}
	}
