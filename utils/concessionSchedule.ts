import { ConcessionSchedule, ConcessionScheduleDay } from '../types'

export type ConcessionScheduleDayKey =
	| 'monday'
	| 'tuesday'
	| 'wednesday'
	| 'thursday'
	| 'friday'
	| 'saturday'
	| 'sunday'

export const CONCESSION_SCHEDULE_DAY_KEYS: ConcessionScheduleDayKey[] = [
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
	'sunday',
]

export const CONCESSION_SCHEDULE_DAY_LABELS: Record<
	ConcessionScheduleDayKey,
	string
> = {
	monday: 'Monday',
	tuesday: 'Tuesday',
	wednesday: 'Wednesday',
	thursday: 'Thursday',
	friday: 'Friday',
	saturday: 'Saturday',
	sunday: 'Sunday',
}

const padTimePart = (value: number): string => value.toString().padStart(2, '0')

export const createDefaultScheduleDay = (
	overrides?: Partial<ConcessionScheduleDay>
): ConcessionScheduleDay => ({
	open: null,
	close: null,
	isOpen: false,
	...overrides,
})

export const createDefaultSchedule = (): ConcessionSchedule => {
	const base: Record<ConcessionScheduleDayKey, ConcessionScheduleDay> =
		{} as Record<ConcessionScheduleDayKey, ConcessionScheduleDay>

	CONCESSION_SCHEDULE_DAY_KEYS.forEach((key) => {
		base[key] = createDefaultScheduleDay()
	})

	return {
		...base,
		breaks: [],
		specialDates: [],
	}
}

export const normalizeConcessionSchedule = (
	schedule?: ConcessionSchedule | null
): ConcessionSchedule => {
	const defaults = createDefaultSchedule()

	if (!schedule) {
		return defaults
	}

	const normalized: ConcessionSchedule = {
		...defaults,
		breaks: Array.isArray(schedule.breaks) ? schedule.breaks : [],
		specialDates: Array.isArray(schedule.specialDates)
			? schedule.specialDates.map((special) => ({
					date: special.date,
					isOpen: Boolean(special.isOpen),
					reason: special.reason ?? '',
			  }))
			: [],
	}

	CONCESSION_SCHEDULE_DAY_KEYS.forEach((key) => {
		const dayData = (schedule as ConcessionSchedule)[key]
		if (dayData && typeof dayData === 'object') {
			normalized[key] = createDefaultScheduleDay({
				open:
					typeof dayData.open === 'string' ? dayData.open : defaults[key].open,
				close:
					typeof dayData.close === 'string'
						? dayData.close
						: defaults[key].close,
				isOpen: Boolean(dayData.isOpen),
			})
		} else {
			normalized[key] = createDefaultScheduleDay()
		}
	})

	return normalized
}

export const timeStringToDate = (value: string | null): Date => {
	const date = new Date()
	if (!value) {
		date.setHours(9, 0, 0, 0)
		return date
	}

	const [hours, minutes] = value.split(':').map((part) => parseInt(part, 10))
	date.setHours(
		Number.isNaN(hours) ? 9 : hours,
		Number.isNaN(minutes) ? 0 : minutes,
		0,
		0
	)
	return date
}

export const dateToTimeString = (value: Date): string => {
	return `${padTimePart(value.getHours())}:${padTimePart(value.getMinutes())}`
}

export const formatTimeDisplay = (time: string | null): string => {
	if (!time) {
		return '--:--'
	}

	const [hoursRaw, minutesRaw] = time
		.split(':')
		.map((part) => parseInt(part, 10))
	const hours = Number.isNaN(hoursRaw) ? 0 : hoursRaw
	const minutes = Number.isNaN(minutesRaw) ? 0 : minutesRaw
	const period = hours >= 12 ? 'PM' : 'AM'
	const twelveHour = hours % 12 === 0 ? 12 : hours % 12
	return `${twelveHour}:${padTimePart(minutes)} ${period}`
}

export const formatDateDisplay = (dateValue: string): string => {
	if (!dateValue) return 'Unknown date'
	const date = new Date(dateValue)
	if (Number.isNaN(date.getTime())) {
		return dateValue
	}
	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})
}

