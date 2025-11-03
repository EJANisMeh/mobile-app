import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../styles/customer'

interface MenuItemAddonsProps {
	addons: any[]
}

const MenuItemAddons: React.FC<MenuItemAddonsProps> = ({ addons }) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)

	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price
		return `₱${numPrice.toFixed(2)}`
	}

	return (
		<View style={styles.addonsContainer}>
			<Text style={styles.sectionTitle}>Add-ons</Text>
			{addons.map((addon) => {
				const targetItem =
					addon.menu_items_menu_item_addons_target_menu_item_idTomenu_items
				const displayName = addon.label || targetItem?.name || 'Unknown'
				const displayPrice = addon.price_override ?? targetItem?.basePrice ?? 0

				return (
					<View
						key={addon.id}
						style={styles.addonItem}>
						<View style={styles.addonInfo}>
							<Text style={styles.addonName}>{displayName}</Text>
							{addon.required && (
								<Text style={styles.requiredBadge}>Required</Text>
							)}
						</View>
						<Text style={styles.addonPrice}>{formatPrice(displayPrice)}</Text>
					</View>
				)
			})}
		</View>
	)
}

export default MenuItemAddons
