import React, { useEffect, useState } from 'react'
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import {
	useThemeContext,
	useConcessionContext,
	useAuthContext,
} from '../../../context'
import { useAlertModal, useConfirmationModal } from '../../../hooks'
import { createConcessionStyles } from '../../../styles/themedStyles'
import { AlertModal, ConfirmationModal } from '../../../components/modals'

const ConcessionScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const { user } = useAuthContext()
	const { concession, loading, error, getConcession, toggleConcessionStatus } =
		useConcessionContext()
	const navigation = useNavigation()
	const styles = createConcessionStyles(colors)

	const { visible, title, message, showAlert, hideAlert, handleClose } =
		useAlertModal()

	const {
		visible: confirmVisible,
		props: confirmProps,
		showConfirmation,
		hideConfirmation,
	} = useConfirmationModal()

	const [isTogglingStatus, setIsTogglingStatus] = useState<boolean>(false)
	const [descExpanded, setDescExpanded] = useState(false)
	const DESC_COLLAPSE_LENGTH = 240

	// Load concession data on mount or when concession_id changes
	useEffect(() => {
		if (user?.concession_id) {
			getConcession(user.concession_id)
		}
	}, [user?.concession_id])

	// Handle status toggle with confirmation
	const handleStatusToggle = () => {
		if (!concession) return

		const action = async () => {
			setIsTogglingStatus(true)

			try {
				const result = await toggleConcessionStatus(concession.id)

				if (!result.success && !result.Success) {
					showAlert({
						title: 'Error',
						message: result.error || error || 'Failed to update status',
					})
					return
				}

				const newStatus = !concession.is_open

				showAlert({
					title: 'Success',
					message:
						(result.message as string) ||
						`Concession is now ${newStatus ? 'open' : 'closed'}`,
				})
			} catch (err) {
				showAlert({
					title: 'Error',
					message:
						err instanceof Error ? err.message : 'An unexpected error occurred',
				})
			} finally {
				setIsTogglingStatus(false)
			}
		}

		// Prompt user for confirmation before performing the action
		showConfirmation({
			title: 'Confirm status change',
			message: `Are you sure you want to ${
				concession.is_open ? 'close' : 'open'
			} the concession?`,
			onConfirm: action,
		})
	}

	const handleEditDetails = () => {
		navigation.navigate('EditConcessionDetails' as never)
	}

	const handleManagePaymentMethods = () => {
		navigation.navigate('ManagePaymentMethods' as never)
	}

	// Loading state
	if (loading && !concession) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator
					size="large"
					color={colors.primary}
				/>
				<Text style={styles.loadingText}>Loading concession...</Text>
			</View>
		)
	}

	// No concession assigned
	if (!concession && !loading) {
		return (
			<View style={styles.loadingContainer}>
				<MaterialCommunityIcons
					name="store-off"
					size={64}
					color={colors.placeholder}
				/>
				<Text style={styles.loadingText}>
					No concession assigned to your account
				</Text>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}>
				{/* Header Section */}
				<View style={styles.headerSection}>
					<Text style={styles.concessionName}>{concession?.name}</Text>
					{concession?.description ? (
						<>
							<Text
								style={styles.concessionDescription}
								numberOfLines={descExpanded ? undefined : 4}>
								{concession.description}
							</Text>
							{concession.description.length > DESC_COLLAPSE_LENGTH && (
								<TouchableOpacity onPress={() => setDescExpanded((s) => !s)}>
									<Text style={styles.showMoreText}>
										{descExpanded ? 'Show less' : 'Show more'}
									</Text>
								</TouchableOpacity>
							)}
						</>
					) : (
						<Text style={styles.noDescription}>No description available</Text>
					)}
				</View>

				{/* Status Section */}
				<View style={styles.statusSection}>
					<Text style={styles.sectionTitle}>Status</Text>
					<TouchableOpacity
						style={[
							styles.statusButton,
							concession?.is_open
								? styles.statusButtonOpen
								: styles.statusButtonClosed,
						]}
						onPress={handleStatusToggle}
						disabled={isTogglingStatus}>
						<View style={styles.statusButtonContent}>
							<MaterialCommunityIcons
								name={concession?.is_open ? 'store-check' : 'store-off'}
								size={28}
								color={concession?.is_open ? '#2e7d32' : '#c62828'}
								style={styles.statusIcon}
							/>
							<Text
								style={[
									styles.statusText,
									concession?.is_open
										? styles.statusTextOpen
										: styles.statusTextClosed,
								]}>
								{concession?.is_open ? 'Open' : 'Closed'}
							</Text>
						</View>
						<Text style={styles.statusToggleText}>Tap to toggle</Text>
					</TouchableOpacity>
				</View>

				{/* Actions Section */}
				<View style={styles.actionsSection}>
					<Text style={styles.sectionTitle}>Manage</Text>

					<TouchableOpacity
						style={styles.actionButton}
						onPress={handleEditDetails}>
						<MaterialCommunityIcons
							name="store-edit"
							size={24}
							color={colors.primary}
							style={styles.actionIcon}
						/>
						<Text style={styles.actionText}>Edit Details</Text>
						<MaterialCommunityIcons
							name="chevron-right"
							size={24}
							color={colors.placeholder}
							style={styles.actionArrow}
						/>
					</TouchableOpacity>
				</View>

				{/* Payment Methods Section */}
				<View style={styles.paymentMethodsSection}>
					<Text style={styles.sectionTitle}>Payment Methods</Text>
					<View style={styles.paymentMethodsList}>
						{concession?.payment_methods?.map(
							(method: string, index: number) => (
								<View
									key={index}
									style={[
										styles.paymentMethodItem,
										method === 'cash' && styles.paymentMethodDefault,
									]}>
									<View style={styles.paymentMethodContent}>
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
											style={styles.paymentMethodIcon}
										/>
										<Text
											style={[
												styles.paymentMethodText,
												method === 'cash' && styles.paymentMethodDefaultText,
											]}>
											{method}
										</Text>
									</View>
									{method === 'cash' && (
										<View style={styles.defaultBadge}>
											<Text style={styles.defaultBadgeText}>DEFAULT</Text>
										</View>
									)}
								</View>
							)
						)}

						<TouchableOpacity
							style={styles.addPaymentButton}
							onPress={handleManagePaymentMethods}>
							<MaterialCommunityIcons
								name="plus-circle"
								size={20}
								color={colors.primary}
							/>
							<Text style={styles.addPaymentButtonText}>
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
