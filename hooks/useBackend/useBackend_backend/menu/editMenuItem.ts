import { Dispatch, SetStateAction } from 'react'
import { menuApi } from '../../../../services/api'

export const editMenuItem =
	(
		setLoading: Dispatch<SetStateAction<boolean>>,
		setError: Dispatch<SetStateAction<string | null>>,
		setMenuItems: Dispatch<SetStateAction<any[]>>
	) =>
	async (itemId: number, formData: any) => {
		setLoading(true)
		setError(null)

		try {
			const response = await menuApi.editMenuItem(itemId, formData)

			if (response.success) {
				// Update the menu item in the list
				setMenuItems((prev) =>
					prev.map((item) => (item.id === itemId ? response.menuItem : item))
				)
			} else {
				setError(response.error || 'Failed to edit menu item')
			}

			return response
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to edit menu item'
			setError(errorMessage)
			return {
				success: false,
				error: errorMessage,
			}
		} finally {
			setLoading(false)
		}
	}
