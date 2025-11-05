import React, { useEffect, useMemo, useState } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	BackHandler,
	ScrollView,
	Switch,
} from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import type { StackNavigationProp } from '@react-navigation/stack'
import { useThemeContext, useConcessionContext } from '../../../context'
import {
	useAlertModal,
	useResponsiveDimensions,
	useConfirmationModal,
	useHideNavBar,
} from '../../../hooks'
import { createEditConcessionStyles } from '../../../styles/concessionaire'
import {
	AlertModal,
	ConfirmationModal,
	BaseModal,
} from '../../../components/modals'
import {
	LoadingEditConcession,
	EditConcessionImage,
	EditConcessionForm,
	EditConcessionSaveButton,
} from '../../../components/concessionaire/concession/editDetails'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'
import type { ConcessionSchedule } from '../../../types'
import type { ConcessionaireStackParamList } from '../../../types/navigation'
import type { UseAlertModalType } from '../../../hooks/useModals/types'
import {
	CONCESSION_SCHEDULE_DAY_KEYS,
	CONCESSION_SCHEDULE_DAY_LABELS,
	areSchedulesEqual,
	createDefaultSchedule,
	dateToTimeString,
	normalizeConcessionSchedule,
	timeStringToDate,
	formatTimeDisplay,
	calculateDuration,
	formatDuration,
} from '../../../utils'

const DEFAULT_OPEN_TIME = '08:00'
const DEFAULT_CLOSE_TIME = '17:00'

type EditConcessionStyles = ReturnType<typeof createEditConcessionStyles>

type DayKey = (typeof CONCESSION_SCHEDULE_DAY_KEYS)[number]

type TimePickerState = {
	dayKey: DayKey
	field: 'open' | 'close'
} | null

type ScheduleEditorModalProps = {
	visible: boolean
	onClose: () => void
	onSave: (updated: ConcessionSchedule) => void
	currentSchedule: ConcessionSchedule
	styles: EditConcessionStyles
	showAlert: UseAlertModalType['showAlert']
}

