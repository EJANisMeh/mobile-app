import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import {
	useThemeContext,
	useConcessionContext,
	useAuthContext,
} from '../../../context'
import {
	useAlertModal,
	useConfirmationModal,
	useResponsiveDimensions,
} from '../../../hooks'
import { createConcessionStyles } from '../../../styles/concessionaire'
import { AlertModal, ConfirmationModal } from '../../../components/modals'
import {
	LoadingConcession,
	NoConcession,
	ConcessionHeader,
	ConcessionStatusButton,
	ConcessionEditDetailsButton,
	PaymentMethodsList,
	ConcessionScheduleButton,
	ScheduleOverviewCard,
} from '../../../components/concessionaire/concession/main'
import { ConcessionScheduleModal } from '../../../components/concessionaire/concession/schedule'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'

const ConcessionScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const { user } = useAuthContext()
	const { concession, loading, getConcession } = useConcessionContext()
	const concessionStyles = createConcessionStyles(colors, responsive)
	const [scheduleModalVisible, setScheduleModalVisible] = useState(false)

	const { visible, title, message, showAlert, hideAlert, handleClose } =
		useAlertModal()

	const {
		visible: confirmVisible,
		props: confirmProps,
		showConfirmation,
		hideConfirmation,
	} = useConfirmationModal()

	useEffect(() => {
		if (user?.concession_id) {
			getConcession(user.concession_id)
		}
	}, [user?.concession_id, getConcession])

	const handleOpenSchedule = () => {
		setScheduleModalVisible(true)
	}

	const handleCloseSchedule = () => {
		setScheduleModalVisible(false)
	}

	if (loading && !concession) {
		return <LoadingConcession />
	}

	if (!concession && !loading) {
		return <NoConcession />
	}

	return (
		<DynamicKeyboardView useSafeArea={true}>
			<DynamicScrollView
				styles={concessionStyles.container}
				autoCenter={false}
				showsVerticalScrollIndicator={true}>
				<View style={concessionStyles.scrollContent}>
					<ConcessionHeader />

					<ConcessionStatusButton
						showAlert={showAlert}
						showConfirmation={showConfirmation}
					/>

					<View style={concessionStyles.scheduleOverviewContainer}>
						<Text style={concessionStyles.sectionTitle}>Schedule</Text>
						<ScheduleOverviewCard
							schedule={concession?.schedule ?? null}
							isConcessionOpen={Boolean(concession?.is_open)}
						/>
					</View>

					<View style={concessionStyles.actionsSection}>
						<Text style={concessionStyles.sectionTitle}>Manage</Text>

						<ConcessionEditDetailsButton />
						<ConcessionScheduleButton
							onPress={handleOpenSchedule}
							hasSchedule={Boolean(concession?.schedule)}
						/>
					</View>

					<View style={concessionStyles.paymentMethodsSection}>
						<Text style={concessionStyles.sectionTitle}>Payment Methods</Text>

						<PaymentMethodsList />
					</View>
				</View>
			</DynamicScrollView>

			<AlertModal
				visible={visible}
				onClose={hideAlert}
				title={title}
				message={message}
				buttons={[{ text: 'OK', onPress: handleClose }]}
			/>

			<ConfirmationModal
				visible={confirmVisible}
				onClose={hideConfirmation}
				title={confirmProps.title}
				message={confirmProps.message}
				onConfirm={() => {
					confirmProps.onConfirm()
					hideConfirmation()
				}}
				onCancel={() => hideConfirmation()}
			/>

			<ConcessionScheduleModal
				visible={scheduleModalVisible}
				onClose={handleCloseSchedule}
				schedule={concession?.schedule ?? null}
				concessionName={concession?.name ?? 'Concession'}
			/>
		</DynamicKeyboardView>
	)
}

export default ConcessionScreen
