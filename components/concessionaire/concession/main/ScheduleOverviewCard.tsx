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

	const todayDetails = useMemo(() => {
		const todayIndex = new Date().getDay()
		const key = CONCESSION_SCHEDULE_DAY_KEYS[(todayIndex + 6) % 7] // convert Sunday(0) to last index
		const day = normalizedSchedule[key]
		return { key, day }
	}, [normalizedSchedule])

	const renderTodayLine = (day: ConcessionScheduleDay) => {
		if (!day.isOpen) {
			return 'Closed today'
		}
		return `${formatTimeDisplay(day.open)} - ${formatTimeDisplay(day.close)}`
	}

	const upcomingClosuresCount = useMemo(() => {
		if (!normalizedSchedule.specialDates) return 0
		const now = new Date()
		return normalizedSchedule.specialDates.filter((special) => {
			const date = new Date(special.date)
			return !Number.isNaN(date.getTime()) && date >= now && !special.isOpen
		}).length
	}, [normalizedSchedule.specialDates])

	return (
		<View style={styles.scheduleOverviewCard}>
			<View style={styles.scheduleOverviewHeader}>
				<Text style={styles.scheduleOverviewTitle}>Today&apos;s Hours</Text>
				<View
					style={[
						styles.scheduleStatusBadge,
						isConcessionOpen
							? styles.scheduleStatusBadgeOpen
							: styles.scheduleStatusBadgeClosed,
					]}>
					<Text
						style={[
							styles.scheduleStatusBadgeText,
							!isConcessionOpen && styles.scheduleStatusBadgeTextClosed,
						]}>
						{isConcessionOpen ? 'Open Now' : 'Closed'}
					</Text>
				</View>
			</View>

			<Text style={styles.scheduleOverviewDayLabel}>
				{CONCESSION_SCHEDULE_DAY_LABELS[todayDetails.key]}
			</Text>
			<Text style={styles.scheduleOverviewHours}>
				{renderTodayLine(todayDetails.day)}
			</Text>

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
