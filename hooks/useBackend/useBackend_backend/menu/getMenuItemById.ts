import { menuApi } from '../../../../services/api'

export const getMenuItemById =
	(
		setLoading: (loading: boolean) => void,
		setError: (error: string | null) => void
	) =>
	async (itemId: number) => {
		setLoading(true)
		setError(null)

		try {
			const response = await menuApi.getMenuItemById(itemId)

			if (!response.success) {
				setError(response.error || 'Failed to fetch menu item')
			}

			return response
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to fetch menu item'
			setError(errorMessage)
			return {
				success: false,
				error: errorMessage,
			}
		} finally {
			setLoading(false)
		}
	}
