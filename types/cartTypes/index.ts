import type {
	AddonSnapshot,
	VariationGroupSnapshot,
	VariationOptionSnapshot,
} from '../apiTypes/OrderApiTypes'
import type { ConcessionSchedule } from '../concessionTypes'
import type {
	MenuItemAvailabilitySchedule,
	MenuItemAvailabilityStatus,
	MenuItemDayKey,
} from '../menuItemTypes'

export type StatusTone = 'success' | 'warning' | 'error' | 'info'

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

export interface CartMenuItemMeta {
	schedule: MenuItemAvailabilitySchedule
	availabilityStatus: MenuItemAvailabilityStatus
	concessionSchedule: ConcessionSchedule | null
	concessionIsOpen: boolean
	concessionName: string | null
}

export interface CartGroup {
	concessionId: number
	concessionName: string
	items: CartItem[]
	menuMeta: Record<number, CartMenuItemMeta>
	missingMetaItemIds: number[]
	hasCompleteMeta: boolean
	status: MenuItemAvailabilityStatus
	concessionSchedule: ConcessionSchedule | null
	concessionIsOpen: boolean
	combinedSchedule: MenuItemAvailabilitySchedule | null
	hasServingDay: boolean
	sharedServingDays: MenuItemDayKey[]
	requiresSplitScheduling: boolean
	totalQuantity: number
	totalAmount: number
}

export interface GroupStatusInfo {
	label: string
	helper: string | null
	tone: StatusTone
	servedToday: boolean
}

export interface CartItemStatusInfo {
	label: string
	tone: StatusTone
}
