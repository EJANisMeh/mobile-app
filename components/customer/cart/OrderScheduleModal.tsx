import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import BaseModal from '../../modals/BaseModal'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createOrderScheduleModalStyles } from '../../../styles/customer'
import type {
	MenuItemAvailabilitySchedule,
	MenuItemAvailabilityStatus,
	OrderMode,
	ScheduleSelectionState,
	ConcessionSchedule,
} from '../../../types'
import {
	isMenuItemScheduledOnDate,
	normalizeMenuItemSchedule,
	getMenuItemDayKeyForDate,
	normalizeConcessionSchedule,
	CONCESSION_SCHEDULE_DAY_KEYS,
	CONCESSION_SCHEDULE_DAY_LABELS,
	formatTimeDisplay,
	isConcessionClosingSoon,
} from '../../../utils'

interface OrderScheduleModalProps {
	visible: boolean
	onClose: () => void
	onConfirm: (selection: ScheduleSelectionState) => void
	schedule: MenuItemAvailabilitySchedule | undefined | null
	concessionSchedule: ConcessionSchedule | undefined | null
	isConcessionOpen: boolean
	availabilityStatus: MenuItemAvailabilityStatus
	itemName: string
}
const DEFAULT_SCHEDULED_HOUR = 11
const DEFAULT_SCHEDULED_MINUTE = 0

interface QuickPickOption {
	id: string
	label: string
	date: Date
}

const combineDateAndTime = (base: Date, timeValue: string | null): Date => {
	const [hoursRaw, minutesRaw] = (timeValue ?? '').split(':')
	const hours = Number.isFinite(Number(hoursRaw))
		? parseInt(hoursRaw as string, 10)
		: DEFAULT_SCHEDULED_HOUR
	const minutes = Number.isFinite(Number(minutesRaw))
		? parseInt(minutesRaw as string, 10)
		: DEFAULT_SCHEDULED_MINUTE

	const combined = new Date(base)
	combined.setHours(hours, minutes, 0, 0)
	return combined
}

