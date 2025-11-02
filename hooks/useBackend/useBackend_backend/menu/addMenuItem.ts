import { Dispatch, SetStateAction } from 'react'
import { apiCall } from '../../../../services/api/api'
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
			const response = await apiCall('/menu/add', {
				method: 'POST',
				body: JSON.stringify({
					concessionId,
					name: formData.name.trim(),
					description: formData.description.trim() || null,
					basePrice: formData.basePrice || '0',
					images: formData.images,
					displayImageIndex: formData.displayImageIndex,
					categoryId: formData.categoryId,
					availability: formData.availability,
					variationGroups: formData.variationGroups.map((group) => ({
						name: group.name.trim(),
						selectionTypeId: group.selectionTypeId,
						multiLimit: group.multiLimit,
						mode: group.mode,
						categoryFilterId: group.categoryFilterId,
						options: group.options.map((opt) => ({
							name: opt.name.trim(),
							priceAdjustment: opt.priceAdjustment,
							isDefault: opt.isDefault,
							availability: opt.availability,
							position: opt.position,
						})),
						existingMenuItemIds: (group as any).existingMenuItemIds || [],
						position: group.position,
					})),
					addons: formData.addons.map((addon) => ({
						menuItemId: addon.menuItemId,
						label: addon.label?.trim() || null,
						priceOverride: addon.priceOverride,
						required: addon.required,
						position: addon.position,
					})),
				}),
			})

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
