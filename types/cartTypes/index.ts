import type {
	AddonSnapshot,
	VariationGroupSnapshot,
	VariationOptionSnapshot,
} from '../apiTypes/OrderApiTypes'

export interface CartItemInput {
	menuItemId: number
	concessionId: number
	concessionName: string | null
	name: string
	description: string | null
	image: string | null
	categoryName: string | null
	quantity: number
	unitPrice: number
	variationGroups: VariationGroupSnapshot[]
	variationOptions: VariationOptionSnapshot[]
	addons: AddonSnapshot[]
}

export interface CartItem extends CartItemInput {
	id: string
	userId: number
	totalPrice: number
	addedAt: string
}
