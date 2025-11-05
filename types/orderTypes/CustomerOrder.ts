export interface OrderStatus {
	code: string
	description: string | null
}

export interface OrderConcession {
	id: number
	name: string
	cafeteria: {
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
	createdAt: Date
	menuItem: OrderMenuItem
}

export interface CustomerOrder {
	id: number
	customerId: number | null
	concessionId: number | null
	total: number
	payment_mode: any
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
	searchQuery: string
	searchField: 'concessionName' | 'status' | 'all'
	statusFilter: string | null
	orderModeFilter: 'now' | 'scheduled' | null
	dateFrom: Date | null
	dateTo: Date | null
}
