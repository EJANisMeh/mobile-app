import React, { useMemo } from 'react'
import { Text, View } from 'react-native'
import { ConcessionSchedule, ConcessionScheduleDay } from '../../../../types'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionStyles } from '../../../../styles/concessionaire'
import {
	CONCESSION_SCHEDULE_DAY_KEYS,
	CONCESSION_SCHEDULE_DAY_LABELS,
	formatTimeDisplay,
	normalizeConcessionSchedule,
	isConcessionOpenNow,
	calculateDuration,
	formatDuration,
	ConcessionScheduleDayKey,
} from '../../../../utils'

interface ScheduleOverviewCardProps {
	schedule: ConcessionSchedule | null | undefined
	isConcessionOpen: boolean
}

const ScheduleOverviewCard: React.FC<ScheduleOverviewCardProps> = ({
	schedule,
	isConcessionOpen,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionStyles(colors, responsive)

	const normalizedSchedule = useMemo(
		() => normalizeConcessionSchedule(schedule),
		[schedule]
	)

	const isActuallyOpen = useMemo(
		() => isConcessionOpenNow(isConcessionOpen, schedule),
		[isConcessionOpen, schedule]
	)

	const todayDetails = useMemo(() => {
		const todayIndex = new Date().getDay()
		const key = CONCESSION_SCHEDULE_DAY_KEYS[(todayIndex + 6) % 7] // convert Sunday(0) to last index
		const day = normalizedSchedule[key]

		// Get tomorrow's schedule for overlap detection
		const tomorrowIndex = (todayIndex + 1) % 7
		const tomorrowKey = CONCESSION_SCHEDULE_DAY_KEYS[(tomorrowIndex + 6) % 7]
		const tomorrowDay = normalizedSchedule[tomorrowKey]

		// Get yesterday's schedule to check if it extends into today
		const yesterdayIndex = (todayIndex + 6) % 7
		const yesterdayKey = CONCESSION_SCHEDULE_DAY_KEYS[(yesterdayIndex + 6) % 7]
		const yesterdayDay = normalizedSchedule[yesterdayKey]

		return { key, day, tomorrowKey, tomorrowDay, yesterdayKey, yesterdayDay }
	}, [normalizedSchedule])

	const renderTodayLine = (
		day: ConcessionScheduleDay,
		dayKey: ConcessionScheduleDayKey,
		tomorrowDay: ConcessionScheduleDay,
		tomorrowKey: ConcessionScheduleDayKey
	) => {
		if (!day.isOpen) {
			return { timeRange: 'Closed today', duration: null, label: null }
		}

		const openTime = day.open
		const closeTime = day.close

		if (!openTime || !closeTime) {
			return { timeRange: 'No schedule set', duration: null, label: null }
		}

		// Calculate duration
		const duration = calculateDuration(openTime, closeTime)

		// Check if it's 24 hours (same open and close time)
		const is24Hours = openTime === closeTime

		// Check if tomorrow has conflicting schedule (overlap detection)
		if (
			is24Hours &&
			tomorrowDay.isOpen &&
			tomorrowDay.open &&
			tomorrowDay.close
		) {
			const [tomorrowOpenHours, tomorrowOpenMinutes] = tomorrowDay.open
				.split(':')
				.map((p) => parseInt(p, 10))
			const [todayCloseHours, todayCloseMinutes] = closeTime
				.split(':')
				.map((p) => parseInt(p, 10))

			const tomorrowOpenTime = tomorrowOpenHours * 60 + tomorrowOpenMinutes
			const todayCloseTime = todayCloseHours * 60 + todayCloseMinutes

			// If tomorrow's opening time is before today's 24-hour closing time, there's overlap
			// Today's 24-hour schedule "wins" and extends to tomorrow
			if (tomorrowOpenTime < todayCloseTime) {
				return {
					timeRange: `${formatTimeDisplay(openTime)} - ${formatTimeDisplay(
						closeTime
					)}`,
					duration,
					label: `${CONCESSION_SCHEDULE_DAY_LABELS[dayKey]} to ${CONCESSION_SCHEDULE_DAY_LABELS[tomorrowKey]}`,
				}
			}

			// No overlap, show as regular 24-hour day without label
			return {
				timeRange: `${formatTimeDisplay(openTime)} - ${formatTimeDisplay(
					closeTime
				)}`,
				duration,
				label: null,
			}
		}

		// 24 hours without tomorrow schedule - show with label
		if (is24Hours) {
			return {
				timeRange: `${formatTimeDisplay(openTime)} - ${formatTimeDisplay(
					closeTime
				)}`,
				duration,
				label: `${CONCESSION_SCHEDULE_DAY_LABELS[dayKey]} to ${CONCESSION_SCHEDULE_DAY_LABELS[tomorrowKey]}`,
			}
		}

		// Check if it's overnight hours (close <= open but not 24 hours)
		const [openHours, openMinutes] = openTime
			.split(':')
			.map((p) => parseInt(p, 10))
		const [closeHours, closeMinutes] = closeTime
			.split(':')
			.map((p) => parseInt(p, 10))

		const openTotalMinutes = openHours * 60 + openMinutes
		const closeTotalMinutes = closeHours * 60 + closeMinutes

		const isOvernight = closeTotalMinutes < openTotalMinutes

		return {
			timeRange: `${formatTimeDisplay(openTime)} - ${formatTimeDisplay(
				closeTime
			)}`,
			duration,
			label: isOvernight
				? `${CONCESSION_SCHEDULE_DAY_LABELS[dayKey]} to ${CONCESSION_SCHEDULE_DAY_LABELS[tomorrowKey]}`
				: null,
		}
	}

	const upcomingClosuresCount = useMemo(() => {
		if (!normalizedSchedule.specialDates) return 0
		const now = new Date()
		return normalizedSchedule.specialDates.filter((special) => {
			const date = new Date(special.date)
			return !Number.isNaN(date.getTime()) && date >= now && !special.isOpen
		}).length
	}, [normalizedSchedule.specialDates])

	const scheduleInfo = useMemo(() => {
		// First, check if yesterday's schedule extends into today
		const {
			yesterdayKey,
			yesterdayDay,
			key: todayKey,
			day: todayDay,
			tomorrowKey,
			tomorrowDay,
		} = todayDetails

		if (yesterdayDay.isOpen && yesterdayDay.open && yesterdayDay.close) {
			const [yOpenHours, yOpenMinutes] = yesterdayDay.open
				.split(':')
				.map((p) => parseInt(p, 10))
			const [yCloseHours, yCloseMinutes] = yesterdayDay.close
				.split(':')
				.map((p) => parseInt(p, 10))

			const yOpenMin = yOpenHours * 60 + yOpenMinutes
			const yCloseMin = yCloseHours * 60 + yCloseMinutes

			// Yesterday had overnight or 24-hour schedule
			if (yCloseMin <= yOpenMin) {
				// Check if today's schedule overlaps with yesterday's extended schedule
				if (todayDay.isOpen && todayDay.open && todayDay.close) {
					const [tOpenHours, tOpenMinutes] = todayDay.open
						.split(':')
						.map((p) => parseInt(p, 10))
					const [tCloseHours, tCloseMinutes] = todayDay.close
						.split(':')
						.map((p) => parseInt(p, 10))

					const tOpenMin = tOpenHours * 60 + tOpenMinutes
					const tCloseMin = tCloseHours * 60 + tCloseMinutes

					// If today opens before yesterday closes, there's a conflict
					if (tOpenMin < yCloseMin) {
						// Conflict resolution: whoever closes later wins
						// If today closes later than yesterday, show today's schedule
						if (tCloseMin > yCloseMin) {
							// Today wins (closes later)
							const duration = calculateDuration(todayDay.open, todayDay.close)
							return {
								timeRange: `${formatTimeDisplay(
									todayDay.open
								)} - ${formatTimeDisplay(todayDay.close)}`,
								duration,
								label: null, // Just show today's day name
							}
						}
						// If they close at the same time, today wins
						else if (tCloseMin === yCloseMin) {
							// Today wins (same closing time, prefer today)
							const duration = calculateDuration(todayDay.open, todayDay.close)
							return {
								timeRange: `${formatTimeDisplay(
									todayDay.open
								)} - ${formatTimeDisplay(todayDay.close)}`,
								duration,
								label: null, // Just show today's day name
							}
						}
						// If today closes earlier than yesterday, yesterday wins
						else {
							// Yesterday wins (closes later)
							const duration = calculateDuration(
								yesterdayDay.open,
								yesterdayDay.close
							)
							return {
								timeRange: `${formatTimeDisplay(
									yesterdayDay.open
								)} - ${formatTimeDisplay(yesterdayDay.close)}`,
								duration,
								label: `${CONCESSION_SCHEDULE_DAY_LABELS[yesterdayKey]} to ${CONCESSION_SCHEDULE_DAY_LABELS[todayKey]}`,
							}
						}
					}
					// If today opens at or after yesterday closes, no conflict
					// Show today's schedule normally
				} else {
					// Today is closed, so show yesterday's extended schedule
					const duration = calculateDuration(
						yesterdayDay.open,
						yesterdayDay.close
					)
					return {
						timeRange: `${formatTimeDisplay(
							yesterdayDay.open
						)} - ${formatTimeDisplay(yesterdayDay.close)}`,
						duration,
						label: `${CONCESSION_SCHEDULE_DAY_LABELS[yesterdayKey]} to ${CONCESSION_SCHEDULE_DAY_LABELS[todayKey]}`,
					}
				}
			}
		}

		// No yesterday overlap, show today's schedule
		return renderTodayLine(todayDay, todayKey, tomorrowDay, tomorrowKey)
	}, [todayDetails])

	return (
		<View style={styles.scheduleOverviewCard}>
			<View style={styles.scheduleOverviewHeader}>
				<Text style={styles.scheduleOverviewTitle}>Today&apos;s Hours</Text>
				<View
					style={[
						styles.scheduleStatusBadge,
						isActuallyOpen
							? styles.scheduleStatusBadgeOpen
							: styles.scheduleStatusBadgeClosed,
					]}>
					<Text
						style={[
							styles.scheduleStatusBadgeText,
							!isActuallyOpen && styles.scheduleStatusBadgeTextClosed,
						]}>
						{isActuallyOpen ? 'Open Now' : 'Closed'}
					</Text>
				</View>
			</View>

			<Text style={styles.scheduleOverviewDayLabel}>
				{scheduleInfo.label || CONCESSION_SCHEDULE_DAY_LABELS[todayDetails.key]}
			</Text>
			<Text style={styles.scheduleOverviewHours}>{scheduleInfo.timeRange}</Text>

			{scheduleInfo.duration && (
				<Text style={styles.scheduleOverviewDuration}>
					{formatDuration(scheduleInfo.duration)}
				</Text>
			)}

			<Text style={styles.scheduleOverviewFooter}>
				{upcomingClosuresCount > 0
					? `${upcomingClosuresCount} upcoming closure${
							upcomingClosuresCount > 1 ? 's' : ''
					  }`
					: 'No planned closures'}
			</Text>
		</View>
	)
}

export default ScheduleOverviewCard
