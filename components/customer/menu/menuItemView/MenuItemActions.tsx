import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { useAlertModal } from '../../../../hooks/useModals'
import { AlertModal } from '../../../modals'
import { createCustomerMenuItemViewStyles } from '../../../../styles/customer'
import { VariationSelection, AddonSelection } from '../../../../types'

interface MenuItemActionsProps {
	menuItem: any
	variationSelections: Map<number, VariationSelection>
	addonSelections: Map<number, AddonSelection>
	totalPrice: number
	quantity: number
}

const MenuItemActions: React.FC<MenuItemActionsProps> = ({
	menuItem,
	variationSelections,
	addonSelections,
	totalPrice,
	quantity,
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

	const handleAddToCart = () => {
		// TODO: Validate required selections before adding to cart
		// TODO: Implement add to cart functionality with selections
		console.log('Add to cart:', {
			menuItemId: menuItem.id,
			menuItemName: menuItem.name,
			variationSelections: Array.from(variationSelections.values()),
			addonSelections: Array.from(addonSelections.values()).filter(
				(a) => a.selected
			),
			totalPrice,
			quantity,
		})
	}

	const handleOrderNow = () => {
		// TODO: Validate required selections before ordering
		// TODO: Implement order now functionality with selections
		console.log('Order now:', {
			menuItemId: menuItem.id,
			menuItemName: menuItem.name,
			variationSelections: Array.from(variationSelections.values()),
			addonSelections: Array.from(addonSelections.values()).filter(
				(a) => a.selected
			),
			totalPrice,
			quantity,
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

	return (
		<>
			<View style={styles.actionsContainer}>
				{/* Help button */}
				<TouchableOpacity
					style={styles.helpButton}
					onPress={handleShowHelp}>
					<Ionicons
						name="help-circle-outline"
						size={24}
						color={colors.primary}
					/>
				</TouchableOpacity>

				{/* Add to Cart button */}
				<TouchableOpacity
					style={styles.addToCartButton}
					onPress={handleAddToCart}>
					<Text style={styles.addToCartText}>Add to Cart</Text>
				</TouchableOpacity>

				{/* Order Now button */}
				<TouchableOpacity
					style={styles.orderNowButton}
					onPress={handleOrderNow}>
					<Text style={styles.orderNowText}>Order Now</Text>
				</TouchableOpacity>
			</View>

			<AlertModal
				visible={alertModal.visible}
				onClose={alertModal.hideAlert}
				title={alertModal.title}
				message={alertModal.message}
			/>
		</>
	)
}

export default MenuItemActions
