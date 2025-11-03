import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../styles/customer'

interface MenuItemActionsProps {
	menuItem: any
}

const MenuItemActions: React.FC<MenuItemActionsProps> = ({ menuItem }) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)

	const handleAddToCart = () => {
		// TODO: Implement add to cart functionality
		console.log('Add to cart:', menuItem.id)
	}

	const handleOrderNow = () => {
		// TODO: Implement order now functionality
		console.log('Order now:', menuItem.id)
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
