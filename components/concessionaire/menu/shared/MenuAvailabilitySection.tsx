import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../../../../context'
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
} from '../../../../utils'
import type {
	MenuItemAvailabilitySchedule,
	MenuItemDayKey,
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

	const styles = useMemo(() => {
		return variant === 'edit'
			? createConcessionaireEditMenuItemStyles(colors, responsive)
			: createConcessionaireAddMenuItemStyles(colors, responsive)
	}, [colors, responsive, variant])

	const normalized = useMemo(
		() => normalizeMenuItemSchedule(schedule),
		[schedule]
	)

	const summary = useMemo(
		() => getMenuItemScheduleSummary(normalized),
		[normalized]
	)

	const handleToggleDay = (dayKey: MenuItemDayKey) => {
		onChange({
			...normalized,
			[dayKey]: !normalized[dayKey],
		})
	}

	const handleSelectAll = () => {
		onChange({
			...normalized,
			monday: true,
			tuesday: true,
			wednesday: true,
			thursday: true,
			friday: true,
			saturday: true,
			sunday: true,
		})
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
					return (
						<TouchableOpacity
							key={dayKey}
							style={[
								styles.scheduleDayButton,
								isActive && styles.scheduleDayButtonActive,
							]}
							onPress={() => handleToggleDay(dayKey as MenuItemDayKey)}>
							<Text
								style={[
									styles.scheduleDayText,
									isActive && styles.scheduleDayTextActive,
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