const ScheduleEditorModal: React.FC<ScheduleEditorModalProps> = ({
	visible,
	onClose,
	onSave,
	currentSchedule,
	styles,
	showAlert,
}) => {
	const [draft, setDraft] = useState<ConcessionSchedule>(
		normalizeConcessionSchedule(currentSchedule)
	)
	const [timePicker, setTimePicker] = useState<TimePickerState>(null)

	useEffect(() => {
		if (visible) {
			setDraft(normalizeConcessionSchedule(currentSchedule))
		}
	}, [visible, currentSchedule])

	const handleToggleDay = (dayKey: DayKey, value: boolean) => {
		setDraft((prev) => {
			const next: ConcessionSchedule = {
				...prev,
				[dayKey]: {
					...prev[dayKey],
					isOpen: value,
					open: value ? prev[dayKey].open ?? DEFAULT_OPEN_TIME : null,
					close: value ? prev[dayKey].close ?? DEFAULT_CLOSE_TIME : null,
				},
			}
			return next
		})
	}

	const openTimePicker = (dayKey: DayKey, field: 'open' | 'close') => {
		setTimePicker({ dayKey, field })
	}

	const handleConfirmTime = (date: Date) => {
		if (!timePicker) {
			return
		}

		const timeValue = dateToTimeString(date)
		setDraft((prev) => {
			const next: ConcessionSchedule = {
				...prev,
				[timePicker.dayKey]: {
					...prev[timePicker.dayKey],
					[timePicker.field]: timeValue,
				},
			}
			return next
		})
		setTimePicker(null)
	}

	const handleCancelPicker = () => {
		setTimePicker(null)
	}

	const handleSave = () => {
		for (const key of CONCESSION_SCHEDULE_DAY_KEYS) {
			const day = draft[key]
			if (day.isOpen) {
				if (!day.open || !day.close) {
					showAlert({
						title: 'Invalid schedule',
						message: `Please set both opening and closing time for ${CONCESSION_SCHEDULE_DAY_LABELS[key]}.`,
					})
					return
				}
			}
		}

		onSave(draft)
		onClose()
	}

	const hasChanges = useMemo(
		() => !areSchedulesEqual(draft, currentSchedule),
		[draft, currentSchedule]
	)

	const activePickerDate = useMemo(() => {
		if (!timePicker) {
			return new Date()
		}
		const value = draft[timePicker.dayKey][timePicker.field]
		return timeStringToDate(value)
	}, [timePicker, draft])

	return (
		<>
			<BaseModal
				visible={visible}
				onClose={onClose}
				title="Edit Operating Schedule">
				<ScrollView style={styles.scheduleEditorScroll}>
					{CONCESSION_SCHEDULE_DAY_KEYS.map((dayKey) => {
						const day = draft[dayKey]
						const duration =
							day.isOpen && day.open && day.close
								? calculateDuration(day.open, day.close)
								: null
						const durationText = duration ? formatDuration(duration) : null

						return (
							<View
								key={dayKey}
								style={styles.scheduleEditorDayCard}>
								<View style={styles.scheduleEditorDayHeader}>
									<Text style={styles.scheduleEditorDayLabel}>
										{CONCESSION_SCHEDULE_DAY_LABELS[dayKey]}
									</Text>
									<Switch
										value={day.isOpen}
										onValueChange={(value) => handleToggleDay(dayKey, value)}
									/>
								</View>
								<View style={styles.scheduleEditorTimeRow}>
									<TouchableOpacity
										style={[
											styles.scheduleEditorTimeButton,
											!day.isOpen && styles.scheduleEditorTimeButtonDisabled,
										]}
										onPress={() => openTimePicker(dayKey, 'open')}
										disabled={!day.isOpen}>
										<Text style={styles.scheduleEditorTimeLabel}>Opens</Text>
										<Text style={styles.scheduleEditorTimeValue}>
											{day.isOpen ? formatTimeDisplay(day.open) : '--:--'}
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											styles.scheduleEditorTimeButton,
											!day.isOpen && styles.scheduleEditorTimeButtonDisabled,
										]}
										onPress={() => openTimePicker(dayKey, 'close')}
										disabled={!day.isOpen}>
										<Text style={styles.scheduleEditorTimeLabel}>Closes</Text>
										<Text style={styles.scheduleEditorTimeValue}>
											{day.isOpen ? formatTimeDisplay(day.close) : '--:--'}
										</Text>
									</TouchableOpacity>
								</View>
								{durationText && (
									<Text style={styles.scheduleEditorDurationText}>
										Open for {durationText}
									</Text>
								)}
							</View>
						)
					})}
				</ScrollView>
				<View style={styles.scheduleEditorFooter}>
					<TouchableOpacity
						style={styles.scheduleEditorActionButton}
						onPress={onClose}>
						<Text style={styles.scheduleEditorActionButtonText}>Cancel</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.scheduleEditorActionButton,
							styles.scheduleEditorActionButtonPrimary,
							!hasChanges && styles.scheduleEditorActionButtonDisabled,
						]}
						onPress={handleSave}
						disabled={!hasChanges}>
						<Text
							style={[
								styles.scheduleEditorActionButtonText,
								styles.scheduleEditorActionButtonPrimaryText,
								!hasChanges && styles.scheduleEditorActionButtonDisabledText,
							]}>
							Save
						</Text>
					</TouchableOpacity>
				</View>
			</BaseModal>
			<DateTimePickerModal
				isVisible={Boolean(timePicker)}
				mode="time"
				date={activePickerDate}
				onConfirm={handleConfirmTime}
				onCancel={handleCancelPicker}
				minuteInterval={5}
			/>
		</>
	)
}

const EditConcessionDetailsScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const { concession, loading } = useConcessionContext()
	const navigation =
		useNavigation<
			StackNavigationProp<ConcessionaireStackParamList, 'EditConcessionDetails'>
		>()
	const route =
		useRoute<RouteProp<ConcessionaireStackParamList, 'EditConcessionDetails'>>()
	const styles = createEditConcessionStyles(colors, responsive)

	const { visible, title, message, showAlert, hideAlert } = useAlertModal()
	const {
		visible: confirmVisible,
		props: confirmProps,
		showConfirmation,
		hideConfirmation,
	} = useConfirmationModal()
	const [isSaving, setIsSaving] = useState(false)

	const goBackToConcession = () => {
		if (navigation.canGoBack()) {
			navigation.goBack()
			return
		}

		navigation.navigate('MainTabs')
	}

	// Form state
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [imageUrl, setImageUrl] = useState('')
	const [edited, setEdited] = useState(false)
	const [schedule, setSchedule] = useState<ConcessionSchedule>(
		normalizeConcessionSchedule(createDefaultSchedule())
	)
	const [initialSchedule, setInitialSchedule] = useState<ConcessionSchedule>(
		normalizeConcessionSchedule(createDefaultSchedule())
	)
	const [scheduleEditorVisible, setScheduleEditorVisible] = useState(false)

	// Store initial values to compare against
	const [initialValues, setInitialValues] = useState({
		name: '',
		description: '',
		imageUrl: '',
	})

	// Initialize form with current concession data
	useEffect(() => {
		if (concession) {
			const initialName = concession.name || ''
			const initialDescription = concession.description || ''
			const initialImageUrl = concession.image_url || ''
			const normalizedSchedule = normalizeConcessionSchedule(
				concession.schedule
			)

			setName(initialName)
			setDescription(initialDescription)
			setImageUrl(initialImageUrl)
			setSchedule(normalizedSchedule)
			setInitialSchedule(JSON.parse(JSON.stringify(normalizedSchedule)))

			setInitialValues({
				name: initialName,
				description: initialDescription,
				imageUrl: initialImageUrl,
			})
		} else {
			const defaults = normalizeConcessionSchedule(createDefaultSchedule())
			setSchedule(defaults)
			setInitialSchedule(JSON.parse(JSON.stringify(defaults)))
			setName('')
			setDescription('')
			setImageUrl('')
			setInitialValues({ name: '', description: '', imageUrl: '' })
		}
	}, [concession])

	// Check if form has been edited
	useEffect(() => {
		const hasChanges =
			name !== initialValues.name ||
			description !== initialValues.description ||
			imageUrl !== initialValues.imageUrl

		const scheduleChanged = !areSchedulesEqual(schedule, initialSchedule)

		setEdited(hasChanges || scheduleChanged)
	}, [name, description, imageUrl, initialValues, schedule, initialSchedule])

	useHideNavBar()

	useEffect(() => {
		if (route?.params?.showScheduleEditor) {
			setScheduleEditorVisible(true)
			navigation.setParams({ showScheduleEditor: undefined })
		}
	}, [route?.params?.showScheduleEditor, navigation])

	const handleCancel = () => {
		if (edited) {
			showConfirmation({
				title: 'Discard Changes?',
				message:
					'You have unsaved changes. Are you sure you want to cancel? Your changes will be lost.',
				confirmText: 'Confirm cancel',
				cancelText: 'Keep Editing',
				confirmStyle: 'destructive',
				onConfirm: () => {
					goBackToConcession()
				},
			})
			return
		}

		goBackToConcession()
	}

	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				handleCancel()
				return true
			}
		)

		return () => backHandler.remove()
	}, [edited])

	const scheduleSummary = useMemo(() => {
		const openDays = CONCESSION_SCHEDULE_DAY_KEYS.filter(
			(key) => schedule[key]?.isOpen
		)

		if (openDays.length === 0) {
			return 'Closed all week'
		}

		const firstKey = openDays[0]
		const firstDay = schedule[firstKey]
		const range = firstDay.isOpen
			? `${formatTimeDisplay(firstDay.open)} - ${formatTimeDisplay(
					firstDay.close
			  )}`
			: 'Closed'

		if (openDays.length === 7) {
			return `Open daily • ${range}`
		}

		return `Open ${openDays.length} day${openDays.length > 1 ? 's' : ''} • ${
			CONCESSION_SCHEDULE_DAY_LABELS[firstKey]
		} ${range}`
	}, [schedule])

	const handleScheduleSave = (updated: ConcessionSchedule) => {
		const normalized = normalizeConcessionSchedule(updated)
		setSchedule(JSON.parse(JSON.stringify(normalized)))
	}

	if (loading && !concession) {
		return <LoadingEditConcession />
	}

	return (
		<DynamicKeyboardView>
			<DynamicScrollView
				styles={styles.container}
				autoCenter={false}
				showsVerticalScrollIndicator={true}>
				<View style={styles.scrollContent}>
					<EditConcessionImage
						imageUrl={imageUrl}
						setImageUrl={setImageUrl}
					/>

					<EditConcessionForm
						name={name}
						setName={setName}
						description={description}
						setDescription={setDescription}
						onSchedulePress={() => setScheduleEditorVisible(true)}
						scheduleSummary={scheduleSummary}
					/>

					<View style={styles.actionButtonsContainer}>
						<TouchableOpacity
							style={styles.cancelButton}
							onPress={handleCancel}
							disabled={isSaving}>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>

						<EditConcessionSaveButton
							name={name}
							description={description}
							imageUrl={imageUrl}
							schedule={schedule}
							isSaving={isSaving}
							setIsSaving={setIsSaving}
							showAlert={showAlert}
							edited={edited}
						/>
					</View>
				</View>
			</DynamicScrollView>

			<AlertModal
				visible={visible}
				onClose={hideAlert}
				title={title}
				message={message}
			/>

			<ConfirmationModal
				visible={confirmVisible}
				onClose={hideConfirmation}
				title={confirmProps.title}
				message={confirmProps.message}
				confirmText={confirmProps.confirmText}
				cancelText={confirmProps.cancelText}
				confirmStyle={confirmProps.confirmStyle}
				onConfirm={confirmProps.onConfirm}
			/>

			<ScheduleEditorModal
				visible={scheduleEditorVisible}
				onClose={() => setScheduleEditorVisible(false)}
				onSave={handleScheduleSave}
				currentSchedule={schedule}
				styles={styles}
				showAlert={showAlert}
			/>
		</DynamicKeyboardView>
	)
}

export default EditConcessionDetailsScreen
