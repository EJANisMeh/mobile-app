/**
 * Types for Add/Edit Menu Item functionality
 */

export type MenuItemDayKey =
	| 'monday'
	| 'tuesday'
	| 'wednesday'
	| 'thursday'
	| 'friday'
	| 'saturday'
	| 'sunday'

export type MenuItemAvailabilitySchedule = Record<MenuItemDayKey, boolean>

export type MenuItemAvailabilityStatus =
	| 'available'
	| 'not_served_today'
	| 'out_of_stock'

export interface AddMenuItemFormData {
	name: string
	description: string
	basePrice: string
	images: string[] // Max 3 images
	displayImageIndex: number // Index of image to display in menu list (0-2)
	categoryIds: number[] // Multiple categories support
	availability: boolean
	variationGroups: VariationGroupInput[]
	addons: AddonInput[]
	availabilitySchedule: MenuItemAvailabilitySchedule
}

export interface VariationGroupInput {
	id?: number // For editing existing
	name: string
	selectionTypeId: number
	multiLimit: number | null
	mode: 'custom' | 'single-category' | 'multi-category' | 'existing' // Mode selection
	categoryFilterId: number | null // For single-category mode
	categoryFilterIds?: number[] // For multi-category mode
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

export type VariationGroupMode =
	| 'custom'
	| 'single-category'
	| 'multi-category'
	| 'existing'

/**
 * Variation group kind (database column value)
 * Maps to the 'kind' column in menu_item_variation_groups table
 * - group: Custom variation group with manually defined options
 * - single_category_filter: Filter options by a single category
 * - multi_category_filter: Filter options by multiple categories
 * - existing_items: Use existing menu items as options
 */
export type VariationGroupKind =
	| 'group'
	| 'single_category_filter'
	| 'multi_category_filter'
	| 'existing_items'

/**
 * Maps variation group mode to database kind value
 */
export const VARIATION_GROUP_MODE_TO_KIND: Record<
	VariationGroupMode,
	VariationGroupKind
> = {
	custom: 'group',
	'single-category': 'single_category_filter',
	'multi-category': 'multi_category_filter',
	existing: 'existing_items',
}

/**
 * Maps database kind value to variation group mode
 */
export const VARIATION_GROUP_KIND_TO_MODE: Record<
	VariationGroupKind,
	VariationGroupMode
> = {
	group: 'custom',
	single_category_filter: 'single-category',
	multi_category_filter: 'multi-category',
	existing_items: 'existing',
}

/**
 * Helper function to get kind from mode
 */
export const getKindFromMode = (
	mode: VariationGroupMode
): VariationGroupKind => {
	return VARIATION_GROUP_MODE_TO_KIND[mode]
}

/**
 * Helper function to get mode from kind
 */
export const getModeFromKind = (
	kind: VariationGroupKind
): VariationGroupMode => {
	return VARIATION_GROUP_KIND_TO_MODE[kind]
}

export interface SelectionType {
	id: number
	code: string
	description: string | null
}
