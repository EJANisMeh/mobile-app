import React, { useState, useEffect } from 'react'
import {
	View,
	Text,
	TextInput,
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
import {
	useAlertModal,
	useConfirmationModal,
	useHideNavBar,
	useResponsiveDimensions,
} from '../../../hooks'
import { createPaymentMethodsStyles } from '../../../styles/concessionaire'
import { AlertModal, ConfirmationModal } from '../../../components/modals'
import DynamicScrollView from '../../../components/DynamicScrollView'

interface PaymentMethod {
	type: string // 'cash', 'gcash', 'paymaya'
	details: string
}

const PAYMENT_METHOD_INFO: Record<
	string,
	{ label: string; icon: string; placeholder: string }
> = {
	cash: {
		label: 'Cash',
		icon: 'cash',
		placeholder: 'Pay cash on counter',
	},
	gcash: {
		label: 'GCash',
		icon: 'cellphone',
		placeholder: 'Enter GCash number (e.g., 09171234567)',
	},
	paymaya: {
		label: 'PayMaya',
		icon: 'wallet',
		placeholder: 'Enter PayMaya number (e.g., 09171234567)',
	},
}

const ManagePaymentMethodsScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const { concession, loading, updateConcession } = useConcessionContext()
	const navigation = useNavigation()
	const styles = createPaymentMethodsStyles(colors, responsive)

	const { visible, title, message, showAlert, hideAlert } = useAlertModal()
	const {
		visible: confirmVisible,
		props: confirmProps,
		showConfirmation,
		hideConfirmation,
	} = useConfirmationModal()

	const [isSaving, setIsSaving] = useState(false)
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
	const [showAddOptions, setShowAddOptions] = useState(false)

	// Initialize payment methods from concession data.
	// Ensure 'cash' is always present as the default method.
	useEffect(() => {
		const existing: PaymentMethod[] = Array.isArray(concession?.payment_methods)
			? concession!.payment_methods.map((method: string) => ({
					type: method.toLowerCase(),
					details:
						method.toLowerCase() === 'cash'
							? 'Pay cash on counter'
							: `Enter ${method} details`,
			  }))
			: []

		// If cash is not present, add it as the first/default method
		if (!existing.some((m) => m.type === 'cash')) {
			existing.unshift({ type: 'cash', details: 'Pay cash on counter' })
		}

		setPaymentMethods(existing)
	}, [concession])

	useHideNavBar()

	const handleAddMethod = (type: string) => {
		// Check if method already exists
		if (paymentMethods.some((m) => m.type === type)) {
			showAlert({
				title: 'Already Added',
				message: `${PAYMENT_METHOD_INFO[type].label} is already in your payment methods`,
			})
			return
		}

		const newMethod: PaymentMethod = {
			type,
			details: type === 'cash' ? 'Pay cash on counter' : '',
		}

		setPaymentMethods([...paymentMethods, newMethod])
		setShowAddOptions(false)
	}

	const handleRemoveMethod = (index: number) => {
		const method = paymentMethods[index]

		// Prevent removing cash if it's the only method
		if (method.type === 'cash' && paymentMethods.length === 1) {
			showAlert({
				title: 'Cannot Remove',
				message: 'Cash is the default payment method and must remain available',
			})
			return
		}

		showConfirmation({
			title: 'Remove Payment Method',
			message: `Are you sure you want to remove ${
				PAYMENT_METHOD_INFO[method.type].label
			}?`,
			confirmText: 'Yes',
			cancelText: 'No',
			onConfirm: () => {
				setPaymentMethods(paymentMethods.filter((_, i) => i !== index))
			},
		})
	}

	const handleUpdateDetails = (index: number, details: string) => {
		const updated = [...paymentMethods]
		updated[index].details = details
		setPaymentMethods(updated)
	}

	const handleSave = async () => {
		// Validation: Ensure cash is always present
		if (!paymentMethods.some((m) => m.type === 'cash')) {
			showAlert({
				title: 'Validation Error',
				message: 'Cash payment method must be included',
			})
			return
		}

		// Validate non-cash methods have details
		const invalidMethods = paymentMethods.filter(
			(m) => m.type !== 'cash' && !m.details.trim()
		)

		if (invalidMethods.length > 0) {
			showAlert({
				title: 'Missing Details',
				message: 'Please provide details for all payment methods',
			})
			return
		}

		if (!concession?.id) {
			showAlert({
				title: 'Error',
				message: 'No concession found',
			})
			return
		}

		setIsSaving(true)

		try {
			// Extract just the method types for backend
			const methodTypes = paymentMethods.map((m) => m.type)

			const result = await updateConcession(concession.id, {
				payment_methods: methodTypes,
			})

			if (result.success) {
				showAlert({
					title: 'Success',
					message: 'Payment methods updated successfully',
				})
				setTimeout(() => {
					navigation.goBack()
				}, 1500)
			} else {
				showAlert({
					title: 'Error',
					message: result.error || 'Failed to update payment methods',
				})
			}
		} catch (err) {
			showAlert({
				title: 'Error',
				message:
					err instanceof Error ? err.message : 'An unexpected error occurred',
			})
		} finally {
			setIsSaving(false)
		}
	}

	const handleCancel = () => {
		navigation.goBack()
	}

	// Loading state
	if (loading && !concession) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator
					size="large"
					color={colors.primary}
				/>
				<Text style={styles.loadingText}>Loading...</Text>
			</View>
		)
	}

	return (
		<>
			<DynamicScrollView
				styles={styles.container}
				autoCenter={false}
				showsVerticalScrollIndicator={true}>
				<View style={styles.scrollContent}>
					{/* Info Section */}
					<View style={styles.infoSection}>
						<Text style={styles.infoText}>
							Manage your concession's accepted payment methods.
						</Text>
					</View>

					{/* Payment Methods List */}
					<View style={styles.methodsSection}>
						<Text style={styles.sectionTitle}>Active Payment Methods</Text>

						{paymentMethods.map((method, index) => (
							<View
								key={index}
								style={styles.methodCard}>
								<View style={styles.methodHeader}>
									<View style={styles.methodTitleRow}>
										<MaterialCommunityIcons
											name={PAYMENT_METHOD_INFO[method.type].icon as any}
											size={24}
											color={colors.primary}
											style={styles.methodIcon}
										/>
										<Text style={styles.methodTitle}>
											{PAYMENT_METHOD_INFO[method.type].label}
										</Text>
										{method.type === 'cash' && (
											<View style={styles.defaultBadge}>
												<Text style={styles.defaultBadgeText}>DEFAULT</Text>
											</View>
										)}
									</View>

									{method.type !== 'cash' && (
										<TouchableOpacity
											style={styles.removeButton}
											onPress={() => handleRemoveMethod(index)}>
											<MaterialCommunityIcons
												name="close-circle"
												size={24}
												color="#dc3545"
											/>
										</TouchableOpacity>
									)}
								</View>

								<TextInput
									style={[
										styles.detailsInput,
										method.type === 'cash' && styles.detailsInputReadonly,
									]}
									placeholder={PAYMENT_METHOD_INFO[method.type].placeholder}
									placeholderTextColor={colors.placeholder}
									value={method.details}
									onChangeText={(text) => handleUpdateDetails(index, text)}
									editable={method.type !== 'cash'}
									multiline={method.type === 'cash'}
								/>
							</View>
						))}

						{/* Add Method Button */}
						<TouchableOpacity
							style={styles.addButton}
							onPress={() => setShowAddOptions(!showAddOptions)}>
							<MaterialCommunityIcons
								name={showAddOptions ? 'minus-circle' : 'plus-circle'}
								size={24}
								color={colors.primary}
							/>
							<Text style={styles.addButtonText}>
								{showAddOptions ? 'Hide Options' : 'Add Payment Method'}
							</Text>
						</TouchableOpacity>

						{/* Add Options */}
						{showAddOptions && (
							<View style={styles.addOptionsContainer}>
								{Object.entries(PAYMENT_METHOD_INFO).map(([type, info]) => (
									<TouchableOpacity
										key={type}
										style={[
											styles.addOptionButton,
											paymentMethods.some((m) => m.type === type) &&
												styles.addOptionButtonDisabled,
										]}
										onPress={() => handleAddMethod(type)}
										disabled={paymentMethods.some((m) => m.type === type)}>
										<MaterialCommunityIcons
											name={info.icon as any}
											size={20}
											color={
												paymentMethods.some((m) => m.type === type)
													? colors.placeholder
													: colors.primary
											}
											style={styles.optionIcon}
										/>
										<Text
											style={[
												styles.addOptionText,
												paymentMethods.some((m) => m.type === type) &&
													styles.addOptionTextDisabled,
											]}>
											{info.label}
										</Text>
										{paymentMethods.some((m) => m.type === type) && (
											<Text style={styles.addedLabel}>Added</Text>
										)}
									</TouchableOpacity>
								))}
							</View>
						)}
					</View>

					{/* Action Buttons */}
					<View style={styles.actionButtonsContainer}>
						<TouchableOpacity
							style={styles.cancelButton}
							onPress={handleCancel}
							disabled={isSaving}>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
							onPress={handleSave}
							disabled={isSaving}>
							{isSaving ? (
								<ActivityIndicator
									size="small"
									color="#fff"
								/>
							) : (
								<>
									<MaterialCommunityIcons
										name="content-save"
										size={20}
										color="#fff"
										style={styles.saveButtonIcon}
									/>
									<Text style={styles.saveButtonText}>Save Changes</Text>
								</>
							)}
						</TouchableOpacity>
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
				onConfirm={() => {
					confirmProps.onConfirm()
					hideConfirmation()
				}}
				onCancel={() => hideConfirmation()}
			/>
		</>
	)
}

export default ManagePaymentMethodsScreen
