import React from 'react'
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { useAlertModal } from '../../../../hooks/useModals'
import { AlertModal } from '../../../modals'
import { createCustomerMenuItemViewStyles } from '../../../../styles/customer'

interface MenuItemActionsProps {
	disabled: boolean
	isProcessing: boolean
	onAddToCart: () => void
	onStartOrder: () => void
	orderNowAllowed: boolean
	orderRestrictionMessage?: string | null
}

const MenuItemActions: React.FC<MenuItemActionsProps> = ({
	disabled,
	isProcessing,
	onAddToCart,
	onStartOrder,
	orderNowAllowed,
	orderRestrictionMessage,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)
	const alertModal = useAlertModal()

	const handleShowHelp = () => {
		alertModal.showAlert({
			title: 'Order Options',
			message:
				'Add to Cart: Save this item while you continue browsing.\n\nPlace Order: Choose to order now or schedule a pickup time that works for you.',
		})
	}

	const addToCartDisabled = disabled || isProcessing
	const orderActionDisabled = disabled || isProcessing

	return (
		<>
			<View style={styles.actionsContainer}>
				<TouchableOpacity
					style={styles.helpButton}
					onPress={handleShowHelp}
					accessibilityLabel="Show ordering help">
					<Ionicons
						name="help-circle-outline"
						size={24}
						color={colors.primary}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.addToCartButton,
						addToCartDisabled && styles.disabledButton,
					]}
					onPress={onAddToCart}
					disabled={addToCartDisabled}
					accessibilityLabel="Add item to cart">
					<Text
						style={[
							styles.addToCartText,
							addToCartDisabled && styles.disabledButtonText,
						]}>
						Add to Cart
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.orderNowButton,
						(orderActionDisabled || !orderNowAllowed) &&
							styles.disabledPrimaryButton,
					]}
					onPress={onStartOrder}
					disabled={orderActionDisabled}
					accessibilityLabel="Start order flow">
					{isProcessing ? (
						<ActivityIndicator
							size="small"
							color={colors.surface}
						/>
					) : (
						<Text
							style={[
								styles.orderNowText,
								(orderActionDisabled || !orderNowAllowed) &&
									styles.disabledButtonText,
							]}>
							Place Order
						</Text>
					)}
				</TouchableOpacity>
			</View>

			{!orderNowAllowed && orderRestrictionMessage ? (
				<Text style={styles.unavailableText}>{orderRestrictionMessage}</Text>
			) : null}

			<AlertModal
				visible={alertModal.visible}
				onClose={alertModal.handleClose}
				title={alertModal.title}
				message={alertModal.message}
			/>
		</>
	)
}

export default MenuItemActions
