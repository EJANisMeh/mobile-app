import type { OrderStatus, OrderMenuItem, OrderItem } from './CustomerOrder'
import type { PaymentMode } from '../paymentTypes'

export interface OrderCustomer {
	id: number
	fname: string | null
	lname: string | null
	email: string
}

export interface ConcessionOrder {
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
	customer: OrderCustomer | null
	order_statuses: OrderStatus
	orderItems: OrderItem[]
}

export interface ConcessionOrderFilters {
	searchQuery: string // Search by order number or customer email
	statusFilters: string[] // Multi-select: empty array means all statuses
	orderModeFilters: Array<'now' | 'scheduled'> // Multi-select: empty array means all modes
	paymentProofFilter: 'all' | 'provided' | 'missing' // Filter by payment proof status
	dateFrom: Date | null
	dateTo: Date | null
}

export type ConcessionOrderSortField =
	| 'orderNumber'
	| 'customerEmail'
	| 'total'
	| 'status'
	| 'orderMode'
	| 'createdAt'
	| 'scheduledFor'

export interface ConcessionOrderSortRule {
	field: ConcessionOrderSortField
	direction: 'asc' | 'desc'
}
