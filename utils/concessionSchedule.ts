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

export const areSchedulesEqual = (
	a: ConcessionSchedule | null | undefined,
	b: ConcessionSchedule | null | undefined
): boolean => {
	return JSON.stringify(a ?? null) === JSON.stringify(b ?? null)
}

/**
 * Check if a concession is currently open based on their schedule and is_open status
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

	// Get current day key
	const dayIndex = now.getDay() // 0 = Sunday, 1 = Monday, etc.
	const dayKey = CONCESSION_SCHEDULE_DAY_KEYS[(dayIndex + 6) % 7] // Convert to our format
	const todaySchedule = normalized[dayKey]

	// Check if concession is marked as open for today
	if (!todaySchedule.isOpen) {
		return false
	}

	// Check if open/close times are set
	if (!todaySchedule.open || !todaySchedule.close) {
		return false
	}

	// Parse current time and operating hours
	const currentTime = now.getHours() * 60 + now.getMinutes()
	const [openHours, openMinutes] = todaySchedule.open
		.split(':')
		.map((part) => parseInt(part, 10))
	const [closeHours, closeMinutes] = todaySchedule.close
		.split(':')
		.map((part) => parseInt(part, 10))

	const openTime = openHours * 60 + openMinutes
	const closeTime = closeHours * 60 + closeMinutes

	// Check if current time is within operating hours
	return currentTime >= openTime && currentTime <= closeTime
}
