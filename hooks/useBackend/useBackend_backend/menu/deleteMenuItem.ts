import { Dispatch, SetStateAction } from 'react'
import { menuApi } from '../../../../services/api'

export const deleteMenuItem =
	(
		setLoading: (loading: boolean) => void,
		setError: (error: string | null) => void,
		setMenuItems: Dispatch<SetStateAction<any[]>>
	) =>
	async (itemId: number) => {
		try {
			setLoading(true)
			setError(null)

			const response = await menuApi.deleteMenuItem(itemId)

			if (response.success) {
				// Remove the deleted item from the menu items list
				setMenuItems((prevItems: any[]) =>
					prevItems.filter((item: any) => item.id !== itemId)
				)
				return {
					success: true,
					message: response.message,
				}
			} else {
				setError(response.error || 'Failed to delete menu item')
				return {
					success: false,
					error: response.error || 'Failed to delete menu item',
				}
			}
		} catch (error: any) {
			const errorMessage = error.message || 'Failed to delete menu item'
			setError(errorMessage)
			return {
				success: false,
				error: errorMessage,
			}
		} finally {
			setLoading(false)
		}
	}
