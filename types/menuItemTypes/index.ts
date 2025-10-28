/**
 * Types for Add/Edit Menu Item functionality
 */

export interface AddMenuItemFormData {
	name: string
	description: string
	basePrice: string
	images: string[] // Max 3 images
	displayImageIndex: number // Index of image to display in menu list (0-2)
	categoryId: number | null
	availability: boolean
	variationGroups: VariationGroupInput[]
	addons: AddonInput[]
}

export interface VariationGroupInput {
	id?: number // For editing existing
	name: string
	selectionTypeId: number
	multiLimit: number | null
	mode: 'custom' | 'category' | 'existing' // Mode selection
	categoryFilterId: number | null // For category mode
	options: VariationOptionInput[] // For custom mode
	existingMenuItemIds?: number[] // For existing-items mode: selected menu item ids
	position: number
}

export interface VariationOptionInput {
	id?: number // For editing existing
	name: string
	priceAdjustment: string
	availability?: boolean
	isDefault: boolean
	position: number
}

export interface AddonInput {
	id?: number // For editing existing
	menuItemId: number // Existing menu item to use as addon
	label: string | null // Optional label override
	priceOverride: string | null // Optional price override
	required: boolean
	position: number
}

export type VariationGroupMode = 'custom' | 'category' | 'existing'

export interface SelectionType {
	id: number
	code: string
	description: string | null
}
