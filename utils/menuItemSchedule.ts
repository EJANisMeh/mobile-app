import {
	CONCESSION_SCHEDULE_DAY_KEYS,
	CONCESSION_SCHEDULE_DAY_LABELS,
} from './concessionSchedule'
import type { MenuItemAvailabilitySchedule, MenuItemDayKey } from '../types'

const DATE_DAY_TO_KEY: MenuItemDayKey[] = [
	'sunday',
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
]

export type MenuItemAvailabilityStatus =
	| 'available'
	| 'not_served_today'
	| 'out_of_stock'

export const createDefaultMenuItemSchedule =
	(): MenuItemAvailabilitySchedule => {
		const schedule: Partial<MenuItemAvailabilitySchedule> = {}

		CONCESSION_SCHEDULE_DAY_KEYS.forEach((dayKey) => {
			schedule[dayKey as MenuItemDayKey] = true
		})

		return schedule as MenuItemAvailabilitySchedule
	}

export const normalizeMenuItemSchedule = (
	raw?: unknown
): MenuItemAvailabilitySchedule => {
	const defaults = createDefaultMenuItemSchedule()

	if (!raw || typeof raw !== 'object') {
		return { ...defaults }
	}

	const normalized: Partial<MenuItemAvailabilitySchedule> = { ...defaults }
	CONCESSION_SCHEDULE_DAY_KEYS.forEach((dayKey) => {
		const value = (raw as Record<string, unknown>)[dayKey]
		normalized[dayKey as MenuItemDayKey] = Boolean(
			value ?? defaults[dayKey as MenuItemDayKey]
		)
	})

	return normalized as MenuItemAvailabilitySchedule
}

export const getMenuItemDayKeyForDate = (date: Date): MenuItemDayKey => {
	return DATE_DAY_TO_KEY[date.getDay()]
}

export const isMenuItemScheduledForDay = (
	schedule: MenuItemAvailabilitySchedule,
	dayKey: MenuItemDayKey
): boolean => {
	return Boolean(schedule[dayKey])
}

export const isMenuItemScheduledOnDate = (
	schedule: MenuItemAvailabilitySchedule,
	date: Date = new Date()
): boolean => {
	const dayKey = getMenuItemDayKeyForDate(date)
	return isMenuItemScheduledForDay(schedule, dayKey)
}

export const hasAnyMenuItemScheduleDay = (
	schedule: MenuItemAvailabilitySchedule
): boolean => {
	return CONCESSION_SCHEDULE_DAY_KEYS.some((dayKey) =>
		Boolean(schedule[dayKey as MenuItemDayKey])
	)
}

export const isMenuItemScheduleAllDays = (
	schedule: MenuItemAvailabilitySchedule
): boolean => {
	return CONCESSION_SCHEDULE_DAY_KEYS.every((dayKey) =>
		Boolean(schedule[dayKey as MenuItemDayKey])
	)
}

export const getMenuItemScheduleSummary = (
	schedule: MenuItemAvailabilitySchedule
): string => {
	if (isMenuItemScheduleAllDays(schedule)) {
		return 'Available every day'
	}

	const selectedDays = CONCESSION_SCHEDULE_DAY_KEYS.filter((dayKey) =>
		Boolean(schedule[dayKey as MenuItemDayKey])
	)

	if (selectedDays.length === 0) {
		return 'Not scheduled'
	}

	if (selectedDays.length === 1) {
		return `Only on ${CONCESSION_SCHEDULE_DAY_LABELS[selectedDays[0]]}`
	}

	return selectedDays
		.map((dayKey) => CONCESSION_SCHEDULE_DAY_LABELS[dayKey])
		.join(', ')
}

export const getMenuItemAvailabilityStatus = (
	schedule: MenuItemAvailabilitySchedule,
	isInventoryAvailable: boolean,
	referenceDate: Date = new Date()
): MenuItemAvailabilityStatus => {
	if (!hasAnyMenuItemScheduleDay(schedule)) {
		return 'not_served_today'
	}

	const servedToday = isMenuItemScheduledOnDate(schedule, referenceDate)

	if (!servedToday) {
		return 'not_served_today'
	}

	return isInventoryAvailable ? 'available' : 'out_of_stock'
}
