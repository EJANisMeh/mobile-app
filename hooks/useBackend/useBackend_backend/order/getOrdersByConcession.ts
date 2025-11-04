import { Dispatch, SetStateAction } from 'react'
import { orderApi } from '../../../../services/api'
import type { OrderListResponse } from '../../../../types'

export const getOrdersByConcession =
	(
		setProcessing: Dispatch<SetStateAction<boolean>>,
		setError: Dispatch<SetStateAction<string | null>>
	) =>
	async (concessionId: number): Promise<OrderListResponse> => {
		setProcessing(true)
		setError(null)

		try {
			const response = await orderApi.getOrdersByConcession(concessionId)

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
