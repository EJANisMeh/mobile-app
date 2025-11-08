import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useThemeContext, useConcessionContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import {
	createConcessionaireAddMenuItemStyles,
	createConcessionaireEditMenuItemStyles,
} from '../../../../styles/concessionaire'
import {
	CONCESSION_SCHEDULE_DAY_KEYS,
	CONCESSION_SCHEDULE_DAY_LABELS,
	getMenuItemScheduleSummary,
	normalizeMenuItemSchedule,
	hasAnyMenuItemScheduleDay,
	normalizeConcessionSchedule,
} from '../../../../utils'
import type {
	MenuItemAvailabilitySchedule,
	MenuItemDayKey,
	ConcessionSchedule,
} from '../../../../types'

export type MenuAvailabilitySectionVariant = 'add' | 'edit'

type MenuAvailabilitySectionProps = {
	schedule: MenuItemAvailabilitySchedule
	onChange: (next: MenuItemAvailabilitySchedule) => void
	error?: string
	variant?: MenuAvailabilitySectionVariant
}

const MenuAvailabilitySection: React.FC<MenuAvailabilitySectionProps> = ({
	schedule,
	onChange,
	error,
	variant = 'add',
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const { concession } = useConcessionContext()

	const styles = useMemo(() => {
		return variant === 'edit'
			? createConcessionaireEditMenuItemStyles(colors, responsive)
			: createConcessionaireAddMenuItemStyles(colors, responsive)
	}, [colors, responsive, variant])

	const normalized = useMemo(
		() => normalizeMenuItemSchedule(schedule),
		[schedule]
	)

	// Get concession's working days
	const concessionSchedule = useMemo(
		() => normalizeConcessionSchedule(concession?.schedule ?? undefined),
		[concession?.schedule]
	)

	// Get available days based on concession schedule
	const availableDays = useMemo(() => {
		return CONCESSION_SCHEDULE_DAY_KEYS.filter((dayKey) => {
			const daySchedule = concessionSchedule[dayKey]
			return daySchedule?.isOpen === true
		})
	}, [concessionSchedule])

	const summary = useMemo(
		() => getMenuItemScheduleSummary(normalized),
		[normalized]
	)

	const handleToggleDay = (dayKey: MenuItemDayKey) => {
		// Only allow toggling if day is available in concession schedule
		if (!availableDays.includes(dayKey)) {
			return
		}

		onChange({
			...normalized,
			[dayKey]: !normalized[dayKey],
		})
	}

	const handleSelectAll = () => {
		// Only select days that are available in concession schedule
		const updatedSchedule = { ...normalized }
		availableDays.forEach((dayKey) => {
			updatedSchedule[dayKey as MenuItemDayKey] = true
		})
		onChange(updatedSchedule)
	}

	const handleClearAll = () => {
		onChange({
			monday: false,
			tuesday: false,
			wednesday: false,
			thursday: false,
			friday: false,
			saturday: false,
			sunday: false,
		})
	}

	return (
		<View style={styles.scheduleSection}>
			<View style={styles.scheduleHeaderRow}>
				<Text style={styles.sectionTitle}>Availability Schedule</Text>
				<View style={styles.scheduleActionsRow}>
					<TouchableOpacity
						style={styles.scheduleActionButton}
						onPress={handleSelectAll}>
						<Text style={styles.scheduleActionText}>Select all</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.scheduleActionButton}
						onPress={handleClearAll}>
						<Text style={styles.scheduleActionText}>Clear</Text>
					</TouchableOpacity>
				</View>
			</View>

			<Text style={styles.scheduleSummaryText}>{summary}</Text>

			<View style={styles.scheduleDayGrid}>
				{CONCESSION_SCHEDULE_DAY_KEYS.map((dayKey) => {
					const isActive = Boolean(normalized[dayKey as MenuItemDayKey])
					const isAvailable = availableDays.includes(dayKey)
					return (
						<TouchableOpacity
							key={dayKey}
							style={[
								styles.scheduleDayButton,
								isActive && styles.scheduleDayButtonActive,
								!isAvailable && styles.scheduleDayButtonDisabled,
							]}
							onPress={() => handleToggleDay(dayKey as MenuItemDayKey)}
							disabled={!isAvailable}>
							<Text
								style={[
									styles.scheduleDayText,
									isActive && styles.scheduleDayTextActive,
									!isAvailable && styles.scheduleDayTextDisabled,
								]}>
								{CONCESSION_SCHEDULE_DAY_LABELS[dayKey].slice(0, 3)}
							</Text>
						</TouchableOpacity>
					)
				})}
			</View>

			{!hasAnyMenuItemScheduleDay(normalized) && !error && (
				<Text style={styles.scheduleHintText}>
					Select at least one day to keep this item on the menu.
				</Text>
			)}

			{error ? <Text style={styles.scheduleErrorText}>{error}</Text> : null}
		</View>
	)
}

export default MenuAvailabilitySection
