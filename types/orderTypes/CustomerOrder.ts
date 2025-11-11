import type { PaymentMode } from '../paymentTypes'

export interface OrderStatus {
	code: string
	description: string
}

export interface OrderConcession {
	id: number
	name: string
	cafeteriaId: number
	cafeteria: {
		id: number
		name: string
		location: string | null
	} | null
}

export interface OrderMenuItem {
	name: string
	description: string | null
	images: string[]
}

export interface OrderItem {
	id: number
	orderId: number
	menuItemId: number
	variationId: number | null
	addon_menu_item_id: number | null
	quantity: number
	unitPrice: number
	variation_snapshot: any
	options_snapshot: any
	addons_snapshot: any
	item_total: number
	customer_request: string | null
	createdAt: Date
	menuItem: OrderMenuItem
}

export interface CustomerOrder {
	id: number
	customerId: number | null
	concessionId: number | null
	concession_order_number: number | null
	total: number
	original_total: number | null
	price_adjustment_reason: string | null
	payment_mode: PaymentMode | null
	payment_proof: any
	orderMode: 'now' | 'scheduled'
	scheduledFor: Date | null
	status_id: number
	concession_note: string | null
	createdAt: Date
	updatedAt: Date
	concession: OrderConcession | null
	order_statuses: OrderStatus
	orderItems: OrderItem[]
}

export type OrderSortField =
	| 'orderNumber'
	| 'concessionName'
	| 'total'
	| 'status'
	| 'orderMode'
	| 'createdAt'
	| 'scheduledFor'

export type SortDirection = 'asc' | 'desc'

export interface SortRule {
	field: OrderSortField
	direction: SortDirection
}

export interface OrderFilters {
	searchQuery: string // Search by order number only
	cafeteriaFilter: number | null // Single cafeteria selection (null = all)
	concessionFilters: number[] // Multi-select concessions (empty = all under selected cafeteria)
	statusFilters: string[] // Multi-select: empty array means all statuses
	orderModeFilters: Array<'now' | 'scheduled'> // Multi-select: empty array means all modes
	paymentProofFilter: 'all' | 'provided' | 'missing' // Filter by payment proof status
	dateFrom: Date | null
	dateTo: Date | null
}
