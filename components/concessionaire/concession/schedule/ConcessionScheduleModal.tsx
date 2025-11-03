import React, { useMemo } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { BaseModal } from '../../../modals'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionStyles } from '../../../../styles/concessionaire'
import { ConcessionSchedule } from '../../../../types'
import {
	CONCESSION_SCHEDULE_DAY_KEYS,
	CONCESSION_SCHEDULE_DAY_LABELS,
	formatDateDisplay,
	formatTimeDisplay,
	normalizeConcessionSchedule,
} from '../../../../utils'

interface ConcessionScheduleModalProps {
	visible: boolean
	onClose: () => void
	schedule: ConcessionSchedule | null | undefined
	concessionName: string
	onPressEdit?: () => void
}

const ConcessionScheduleModal: React.FC<ConcessionScheduleModalProps> = ({
	visible,
	onClose,
	schedule,
	concessionName,
	onPressEdit,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionStyles(colors, responsive)

	const normalizedSchedule = useMemo(
		() => normalizeConcessionSchedule(schedule),
		[schedule]
	)

	const specialDates = normalizedSchedule.specialDates ?? []
	const breaks = normalizedSchedule.breaks ?? []

	return (
		<BaseModal
			visible={visible}
			onClose={onClose}
			title={`${concessionName} Schedule`}>
			<ScrollView style={styles.scheduleModalScroll}>
				<Text style={styles.scheduleModalSectionTitle}>Weekly Hours</Text>
				{CONCESSION_SCHEDULE_DAY_KEYS.map((key) => {
					const day = normalizedSchedule[key]
					return (
						<View
							key={key}
							style={styles.scheduleDayRow}>
							<Text style={styles.scheduleDayLabel}>
								{CONCESSION_SCHEDULE_DAY_LABELS[key]}
							</Text>
							<Text style={styles.scheduleDayHours}>
								{day.isOpen
									? `${formatTimeDisplay(day.open)} - ${formatTimeDisplay(
											day.close
									  )}`
									: 'Closed'}
							</Text>
						</View>
					)
				})}

				<View style={styles.scheduleModalDivider} />

				<Text style={styles.scheduleModalSectionTitle}>Breaks</Text>
				{breaks.length === 0 ? (
					<Text style={styles.scheduleModalEmpty}>No breaks added yet.</Text>
				) : (
					breaks.map((breakItem, index) => (
						<View
							key={`${breakItem.start}-${index}`}
							style={styles.scheduleBreakRow}>
							<Text style={styles.scheduleBreakLabel}>{`Break ${
								index + 1
							}`}</Text>
							<Text style={styles.scheduleBreakHours}>
								{`${formatTimeDisplay(breakItem.start)} - ${formatTimeDisplay(
									breakItem.end
								)}`}
							</Text>
						</View>
					))
				)}

				<View style={styles.scheduleModalDivider} />

				<Text style={styles.scheduleModalSectionTitle}>Special Dates</Text>
				{specialDates.length === 0 ? (
					<Text style={styles.scheduleModalEmpty}>No special dates yet.</Text>
				) : (
					specialDates.map((special, index) => (
						<View
							key={`${special.date}-${index}`}
							style={styles.scheduleSpecialRow}>
							<View>
								<Text style={styles.scheduleSpecialDate}>
									{formatDateDisplay(special.date)}
								</Text>
								<Text style={styles.scheduleSpecialReason}>
									{special.reason ? special.reason : 'No reason provided'}
								</Text>
							</View>
							<View
								style={[
									styles.scheduleSpecialBadge,
									special.isOpen
										? styles.scheduleSpecialBadgeOpen
										: styles.scheduleSpecialBadgeClosed,
								]}>
								<Text
									style={[
										styles.scheduleSpecialBadgeText,
										!special.isOpen && styles.scheduleSpecialBadgeTextClosed,
									]}>
									{special.isOpen ? 'Open' : 'Closed'}
								</Text>
							</View>
						</View>
					))
				)}
			</ScrollView>

			{onPressEdit ? (
				<TouchableOpacity
					style={styles.scheduleModalEditButton}
					onPress={onPressEdit}>
					<Text style={styles.scheduleModalEditButtonText}>Edit schedule</Text>
				</TouchableOpacity>
			) : null}
		</BaseModal>
	)
}

export default ConcessionScheduleModal
