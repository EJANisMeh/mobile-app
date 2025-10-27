import { Dispatch, SetStateAction } from 'react'
import { menuApi } from '../../../../services/api'

export const getMenuItems =
	(
		setLoading: (loading: boolean) => void,
		setError: (error: string | null) => void,
		setMenuItems: Dispatch<SetStateAction<any[]>>
	) =>
	async (concessionId: number) => {
		try {
			setLoading(true)
			setError(null)

			const response = await menuApi.getMenuItems(concessionId)

			if (response.success) {
				setMenuItems(response.menuItems || [])
				return {
					success: true,
					menuItems: response.menuItems || [],
				}
			} else {
				setError(response.error || 'Failed to fetch menu items')
				return {
					success: false,
					error: response.error || 'Failed to fetch menu items',
				}
			}
		} catch (error: any) {
			const errorMessage = error.message || 'Failed to fetch menu items'
			setError(errorMessage)
			return {
				success: false,
				error: errorMessage,
			}
		} finally {
			setLoading(false)
		}
	}
