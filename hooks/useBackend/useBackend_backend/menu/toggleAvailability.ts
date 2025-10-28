import { Dispatch, SetStateAction } from 'react'
import { menuApi } from '../../../../services/api'

export const toggleAvailability =
	(
		setLoading: (loading: boolean) => void,
		setError: (error: string | null) => void,
		setMenuItems: Dispatch<SetStateAction<any[]>>
	) =>
	async (itemId: number, currentAvailability: boolean) => {
		try {
			setLoading(true)
			setError(null)

			const response = await menuApi.toggleAvailability(
				itemId,
				!currentAvailability
			)

			if (response.success) {
				// Update the menu items list with the updated item
				setMenuItems((prevItems: any[]) =>
					prevItems.map((item: any) =>
						item.id === itemId
							? { ...item, availability: !currentAvailability }
							: item
					)
				)
				return {
					success: true,
					menuItem: response.menuItem,
				}
			} else {
				setError(response.error || 'Failed to update availability')
				return {
					success: false,
					error: response.error || 'Failed to update availability',
				}
			}
		} catch (error: any) {
			const errorMessage = error.message || 'Failed to update availability'
			setError(errorMessage)
			return {
				success: false,
				error: errorMessage,
			}
		} finally {
			setLoading(false)
		}
	}
