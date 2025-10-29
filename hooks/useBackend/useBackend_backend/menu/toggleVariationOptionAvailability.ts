import { Dispatch, SetStateAction } from 'react'
import { menuApi } from '../../../../services/api'

export const toggleVariationOptionAvailability =
	(
		setLoading: (loading: boolean) => void,
		setError: (error: string | null) => void,
		setMenuItems: Dispatch<SetStateAction<any[]>>
	) =>
	async (optionId: number, currentAvailability: boolean) => {
		setLoading(true)
		setError(null)

		try {
			const response = await menuApi.toggleVariationOptionAvailability(
				optionId,
				!currentAvailability
			)

			if (response.success) {
				// Update the menu items state to reflect the change
				setMenuItems((prevItems) =>
					prevItems.map((item) => ({
						...item,
						menu_item_variation_groups: item.menu_item_variation_groups?.map(
							(group: any) => ({
								...group,
								menu_item_variation_option_choices:
									group.menu_item_variation_option_choices?.map((option: any) =>
										option.id === optionId
											? { ...option, availability: !currentAvailability }
											: option
									),
							})
						),
					}))
				)

				setLoading(false)
				return {
					success: true,
					option: response.option,
				}
			} else {
				setError(response.error || 'Failed to toggle option availability')
				setLoading(false)
				return {
					success: false,
					error: response.error || 'Failed to toggle option availability',
				}
			}
		} catch (error: any) {
			const errorMessage =
				error.message || 'Failed to toggle option availability'
			setError(errorMessage)
			setLoading(false)
			return {
				success: false,
				error: errorMessage,
			}
		}
	}