const OrderScheduleModal: React.FC<OrderScheduleModalProps> = ({
	visible,
	onClose,
	onConfirm,
	schedule,
	concessionSchedule,
	isConcessionOpen,
	availabilityStatus,
	itemName,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createOrderScheduleModalStyles(colors, responsive)

	const normalizedSchedule = useMemo(
		() => normalizeMenuItemSchedule(schedule ?? undefined),
		[schedule]
	)

	const normalizedConcessionSchedule = useMemo(
		() => normalizeConcessionSchedule(concessionSchedule ?? undefined),
		[concessionSchedule]
	)

	const [mode, setMode] = useState<OrderMode>(
		availabilityStatus === 'available' ? 'now' : 'scheduled'
	)
	const [scheduledAt, setScheduledAt] = useState<Date | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [pickerVisible, setPickerVisible] = useState(false)

	useEffect(() => {
		if (visible) {
			setMode(availabilityStatus === 'available' ? 'now' : 'scheduled')
			setScheduledAt(null)
			setError(null)
			setPickerVisible(false)
		}
	}, [visible, availabilityStatus])

	const scheduleSummary = useMemo(() => {
		const sellingDays = CONCESSION_SCHEDULE_DAY_KEYS.filter((dayKey) =>
			Boolean(normalizedSchedule[dayKey])
		)
		if (sellingDays.length === 0) {
			return 'Not scheduled'
		}
		return sellingDays
			.map((dayKey) => CONCESSION_SCHEDULE_DAY_LABELS[dayKey])
			.join(', ')
	}, [normalizedSchedule])

	const formatScheduledDateTime = (date: Date): string => {
		const dateStr = date.toLocaleDateString(undefined, {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		})

		const hours = date.getHours()
		const minutes = date.getMinutes()
		const period = hours >= 12 ? 'PM' : 'AM'
		const twelveHour = hours % 12 === 0 ? 12 : hours % 12
		const timeStr = `${twelveHour}:${minutes
			.toString()
			.padStart(2, '0')} ${period}`

		return `${dateStr} at ${timeStr}`
	}

	const isOrderNowDisabled =
		availabilityStatus !== 'available' ||
		isConcessionClosingSoon(isConcessionOpen, concessionSchedule)

	const availableDayKeys = useMemo(() => {
		return CONCESSION_SCHEDULE_DAY_KEYS.filter((dayKey) => {
			const itemAvailable = Boolean(normalizedSchedule[dayKey])
			const concessionDay = normalizedConcessionSchedule[dayKey]
			return (
				itemAvailable &&
				Boolean(concessionDay?.isOpen) &&
				typeof concessionDay?.open === 'string' &&
				typeof concessionDay?.close === 'string'
			)
		})
	}, [normalizedConcessionSchedule, normalizedSchedule])

	const quickPickOptions = useMemo(() => {
		const results: QuickPickOption[] = []
		const now = new Date()

		let offset = 1
		while (results.length < 3 && offset <= 21) {
			const candidateDate = new Date(now)
			candidateDate.setDate(now.getDate() + offset)
			candidateDate.setSeconds(0, 0)

			const dayKey = getMenuItemDayKeyForDate(candidateDate)
			if (!availableDayKeys.includes(dayKey)) {
				offset += 1
				continue
			}

			const concessionDay = normalizedConcessionSchedule[dayKey]
			const openTime =
				typeof concessionDay?.open === 'string'
					? concessionDay.open
					: `${DEFAULT_SCHEDULED_HOUR}:${DEFAULT_SCHEDULED_MINUTE.toString().padStart(
							2,
							'0'
					  )}`
			const scheduledDate = combineDateAndTime(candidateDate, openTime)
			if (scheduledDate.getTime() <= now.getTime()) {
				offset += 1
				continue
			}

			const label = `${
				CONCESSION_SCHEDULE_DAY_LABELS[dayKey]
			} • ${scheduledDate.toLocaleDateString(undefined, {
				month: 'short',
				day: 'numeric',
			})} ${formatTimeDisplay(openTime)}`

			results.push({
				id: `${dayKey}-${offset}`,
				label,
				date: scheduledDate,
			})
			offset += 1
		}

		return results
	}, [availableDayKeys, normalizedConcessionSchedule])

	const isDateValid = (candidate: Date | null): boolean => {
		if (!candidate) {
			return false
		}

		const now = new Date()
		if (candidate.getTime() <= now.getTime()) {
			return false
		}

		if (!isMenuItemScheduledOnDate(normalizedSchedule, candidate)) {
			return false
		}

		const dayKey = getMenuItemDayKeyForDate(candidate)
		const concessionDay = normalizedConcessionSchedule[dayKey]
		if (
			!concessionDay?.isOpen ||
			typeof concessionDay.open !== 'string' ||
			typeof concessionDay.close !== 'string'
		) {
			return false
		}

		const opensAt = combineDateAndTime(candidate, concessionDay.open)
		const closesAt = combineDateAndTime(candidate, concessionDay.close)

		if (candidate < opensAt || candidate > closesAt) {
			return false
		}

		return true
	}

	const validateScheduledDate = (candidate: Date): boolean => {
		const now = new Date()
		if (candidate.getTime() <= now.getTime()) {
			setError('Please choose a future date and time.')
			return false
		}

		if (!isMenuItemScheduledOnDate(normalizedSchedule, candidate)) {
			setError(
				'This item is not available on the selected day/time. Pick another day/time.'
			)
			return false
		}

		const dayKey = getMenuItemDayKeyForDate(candidate)
		const concessionDay = normalizedConcessionSchedule[dayKey]
		if (
			!concessionDay?.isOpen ||
			typeof concessionDay.open !== 'string' ||
			typeof concessionDay.close !== 'string'
		) {
			setError(
				'The concession is closed on the selected day/time. Pick another date/time.'
			)
			return false
		}

		const opensAt = combineDateAndTime(candidate, concessionDay.open)
		const closesAt = combineDateAndTime(candidate, concessionDay.close)

		if (candidate < opensAt || candidate > closesAt) {
			setError(
				`Please choose a time between ${formatTimeDisplay(
					concessionDay.open
				)} and ${formatTimeDisplay(concessionDay.close)}.`
			)
			return false
		}

		setError(null)
		return true
	}

	const handleShowPicker = () => {
		setPickerVisible(true)
	}

	const handleHidePicker = () => {
		setPickerVisible(false)
	}

	const handlePickerConfirm = (date: Date) => {
		handleHidePicker()
		setMode('scheduled')
		setScheduledAt(date)
		validateScheduledDate(date)
	}

	const applyQuickPick = (option: QuickPickOption) => {
		setMode('scheduled')
		setScheduledAt(option.date)
		validateScheduledDate(option.date)
	}

	const handleConfirmSelection = () => {
		if (mode === 'now') {
			onConfirm({ mode: 'now', scheduledAt: null })
			onClose()
			return
		}

		if (!scheduledAt) {
			setError('Select a valid date and time for your scheduled order.')
			return
		}

		if (!validateScheduledDate(scheduledAt)) {
			return
		}

		onConfirm({ mode: 'scheduled', scheduledAt })
		onClose()
	}

	const modeButton = (id: OrderMode, label: string, disabled = false) => {
		const isActive = mode === id
		return (
			<TouchableOpacity
				style={[
					styles.modeButton,
					isActive && styles.modeButtonActive,
					disabled && styles.modeButtonDisabled,
				]}
				onPress={() => {
					if (disabled) {
						return
					}
					setMode(id)
					setError(null)
				}}
				disabled={disabled}>
				<Text
					style={[
						styles.modeButtonText,
						isActive && styles.modeButtonTextActive,
						disabled && styles.modeButtonTextDisabled,
					]}>
					{label}
				</Text>
			</TouchableOpacity>
		)
	}

	const isConfirmDisabled =
		mode === 'scheduled' && (!scheduledAt || !isDateValid(scheduledAt))

	return (
		<>
			<BaseModal
				visible={visible}
				onClose={onClose}
				title={`How would you like to order ${itemName}?`}>
				<ScrollView
					style={styles.scrollArea}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={true}>
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Choose order mode</Text>
						<View style={styles.modeRow}>
							{modeButton('now', 'Order Now', isOrderNowDisabled)}
							{modeButton('scheduled', 'Schedule Order')}
						</View>
						{isOrderNowDisabled ? (
							<Text style={styles.helperText}>
								Currently unavailable for immediate pick-up.
							</Text>
						) : null}
					</View>

					{mode === 'scheduled' ? (
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Selling schedule</Text>
							<Text style={styles.helperText}>
								Days this order is available for ordering:
							</Text>
							<View style={styles.scheduleDaysRow}>
								{CONCESSION_SCHEDULE_DAY_KEYS.map((dayKey) => {
									const isActive = Boolean(normalizedSchedule[dayKey])
									return (
										<View
											key={dayKey}
											style={[
												styles.scheduleDayChip,
												isActive
													? styles.scheduleDayChipActive
													: styles.scheduleDayChipInactive,
											]}>
											<Text
												style={[
													styles.scheduleDayChipText,
													isActive
														? styles.scheduleDayChipTextActive
														: styles.scheduleDayChipTextInactive,
												]}>
												{CONCESSION_SCHEDULE_DAY_LABELS[dayKey].slice(0, 3)}
											</Text>
										</View>
									)
								})}
							</View>
							{availableDayKeys.length === 0 ? (
								<Text style={[styles.helperText, { marginTop: 8 }]}>
									No days are currently available for scheduling.
								</Text>
							) : null}
						</View>
					) : null}

					{mode === 'scheduled' ? (
						<View style={styles.section}>
							{quickPickOptions.length > 0 ? (
								<>
									<Text style={styles.sectionTitle}>Quick picks</Text>
									<View style={styles.presetRow}>
										{quickPickOptions.map((option) => (
											<TouchableOpacity
												key={option.id}
												style={styles.presetButton}
												onPress={() => applyQuickPick(option)}>
												<Text style={styles.presetButtonText}>
													{option.label}
												</Text>
											</TouchableOpacity>
										))}
									</View>
								</>
							) : null}

							<View style={styles.sectionSpacer} />

							<View style={styles.dateTimeSection}>
								<TouchableOpacity
									style={styles.pickerButton}
									onPress={handleShowPicker}>
									<Text style={styles.pickerButtonText}>
										{scheduledAt ? 'Change date & time' : 'Pick date & time'}
									</Text>
								</TouchableOpacity>

								{scheduledAt ? (
									<View style={styles.selectedDateTimeCard}>
										<Text style={styles.selectedDateTimeLabel}>
											Scheduled for:
										</Text>
										<Text style={styles.selectedDateTimeValue}>
											{formatScheduledDateTime(scheduledAt)}
										</Text>
									</View>
								) : null}
							</View>
						</View>
					) : null}

					{error ? <Text style={styles.errorText}>{error}</Text> : null}

					<View style={styles.actionsRow}>
						<TouchableOpacity
							style={[styles.actionButton, styles.cancelButton]}
							onPress={onClose}>
							<Text style={styles.actionButtonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.actionButton,
								styles.confirmButton,
								styles.actionButtonSpacing,
								isConfirmDisabled && styles.confirmButtonDisabled,
							]}
							onPress={handleConfirmSelection}
							disabled={isConfirmDisabled}>
							<Text
								style={[
									styles.actionButtonText,
									styles.confirmButtonText,
									isConfirmDisabled && styles.confirmButtonTextDisabled,
								]}>
								Continue
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</BaseModal>

			<DateTimePickerModal
				isVisible={pickerVisible}
				mode="datetime"
				minimumDate={new Date(Date.now() + 5 * 60 * 1000)}
				onConfirm={handlePickerConfirm}
				onCancel={handleHidePicker}
			/>
		</>
	)
}

export default OrderScheduleModal
