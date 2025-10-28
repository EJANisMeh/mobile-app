import { Dispatch, SetStateAction } from 'react'
import { menuApi } from '../../../../services/api'

export const getMenuItems =
	(
		setLoading: (loading: boolean) => void,
		setError: (error: string | null) => void,
		setMenuItems: Dispatch<SetStateAction<any[]>>
	) =>
	async (concessionId: number) => {
		setLoading(true)
		setError(null)

		try {
			const response = await menuApi.getMenuItems(concessionId)

			if (response.success) {
				setMenuItems(response.menuItems || [])
				setLoading(false)
				return {
					success: true,
					menuItems: response.menuItems || [],
				}
			} else {
				setError(response.error || 'Failed to fetch menu items')
				setLoading(false)
				return {
					success: false,
					error: response.error || 'Failed to fetch menu items',
				}
			}
		} catch (error: any) {
			const errorMessage = error.message || 'Failed to fetch menu items'
			setError(errorMessage)
			setLoading(false)
			return {
				success: false,
				error: errorMessage,
			}
		}
	}
