import { Dispatch, SetStateAction } from 'react'
import { menuApi } from '../../../../services/api'
import { AddMenuItemFormData } from '../../../../types'

export const addMenuItem =
	(
		setLoading: Dispatch<SetStateAction<boolean>>,
		setError: Dispatch<SetStateAction<string | null>>,
		setMenuItems: Dispatch<SetStateAction<any[]>>
	) =>
	async (concessionId: number, formData: AddMenuItemFormData) => {
		setLoading(true)
		setError(null)

		try {
			// Call menuApi.addMenuItem instead of direct apiCall
			const response = await menuApi.addMenuItem(concessionId, formData)

			if (response.success && response.menuItem) {
				// Add the new item to the menu items list
				setMenuItems((prev) => [...prev, response.menuItem])
			} else {
				setError(response.error || 'Failed to add menu item')
			}

			return response
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to add menu item'
			setError(errorMessage)
			return {
				success: false,
				error: errorMessage,
			}
		} finally {
			setLoading(false)
		}
	}
