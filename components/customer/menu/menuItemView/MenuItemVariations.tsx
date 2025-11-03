import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../styles/customer'

interface MenuItemVariationsProps {
	variationGroups: any[]
}

const MenuItemVariations: React.FC<MenuItemVariationsProps> = ({
	variationGroups,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)

	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price
		if (numPrice === 0) return ''
		return numPrice > 0
			? `+₱${numPrice.toFixed(2)}`
			: `-₱${Math.abs(numPrice).toFixed(2)}`
	}

	return (
		<View style={styles.variationsContainer}>
			<Text style={styles.sectionTitle}>Variations</Text>
			{variationGroups.map((group) => (
				<View
					key={group.id}
					style={styles.variationGroup}>
					<Text style={styles.variationGroupName}>{group.name}</Text>

					{/* Custom options */}
					{group.menu_item_variation_option_choices &&
						group.menu_item_variation_option_choices.length > 0 && (
							<View style={styles.optionsList}>
								{group.menu_item_variation_option_choices.map((option: any) => (
									<View
										key={option.id}
										style={styles.optionItem}>
										<Text style={styles.optionName}>{option.name}</Text>
										{option.price_adjustment !== 0 && (
											<Text style={styles.optionPrice}>
												{formatPrice(option.price_adjustment)}
											</Text>
										)}
									</View>
								))}
							</View>
						)}
				</View>
			))}
		</View>
	)
}

export default MenuItemVariations
