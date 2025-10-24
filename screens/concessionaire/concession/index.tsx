import React, { useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
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
} from '../../../components/concessionaire/concession/main'

const ConcessionScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const { user } = useAuthContext()
	const { concession, loading, getConcession } = useConcessionContext()
	const navigation = useNavigation()
	const concessionStyles = createConcessionStyles(colors, responsive)

	const { visible, title, message, showAlert, hideAlert, handleClose } =
		useAlertModal()

	const {
		visible: confirmVisible,
		props: confirmProps,
		showConfirmation,
		hideConfirmation,
	} = useConfirmationModal()

	// Load concession data on mount or when concession_id changes
	useEffect(() => {
		if (user?.concession_id) {
			getConcession(user.concession_id)
		}
	}, [user?.concession_id])

	const handleManagePaymentMethods = () => {
		navigation.navigate('ManagePaymentMethods' as never)
	}

	// Loading state
	if (loading && !concession) {
		return <LoadingConcession />
	}

	// No concession assigned
	if (!concession && !loading) {
		return <NoConcession />
	}

	// concession and !loading
	return (
		<View style={concessionStyles.container}>
			<ScrollView
				contentContainerStyle={concessionStyles.scrollContent}
				showsVerticalScrollIndicator={false}>
				{/* Header Section */}
				<ConcessionHeader />

				{/* Status Section */}
				<ConcessionStatusButton
					showAlert={showAlert}
					showConfirmation={showConfirmation}
				/>

				{/* Actions Section */}
				<View style={concessionStyles.actionsSection}>
					<Text style={concessionStyles.sectionTitle}>Manage</Text>

					<ConcessionEditDetailsButton />
				</View>

				{/* Payment Methods Section */}
				<View style={concessionStyles.paymentMethodsSection}>
					<Text style={concessionStyles.sectionTitle}>Payment Methods</Text>
					<View style={concessionStyles.paymentMethodsList}>
						{concession?.payment_methods?.map(
							(method: string, index: number) => (
								<View
									key={index}
									style={[
										concessionStyles.paymentMethodItem,
										method === 'cash' && concessionStyles.paymentMethodDefault,
									]}>
									<View style={concessionStyles.paymentMethodContent}>
										<MaterialCommunityIcons
											name={
												method === 'cash'
													? 'cash'
													: method === 'gcash'
													? 'cellphone'
													: 'credit-card'
											}
											size={22}
											color={method === 'cash' ? colors.primary : colors.text}
											style={concessionStyles.paymentMethodIcon}
										/>
										<Text
											style={[
												concessionStyles.paymentMethodText,
												method === 'cash' &&
													concessionStyles.paymentMethodDefaultText,
											]}>
											{method}
										</Text>
									</View>
									{method === 'cash' && (
										<View style={concessionStyles.defaultBadge}>
											<Text style={concessionStyles.defaultBadgeText}>
												DEFAULT
											</Text>
										</View>
									)}
								</View>
							)
						)}

						<TouchableOpacity
							style={concessionStyles.addPaymentButton}
							onPress={handleManagePaymentMethods}>
							<MaterialCommunityIcons
								name="plus-circle"
								size={20}
								color={colors.primary}
							/>
							<Text style={concessionStyles.addPaymentButtonText}>
								Manage Payment Methods
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>

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
		</View>
	)
}

export default ConcessionScreen
