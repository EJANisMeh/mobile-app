import React from 'react'
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { useAlertModal } from '../../../../hooks/useModals'
import { AlertModal } from '../../../modals'
import { createCustomerMenuItemViewStyles } from '../../../../styles/customer'

interface MenuItemActionsProps {
	menuItem: any
	disabled: boolean
	isProcessing: boolean
	onAddToCart: () => void
	onOrderNow: () => void
}

const MenuItemActions: React.FC<MenuItemActionsProps> = ({
	menuItem,
	disabled,
	isProcessing,
	onAddToCart,
	onOrderNow,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)
	const alertModal = useAlertModal()

	const handleShowHelp = () => {
		alertModal.showAlert({
			title: 'Order Options',
			message:
				'Add to Cart: Add this item to your cart to continue shopping and add more items before placing your order.\n\nOrder Now: Place an order immediately with just this item.',
		})
	}

	if (!menuItem.availability) {
		return (
			<View style={styles.actionsContainer}>
				<View style={styles.unavailableContainer}>
					<Text style={styles.unavailableText}>Currently Unavailable</Text>
				</View>
			</View>
		)
	}

	const addToCartDisabled = disabled || isProcessing
	const orderNowDisabled = disabled || isProcessing

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
						orderNowDisabled && styles.disabledPrimaryButton,
					]}
					onPress={onOrderNow}
					disabled={orderNowDisabled}
					accessibilityLabel="Place order now">
					{isProcessing ? (
						<ActivityIndicator
							size="small"
							color={colors.surface}
						/>
					) : (
						<Text
							style={[
								styles.orderNowText,
								orderNowDisabled && styles.disabledButtonText,
							]}>
							Order Now
						</Text>
					)}
				</TouchableOpacity>
			</View>

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
