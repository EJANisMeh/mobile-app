import {
	getMenuItemAvailabilityStatus,
	normalizeMenuItemSchedule,
} from './menuItemSchedule'

/**
 * Checks if a menu item is unavailable (out of stock or not served today)
 * @param item Menu item with availability and schedule info
 * @returns true if item is unavailable, false if available
 */
export const isMenuItemUnavailable = (item: {
	availability?: boolean | null
	availabilitySchedule?: any
}): boolean => {
	const normalizedSchedule = normalizeMenuItemSchedule(
		item.availabilitySchedule ?? undefined
	)
	const status = getMenuItemAvailabilityStatus(
		normalizedSchedule,
		item.availability ?? true
	)

	return status === 'not_served_today' || status === 'out_of_stock'
}

/**
 * Checks if a custom variation option is unavailable
 * @param option Custom option with availability field only
 * @returns true if option is unavailable, false if available
 */
export const isCustomOptionUnavailable = (option: {
	availability?: boolean | null
}): boolean => {
	return option.availability === false
}

/**
 * Checks variation selections for unavailable items
 * Handles all variation group types: single_category_filter, multi_category_filter, existing_items, group
 * Also checks sub-variations recursively
 */
export const hasUnavailableVariationSelections = (
	variationGroups: any[] | undefined,
	variationSelections: Map<number, any>
): boolean => {
	if (!variationGroups) {
		return false
	}

	for (const group of variationGroups) {
		const selection = variationSelections.get(group.id)
		if (!selection || selection.selectedOptions.length === 0) {
			continue
		}
		// Check based on group kind
		if (group.kind === 'single_category_filter' || group.kind === 'multi_category_filter') {
			const categoryMenuItems = (group as any).categoryMenuItems || []
			for (const selectedOption of selection.selectedOptions) {
				const item = categoryMenuItems.find(
					(item: any) => item.id === selectedOption.menuItemId
        )
        
				if (item && isMenuItemUnavailable(item)) {
					return true
				}
        // Check sub-variations
				if (
					selectedOption.subVariationSelections &&
					hasUnavailableVariationSelections(
						item?.variationGroups,
						selectedOption.subVariationSelections
					)
				) {
					return true
				}
			}
		} else if (group.kind === 'existing_items') {
			const existingMenuItems = (group as any).existingMenuItems || []
			for (const selectedOption of selection.selectedOptions) {
				const item = existingMenuItems.find(
					(item: any) => item.id === selectedOption.menuItemId
				)
				if (item && isMenuItemUnavailable(item)) {
					return true
				}

				// Check sub-variations
				console.log(selectedOption)
				if (
					selectedOption.subVariationSelections &&
					hasUnavailableVariationSelections(
						item?.variationGroups,
						selectedOption.subVariationSelections
					)
				) {
					return true
				}
			}
		} else if (group.kind === 'group') {
			// Custom groups
			const options = group.menu_item_variation_option_choices || []
			for (const selectedOption of selection.selectedOptions) {
				const option = options.find(
					(opt: any) => opt.id === selectedOption.optionId
				)
				if (option && isCustomOptionUnavailable(option)) {
					return true
				}
			}
		}
	}

	return false
}

/**
 * Checks addon selections for unavailable items
 */
export const hasUnavailableAddonSelections = (
	addons: any[] | undefined,
	addonSelections: Map<number, any>
): boolean => {
	if (!addons) {
		return false
	}

	for (const addon of addons) {
		const selection = addonSelections.get(addon.id)
		if (!selection || !selection.selected) {
			continue
		}

		const targetItem =
			addon.menu_items_menu_item_addons_target_menu_item_idTomenu_items
		if (targetItem && isMenuItemUnavailable(targetItem)) {
			return true
		}
	}

	return false
}
