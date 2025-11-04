import type { MenuItemAvailabilitySchedule } from '../menuItemTypes'

export interface MenuItemForCustomer {
	id: number
	name: string
	basePrice: number
	images: string[]
	availability: boolean
	displayImageIndex: number
	availabilitySchedule?: MenuItemAvailabilitySchedule | null
	category: {
		id: number
		name: string
	} | null
}

export interface ConcessionWithMenuItems {
	id: number
	name: string
	image_url: string | null
	is_open: boolean
	menuItems: MenuItemForCustomer[]
}

export interface CafeteriaWithConcessions {
	id: number
	name: string
	location: string | null
	image_url: string | null
	concessions: ConcessionWithMenuItems[]
}

export interface CafeteriasWithMenuResponse {
	success: boolean
	cafeterias: CafeteriaWithConcessions[]
}
