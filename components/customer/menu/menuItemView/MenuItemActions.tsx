import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../styles/customer'
import { VariationSelection, AddonSelection } from '../../../../types'

interface MenuItemActionsProps {
	menuItem: any
	variationSelections: Map<number, VariationSelection>
	addonSelections: Map<number, AddonSelection>
	totalPrice: number
}

const MenuItemActions: React.FC<MenuItemActionsProps> = ({
	menuItem,
	variationSelections,
	addonSelections,
	totalPrice,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)

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
		<View style={styles.actionsContainer}>
			<TouchableOpacity
				style={styles.addToCartButton}
				onPress={handleAddToCart}>
				<Text style={styles.addToCartText}>Add to Cart</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.orderNowButton}
				onPress={handleOrderNow}>
				<Text style={styles.orderNowText}>Order Now</Text>
			</TouchableOpacity>
		</View>
	)
}

export default MenuItemActions