/**
 * Calculate the duration between opening and closing times
 * Handles overnight hours (e.g., 8:00 AM to 2:00 AM next day = 18 hours)
 * @param openTime - Opening time in HH:mm format
 * @param closeTime - Closing time in HH:mm format
 * @returns Object with hours and minutes, or null if times are invalid
 */
export const calculateDuration = (
	openTime: string | null,
	closeTime: string | null
): { hours: number; minutes: number } | null => {
	if (!openTime || !closeTime) {
		return null
	}

	const [openHours, openMinutes] = openTime
		.split(':')
		.map((part) => parseInt(part, 10))
	const [closeHours, closeMinutes] = closeTime
		.split(':')
		.map((part) => parseInt(part, 10))

	if (
		Number.isNaN(openHours) ||
		Number.isNaN(openMinutes) ||
		Number.isNaN(closeHours) ||
		Number.isNaN(closeMinutes)
	) {
		return null
	}

	let openTotalMinutes = openHours * 60 + openMinutes
	let closeTotalMinutes = closeHours * 60 + closeMinutes

	// If close time is less than or equal to open time, it means overnight (next day)
	if (closeTotalMinutes <= openTotalMinutes) {
		closeTotalMinutes += 24 * 60 // Add 24 hours
	}

	const durationMinutes = closeTotalMinutes - openTotalMinutes
	const hours = Math.floor(durationMinutes / 60)
	const minutes = durationMinutes % 60

	return { hours, minutes }
}

/**
 * Format duration for display
 * @param duration - Duration object with hours and minutes
 * @returns Formatted string like "8 hours 30 minutes" or "24 hours"
 */
