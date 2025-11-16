import {
	ConcessionSchedule,
	MenuItemAvailabilitySchedule,
	MenuItemDayKey,
} from '../types'
import {
	normalizeMenuItemSchedule,
	getMenuItemDayKeyForDate,
} from './menuItemSchedule'

import {
	normalizeConcessionSchedule,
	CONCESSION_SCHEDULE_DAY_KEYS,
	ConcessionScheduleDayKey,
} from './concessionSchedule'

export interface ValidScheduleWindow {
	dayKey: MenuItemDayKey
	date: Date
	openTime: string // HH:mm format
	closeTime: string // HH:mm format
	isOvernight: boolean // true if closeTime extends to next day
}

/**
 * Get the days that a menu item is available to be sold
 * @param schedule Menu item availability schedule
 * @returns Array of day keys where item is available
 */
export const getMenuItemAvailableDays = (
	schedule: MenuItemAvailabilitySchedule | undefined | null
): MenuItemDayKey[] => {
	if (!schedule) return []

	const normalized = normalizeMenuItemSchedule(schedule)
	const availableDays: MenuItemDayKey[] = []

	CONCESSION_SCHEDULE_DAY_KEYS.forEach((dayKey) => {
		if (normalized[dayKey as MenuItemDayKey]) {
			availableDays.push(dayKey as MenuItemDayKey)
		}
	})

	return availableDays
}

/**
 * Get the intersection of multiple menu item schedules
 * Returns only the days where ALL items are available
 * @param schedules Array of menu item availability schedules
 * @returns Array of day keys where all items are available
 */
export const getCommonAvailableDays = (
	schedules: (MenuItemAvailabilitySchedule | undefined | null)[]
): MenuItemDayKey[] => {
	if (schedules.length === 0) return []

	// Get available days for each schedule
	const allAvailableDays = schedules.map(getMenuItemAvailableDays)

	// Find intersection - days that appear in ALL schedules
	const firstScheduleDays = allAvailableDays[0]
	if (!firstScheduleDays) return []

	return firstScheduleDays.filter((dayKey) =>
		allAvailableDays.every((days) => days.includes(dayKey))
	)
}

/**
 * Get valid scheduling windows based on concession hours and item availability
 * @param concessionSchedule Concession operating hours
 * @param itemSchedules Array of all item/option availability schedules (main item + all selected variations/addons)
 * @param startDate Optional start date to begin searching from (default: today)
 * @param daysAhead Number of days ahead to search (default: 7)
 * @returns Array of valid schedule windows
 */
export const getValidScheduleWindows = (
	concessionSchedule: ConcessionSchedule | undefined | null,
	itemSchedules: (MenuItemAvailabilitySchedule | undefined | null)[],
	startDate: Date = new Date(),
	daysAhead: number = 7
): ValidScheduleWindow[] => {
	if (!concessionSchedule || itemSchedules.length === 0) {
		return []
	}

	const normalized = normalizeConcessionSchedule(concessionSchedule)
	const commonDays = getCommonAvailableDays(itemSchedules)

	if (commonDays.length === 0) {
		return []
	}

	const windows: ValidScheduleWindow[] = []

	// Check each day for the next 'daysAhead' days
	for (let i = 0; i < daysAhead; i++) {
		const checkDate = new Date(startDate)
		checkDate.setDate(checkDate.getDate() + i)
		checkDate.setHours(0, 0, 0, 0) // Reset to start of day

		const dayKey = getMenuItemDayKeyForDate(
			checkDate
		) as ConcessionScheduleDayKey

		// Check if this day is in the common available days
		if (!commonDays.includes(dayKey as MenuItemDayKey)) {
			continue
		}

		// Check if concession is open on this day
		const daySchedule = normalized[dayKey]
		if (!daySchedule.isOpen || !daySchedule.open || !daySchedule.close) {
			continue
		}

		// Parse open and close times
		const [openHours, openMinutes] = daySchedule.open
			.split(':')
			.map((part: string) => parseInt(part, 10))
		const [closeHours, closeMinutes] = daySchedule.close
			.split(':')
			.map((part: string) => parseInt(part, 10))

		const openTime = openHours * 60 + openMinutes
		const closeTime = closeHours * 60 + closeMinutes

		// Check if this is overnight schedule
		const isOvernight = closeTime <= openTime

		windows.push({
			dayKey: dayKey as MenuItemDayKey,
			date: new Date(checkDate),
			openTime: daySchedule.open,
			closeTime: daySchedule.close,
			isOvernight,
		})
	}

	return windows
}

/**
 * Check if a specific date and time falls within valid scheduling windows
 * @param scheduledDateTime The date and time to check
 * @param concessionSchedule Concession operating hours
 * @param itemSchedules Array of all item/option availability schedules
 * @returns true if the datetime is valid, false otherwise
 */
export const isValidScheduledDateTime = (
	scheduledDateTime: Date,
	concessionSchedule: ConcessionSchedule | undefined | null,
	itemSchedules: (MenuItemAvailabilitySchedule | undefined | null)[]
): boolean => {
	const windows = getValidScheduleWindows(
		concessionSchedule,
		itemSchedules,
		new Date(),
		30 // Check 30 days ahead
	)

	const scheduledDate = new Date(scheduledDateTime)
	scheduledDate.setHours(0, 0, 0, 0)

	const scheduledTime =
		scheduledDateTime.getHours() * 60 + scheduledDateTime.getMinutes()

	// Find matching window for the scheduled date
	for (const window of windows) {
		const windowDate = new Date(window.date)
		windowDate.setHours(0, 0, 0, 0)

		// Check if dates match
		if (windowDate.getTime() !== scheduledDate.getTime()) {
			continue
		}

		// Check if time falls within window
		const [openHours, openMinutes] = window.openTime
			.split(':')
			.map((part) => parseInt(part, 10))
		const [closeHours, closeMinutes] = window.closeTime
			.split(':')
			.map((part) => parseInt(part, 10))

		const openTime = openHours * 60 + openMinutes
		const closeTime = closeHours * 60 + closeMinutes

		if (window.isOvernight) {
			// Overnight: valid if after open time OR before close time
			if (scheduledTime >= openTime || scheduledTime <= closeTime) {
				return true
			}
		} else {
			// Regular: valid if between open and close
			if (scheduledTime >= openTime && scheduledTime <= closeTime) {
				return true
			}
		}
	}

	return false
}

/**
 * Get a human-readable summary of available scheduling days
 * @param windows Array of valid schedule windows
 * @returns Summary string like "Monday, Wednesday, Friday"
 */
export const getScheduleWindowsSummary = (
	windows: ValidScheduleWindow[]
): string => {
	if (windows.length === 0) {
		return 'No available scheduling times'
	}

	const uniqueDays = new Set(windows.map((w) => w.dayKey))
	const dayLabels: Record<string, string> = {
		monday: 'Monday',
		tuesday: 'Tuesday',
		wednesday: 'Wednesday',
		thursday: 'Thursday',
		friday: 'Friday',
		saturday: 'Saturday',
		sunday: 'Sunday',
	}

	const dayNames = Array.from(uniqueDays)
		.map((day) => dayLabels[day])
		.filter(Boolean)

	if (dayNames.length === 7) {
		return 'Available every day'
	}

	return dayNames.join(', ')
}
