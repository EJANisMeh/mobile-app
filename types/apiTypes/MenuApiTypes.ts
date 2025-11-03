import { MenuItemForCustomer } from '../cafeteriaTypes'

export interface MenuItemsResponse {
	success: boolean
	menuItems: RawMenuItem[]
	count: number
	page: number
	limit: number
	error?: string
}

export interface RawMenuItem {
	id: number
	name: string
	description: string | null
	basePrice: number | string
	availability: boolean
	concessionId: number
	categoryId?: number | null
	category?: {
		id: number
		name: string
	} | null
	images?: string[] | null
	display_image_index?: number | null
	menu_item_variation_groups?: RawMenuItemVariationGroup[]
	menu_item_addons_menu_item_addons_menu_item_idTomenu_items?: RawMenuItemAddon[]
	menu_item_addons_menu_item_addons_target_menu_item_idTomenu_items?: RawMenuItemAddon[]
	menu_item_category_links?: RawMenuItemCategoryLink[]
	concession?: {
		id: number
		name: string
		cafeteriaId: number | null
	} | null
}

export interface RawMenuItemVariationGroup {
	id: number
	name: string
	selection_type_id?: number | null
	selection_types?: RawSelectionType | null
	multi_limit?: number | null
	menu_item_variation_option_choices?: RawMenuItemVariationOptionChoice[]
}

export interface RawMenuItemVariationOptionChoice {
	id: number
	name: string
	price_adjustment: number | string
	is_default: boolean
	availability: boolean
	position?: number | null
}

export interface RawSelectionType {
	id: number
	code: string
	description: string | null
}

export interface RawMenuItemAddon {
	id: number
	label: string | null
	price_override: number | string | null
	required: boolean
}

export interface RawMenuItemCategoryLink {
	category?: {
		id: number
		name: string
	} | null
}

export interface ConcessionMenuItemListItem
	extends Pick<
		MenuItemForCustomer,
		| 'id'
		| 'name'
		| 'basePrice'
		| 'images'
		| 'availability'
		| 'displayImageIndex'
	> {
	description: string | null
	imageToDisplay: string | null
	priceDisplay: string
	category: MenuItemForCustomer['category']
}

export interface MenuSearchParams {
	search?: string
	category?: string
	availableOnly?: boolean
	page?: number
	limit?: number
}
