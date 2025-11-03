import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../styles/customer'

interface MenuItemHeaderProps {
	menuItem: any
}

const MenuItemHeader: React.FC<MenuItemHeaderProps> = ({ menuItem }) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)

	// Extract category names from junction table
	const categoryNames =
		menuItem.menu_item_category_links
			?.map((link: any) => link.category?.name)
			.filter(Boolean)
			.join(', ') || 'Uncategorized'

	return (
		<View style={styles.headerContainer}>
			<Text style={styles.itemName}>{menuItem.name}</Text>
			<Text style={styles.categories}>{categoryNames}</Text>
		</View>
	)
}

export default MenuItemHeader
