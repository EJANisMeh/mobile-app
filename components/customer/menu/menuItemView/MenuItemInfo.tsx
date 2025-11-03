import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../styles/customer'

interface MenuItemInfoProps {
	menuItem: any
}

const MenuItemInfo: React.FC<MenuItemInfoProps> = ({ menuItem }) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)

	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price
		return `₱${numPrice.toFixed(2)}`
	}

	return (
		<View style={styles.infoContainer}>
			{/* Base Price */}
			<View style={styles.priceSection}>
				<Text style={styles.priceLabel}>Base Price</Text>
				<Text style={styles.basePrice}>{formatPrice(menuItem.basePrice)}</Text>
			</View>

			{/* Description */}
			{menuItem.description && (
				<View style={styles.descriptionSection}>
					<Text style={styles.descriptionLabel}>Description</Text>
					<Text style={styles.description}>{menuItem.description}</Text>
				</View>
			)}
		</View>
	)
}

export default MenuItemInfo