export const formatDuration = (
	duration: {
		hours: number
		minutes: number
	} | null
): string => {
	if (!duration) {
		return ''
	}

	const { hours, minutes } = duration

	if (hours === 0 && minutes === 0) {
		return '24 hours' // Same time = full day
	}

	if (minutes === 0) {
		return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
	}

	if (hours === 0) {
		return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
	}

	return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} ${
		minutes === 1 ? 'minute' : 'minutes'
	}`
}

export const areSchedulesEqual = (
	a: ConcessionSchedule | null | undefined,
	b: ConcessionSchedule | null | undefined
): boolean => {
	return JSON.stringify(a ?? null) === JSON.stringify(b ?? null)
}

/**
 * Check if a concession is currently open based on their schedule and is_open status
 * Handles overnight hours correctly (e.g., 8:00 AM Wed to 2:00 AM Thu)
 * @param isConcessionOpen - The concession's is_open boolean from database
 * @param schedule - The concession's operating hours schedule
 * @returns true if concession is marked open AND currently within operating hours
 */
export const isConcessionOpenNow = (
	isConcessionOpen: boolean,
	schedule: ConcessionSchedule | null | undefined
): boolean => {
	// If concession is marked as closed, return false immediately
	if (!isConcessionOpen) {
		return false
	}

	// If no schedule is set, use only is_open status
	if (!schedule) {
		return isConcessionOpen
	}

	const now = new Date()
	const normalized = normalizeConcessionSchedule(schedule)

	// Check for special dates first
	if (normalized.specialDates && normalized.specialDates.length > 0) {
		const todayStr = now.toISOString().split('T')[0] // YYYY-MM-DD
		const specialDate = normalized.specialDates.find((special) => {
			const specialDateStr = new Date(special.date).toISOString().split('T')[0]
			return specialDateStr === todayStr
		})

		if (specialDate) {
			// If there's a special date for today and it's closed, return false
			if (!specialDate.isOpen) {
				return false
			}
			// If special date is open, we still need to check regular hours
		}
	}

	const currentTime = now.getHours() * 60 + now.getMinutes()
	const dayIndex = now.getDay() // 0 = Sunday, 1 = Monday, etc.

	// Helper function to check if current time is within a day's operating hours
	const isWithinHours = (daySchedule: ConcessionScheduleDay): boolean => {
		if (!daySchedule.isOpen || !daySchedule.open || !daySchedule.close) {
			return false
		}

		const [openHours, openMinutes] = daySchedule.open
			.split(':')
			.map((part) => parseInt(part, 10))
		const [closeHours, closeMinutes] = daySchedule.close
			.split(':')
			.map((part) => parseInt(part, 10))

		const openTime = openHours * 60 + openMinutes
		let closeTime = closeHours * 60 + closeMinutes

		// Check if this is overnight hours (close time <= open time)
		if (closeTime <= openTime) {
			// Overnight schedule - open crosses midnight into next day
			return currentTime >= openTime || currentTime <= closeTime
		} else {
			// Regular same-day schedule
			return currentTime >= openTime && currentTime <= closeTime
		}
	}

	// Get today's schedule key
	const todayKey = CONCESSION_SCHEDULE_DAY_KEYS[(dayIndex + 6) % 7]
	const todaySchedule = normalized[todayKey]

	// Check if we're currently in today's operating hours
	if (isWithinHours(todaySchedule)) {
		return true
	}

	// Check if we're in yesterday's overnight hours
	// (e.g., it's 1:00 AM Thursday, but Wednesday was open until 2:00 AM)
	const yesterdayIndex = (dayIndex + 6) % 7 // Go back one day
	const yesterdayKey = CONCESSION_SCHEDULE_DAY_KEYS[(yesterdayIndex + 6) % 7]
	const yesterdaySchedule = normalized[yesterdayKey]

	if (
		yesterdaySchedule.isOpen &&
		yesterdaySchedule.open &&
		yesterdaySchedule.close
	) {
		const [openHours, openMinutes] = yesterdaySchedule.open
			.split(':')
			.map((part) => parseInt(part, 10))
		const [closeHours, closeMinutes] = yesterdaySchedule.close
			.split(':')
			.map((part) => parseInt(part, 10))

		const openTime = openHours * 60 + openMinutes
		const closeTime = closeHours * 60 + closeMinutes

		// Check if yesterday had overnight hours and we're still within them
		if (closeTime <= openTime) {
			// Yesterday was open overnight, check if current time is before closing
			if (currentTime <= closeTime) {
				return true
			}
		}
	}

	return false
}

/**
 * Check if a concession is closing soon (within 30 minutes)
 * Used to disable "Order Now" mode when concession is about to close
 * @param isConcessionOpen - The concession's is_open boolean from database
 * @param schedule - The concession's operating hours schedule
 * @param minutesBeforeClose - Minutes before closing time to consider as "closing soon" (default: 30)
 * @returns true if concession is open but closing within the specified minutes
 */
export const isConcessionClosingSoon = (
	isConcessionOpen: boolean,
	schedule: ConcessionSchedule | null | undefined,
	minutesBeforeClose = 30
): boolean => {
	// If concession is not open, it's not closing soon
	if (!isConcessionOpen || !schedule) {
		return false
	}

	const now = new Date()
	const normalized = normalizeConcessionSchedule(schedule)
	const currentTime = now.getHours() * 60 + now.getMinutes()
	const dayIndex = now.getDay()

	// Get today's schedule
	const todayKey = CONCESSION_SCHEDULE_DAY_KEYS[(dayIndex + 6) % 7]
	const todaySchedule = normalized[todayKey]

	if (!todaySchedule.isOpen || !todaySchedule.open || !todaySchedule.close) {
		return false
	}

	const [openHours, openMinutes] = todaySchedule.open
		.split(':')
		.map((part) => parseInt(part, 10))
	const [closeHours, closeMinutes] = todaySchedule.close
		.split(':')
		.map((part) => parseInt(part, 10))

	const openTime = openHours * 60 + openMinutes
	let closeTime = closeHours * 60 + closeMinutes

	// Check if overnight schedule
	const isOvernight = closeTime <= openTime

	if (isOvernight) {
		// If it's overnight and current time is before midnight
		// Check if we're within closing window
		if (currentTime >= openTime) {
			// We're after opening time, check against midnight + close time
			const minutesUntilMidnight = 24 * 60 - currentTime
			const minutesAfterMidnightToClose = closeTime
			const totalMinutesUntilClose =
				minutesUntilMidnight + minutesAfterMidnightToClose

			return totalMinutesUntilClose <= minutesBeforeClose
		} else {
			// Current time is after midnight, check against close time
			return closeTime - currentTime <= minutesBeforeClose
		}
	} else {
		// Regular hours - check if within closing window
		if (currentTime >= openTime && currentTime < closeTime) {
			return closeTime - currentTime <= minutesBeforeClose
		}
	}

	return false
}
