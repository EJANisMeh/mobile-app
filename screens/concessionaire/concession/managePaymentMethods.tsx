import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useThemeContext, useConcessionContext } from '../../../context'
import {
	useAlertModal,
	useConfirmationModal,
	useHideNavBar,
	useResponsiveDimensions,
} from '../../../hooks'
import { createPaymentMethodsStyles } from '../../../styles/concessionaire'
import { AlertModal, ConfirmationModal } from '../../../components/modals'
import {
	PaymentMethodsList,
	AddPaymentMethodInput,
} from '../../../components/concessionaire/concession/paymentmethods'
import { PaymentMethod, PaymentMethodTuple } from '../../../types'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'

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

	// Initialize payment methods from concession data
	// Expected format: [["cash", "Pay cash on counter", false, null], ["gcash", "09171234567", true, "screenshot"], ...]
	useEffect(() => {
		if (!concession?.payment_methods) {
			// Default to cash if no payment methods exist
			setPaymentMethods([
				{
					type: 'cash',
					details: 'Pay cash on counter',
					needsProof: false,
					proofMode: null,
					isDefaultCash: true,
				},
			])
			return
		}

		const methods = concession.payment_methods as PaymentMethodTuple[]
		const parsed: PaymentMethod[] = methods.map(
			([type, details, needsProof, proofMode], index) => ({
				type,
				details,
				needsProof: needsProof ?? false,
				proofMode: proofMode ?? null,
				// Mark the first cash method as default
				isDefaultCash: index === 0 && type.toLowerCase() === 'cash',
			})
		)

		// Ensure default cash is always first
		const defaultCashIndex = parsed.findIndex((m) => m.isDefaultCash === true)
		if (defaultCashIndex > 0) {
			const cash = parsed.splice(defaultCashIndex, 1)[0]
			parsed.unshift(cash)
		} else if (defaultCashIndex === -1) {
			// No default cash found, add it
			parsed.unshift({
				type: 'cash',
				details: 'Pay cash on counter',
				needsProof: false,
				proofMode: null,
				isDefaultCash: true,
			})
		}

		setPaymentMethods(parsed)
	}, [concession])

	useHideNavBar()

	const handleAddMethod = (method: PaymentMethod) => {
		// Check if type already exists (case-insensitive)
		const exists = paymentMethods.some(
			(m) => m.type.toLowerCase() === method.type.toLowerCase()
		)

		if (exists) {
			showAlert({
				title: 'Already Added',
				message: `${method.type} is already in your payment methods`,
			})
			return
		}

		setPaymentMethods([...paymentMethods, method])
	}

	const handleUpdateMethod = (index: number, method: PaymentMethod) => {
		const updated = [...paymentMethods]
		updated[index] = method
		setPaymentMethods(updated)
	}

	const handleRemoveMethod = (index: number) => {
		const method = paymentMethods[index]

		// Prevent removing default cash
		if (method.isDefaultCash === true) {
			showAlert({
				title: 'Cannot Remove',
				message: 'Cash is the default payment method and cannot be removed',
			})
			return
		}

		showConfirmation({
			title: 'Remove Payment Method',
			message: `Are you sure you want to remove ${method.type}?`,
			confirmText: 'Remove',
			cancelText: 'Cancel',
			confirmStyle: 'destructive',
			onConfirm: () => {
				setPaymentMethods(paymentMethods.filter((_, i) => i !== index))
			},
		})
	}

	const handleSave = async () => {
		// Validation: Ensure default cash is always present
		if (!paymentMethods.some((m) => m.isDefaultCash === true)) {
			showAlert({
				title: 'Validation Error',
				message: 'Cash payment method must be included',
			})
			return
		}

		// Validate all methods have type and details
		const invalidMethods = paymentMethods.filter(
			(m) => !m.type.trim() || !m.details.trim()
		)

		if (invalidMethods.length > 0) {
			showAlert({
				title: 'Missing Information',
				message: 'All payment methods must have both type and details filled',
			})
			return
		}

		// Validate proof mode when proof is needed
		const invalidProofMethods = paymentMethods.filter(
			(m) => m.needsProof && !m.proofMode
		)

		if (invalidProofMethods.length > 0) {
			showAlert({
				title: 'Missing Information',
				message:
					'Please select a proof of payment mode (Text or Screenshot) for all methods that require proof',
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
			// Convert to tuple format for backend
			const methodTuples: PaymentMethodTuple[] = paymentMethods.map((m) => [
				m.type,
				m.details,
				m.needsProof,
				m.proofMode,
			])

			const result = await updateConcession(concession.id, {
				payment_methods: methodTuples,
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
		<DynamicKeyboardView>
			<DynamicScrollView
				style={styles.container}
				autoCenter={false}
				showsVerticalScrollIndicator={true}
				contentContainerStyle={{ paddingBottom: 100 }}>
				{/* Info Section */}
				<View style={styles.infoSection}>
					<Text style={styles.infoText}>
						Manage your concession's accepted payment methods. Add custom
						payment types with their details.
					</Text>
				</View>

				{/* Payment Methods List */}
				<View style={styles.methodsSection}>
					<Text style={styles.sectionTitle}>Active Payment Methods</Text>

					<PaymentMethodsList
						paymentMethods={paymentMethods}
						onUpdateMethod={handleUpdateMethod}
						onRemoveMethod={handleRemoveMethod}
					/>

					{/* Add Method Input */}
					<AddPaymentMethodInput
						onAdd={handleAddMethod}
						existingTypes={paymentMethods.map((m) => m.type)}
					/>
				</View>
			</DynamicScrollView>

			{/* Action Buttons - Fixed at bottom */}
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
						<Text style={styles.saveButtonText}>Save Changes</Text>
					)}
				</TouchableOpacity>
			</View>

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
		</DynamicKeyboardView>
	)
}

export default ManagePaymentMethodsScreen
