import React, { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions, useHideNavBar } from '../../../hooks'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'
import { createCustomerMenuItemViewStyles } from '../../../styles/customer'
import { CustomerStackParamList } from '../../../types'
import { menuApi } from '../../../services/api'
import {
	MenuItemHeader,
	MenuItemImages,
	MenuItemInfo,
	MenuItemVariations,
	MenuItemAddons,
	MenuItemActions,
} from '../../../components/customer/menu/menuItemView'

type MenuItemViewRouteProp = RouteProp<CustomerStackParamList, 'MenuItemView'>

const MenuItemViewScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)
	const route = useRoute<MenuItemViewRouteProp>()

	const [menuItem, setMenuItem] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const menuItemId = route.params.menuItemId

	useHideNavBar()

	// Load menu item data
	useEffect(() => {
		loadMenuItem()
	}, [menuItemId])

	const loadMenuItem = async () => {
		setLoading(true)
		setError(null)
		try {
			const result = await menuApi.getMenuItemById(menuItemId)
			if (result.success && result.item) {
				setMenuItem(result.item)
			} else {
				setError(result.error || 'Failed to load menu item')
			}
		} catch (err) {
			setError('Failed to load menu item')
			console.error('Error loading menu item:', err)
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
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

	if (error || !menuItem) {
		return (
			<DynamicKeyboardView>
				<DynamicScrollView
					autoCenter="center"
					fallbackAlign="center">
					<View>
						<Text style={styles.itemName}>Error</Text>
						<Text style={styles.description}>
							{error || 'Menu item not found'}
						</Text>
					</View>
				</DynamicScrollView>
			</DynamicKeyboardView>
		)
	}

	return (
		<DynamicKeyboardView>
			<DynamicScrollView showsVerticalScrollIndicator={false}>
				{/* Header: Name and Categories */}
				<MenuItemHeader menuItem={menuItem} />

				{/* Images Carousel */}
				{menuItem.images && menuItem.images.length > 0 && (
					<MenuItemImages images={menuItem.images} />
				)}

				{/* Basic Info: Description and Base Price */}
				<MenuItemInfo menuItem={menuItem} />

				{/* Variations Section */}
				{menuItem.menu_item_variation_groups &&
					menuItem.menu_item_variation_groups.length > 0 && (
						<MenuItemVariations
							variationGroups={menuItem.menu_item_variation_groups}
						/>
					)}

				{/* Add-ons Section */}
				{menuItem.menu_item_addons_menu_item_addons_menu_item_idTomenu_items &&
					menuItem.menu_item_addons_menu_item_addons_menu_item_idTomenu_items
						.length > 0 && (
						<MenuItemAddons
							addons={
								menuItem.menu_item_addons_menu_item_addons_menu_item_idTomenu_items
							}
						/>
					)}
			</DynamicScrollView>

			{/* Bottom Actions: Add to Cart / Order Now */}
			<MenuItemActions menuItem={menuItem} />
		</DynamicKeyboardView>
	)
}

export default MenuItemViewScreen
