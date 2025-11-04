import { Dispatch, SetStateAction } from 'react'
import { orderApi } from '../../../../services/api'
import type {
	CreateOrderPayload,
	CreateOrderResponse,
	OrderValidationErrorResponse,
} from '../../../../types'

export const createOrder =
	(
		setProcessing: Dispatch<SetStateAction<boolean>>,
		setError: Dispatch<SetStateAction<string | null>>
	) =>
	async (
		payload: CreateOrderPayload
	): Promise<CreateOrderResponse | OrderValidationErrorResponse> => {
		setProcessing(true)
		setError(null)

		try {
			const response = await orderApi.createOrder(payload)

			if (!response.success) {
				setError(response.error ?? 'Failed to place order.')
			}

			return response
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Failed to place order.'
			setError(message)
			return {
				success: false,
				error: message,
			}
		} finally {
			setProcessing(false)
		}
	}
