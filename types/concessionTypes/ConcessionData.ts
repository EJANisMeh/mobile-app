export interface ConcessionScheduleDay {
	open: string | null // "08:00" format
	close: string | null // "17:00" format
	isOpen: boolean
}

export interface ConcessionScheduleBreak {
	start: string // "12:00" format
	end: string // "13:00" format
}

export interface ConcessionScheduleSpecialDate {
	date: string // "2025-12-25" ISO date
	isOpen: boolean
	reason?: string
}

export interface ConcessionSchedule {
	monday: ConcessionScheduleDay
	tuesday: ConcessionScheduleDay
	wednesday: ConcessionScheduleDay
	thursday: ConcessionScheduleDay
	friday: ConcessionScheduleDay
	saturday: ConcessionScheduleDay
	sunday: ConcessionScheduleDay
	breaks?: ConcessionScheduleBreak[]
	specialDates?: ConcessionScheduleSpecialDate[]
}

export interface ConcessionData {
	id: number
	name: string
	description?: string | null
	image_url?: string | null
	cafeteriaId: number | null
	is_open: boolean
	payment_methods: string[] // ["cash", "gcash", "maya"]
	schedule?: ConcessionSchedule | null
	createdAt: Date
	updatedAt: Date
}

export interface UpdateConcessionData {
	name?: string
	description?: string | null
	image_url?: string | null
	is_open?: boolean
	payment_methods?: string[]
	schedule?: ConcessionSchedule | null
}
