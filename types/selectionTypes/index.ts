// Selection state types for customer menu item ordering

export interface VariationSelection {
	groupId: number
	groupName: string
	selectionTypeCode: string
	multiLimit: number
	selectedOptions: VariationOptionSelection[]
}

export interface VariationOptionSelection {
	optionId: number
	optionName: string
	priceAdjustment: number
	// For existing mode
	menuItemId?: number
	menuItemBasePrice?: number // Base price of the menu item when used as variation option
	// For category mode
	categoryFilterId?: number
}

export interface AddonSelection {
	addonId: number
	addonName: string
	price: number
	selected: boolean
}

export interface MenuItemSelections {
	variationSelections: Map<number, VariationSelection>
	addonSelections: Map<number, AddonSelection>
}

export interface PriceCalculation {
	basePrice: number
	variationAdjustments: number
	addonsTotal: number
	unitPrice: number
	totalPrice: number
}
