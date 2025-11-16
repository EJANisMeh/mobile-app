export interface VariationOptionSnapshot {
	groupId: number
	optionId: number
	optionName: string
	priceAdjustment: number
	menuItemId?: number | null
	subVariationGroups?: VariationGroupSnapshot[] // Nested subvariations (1 level deep)
}

export interface VariationGroupSnapshot {
	groupId: number
	groupName: string
	selectionTypeCode: string
	multiLimit: number
	selectedOptions: VariationOptionSnapshot[]
}

export interface AddonSnapshot {
	addonId: number
	addonName: string
	price: number
	menuItemId?: number | null // Target menu item ID for schedule/availability checking
}

export interface PaymentProof {
	mode: 'text' | 'screenshot'
	value: string
	submittedAt?: string
}

export interface OrderItemPayload {
	menuItemId: number
	variationId: number | null
	addon_menu_item_id: number | null
	quantity: number
	unitPrice: number
	variation_snapshot: VariationGroupSnapshot[]
	options_snapshot: VariationOptionSnapshot[]
	addons_snapshot: AddonSnapshot[]
	item_total: number
	customer_request?: string | null
}

export interface CreateOrderPayload {
	orderMode: 'now' | 'scheduled'
	scheduledFor?: string | null
	customerId: number
	concessionId: number
	orderItems: OrderItemPayload[]
	total: number
	payment_mode?: Record<string, unknown>
	payment_proof?: PaymentProof | null
	concession_note?: string | null
}

export interface CreateOrderResponse {
	success: boolean
	message?: string
	error?: string
	order?: unknown
	orderItems?: unknown[]
}
