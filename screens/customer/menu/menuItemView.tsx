import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions, useHideNavBar } from '../../../hooks'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'
import { createCustomerMenuItemViewStyles } from '../../../styles/customer'
import {
	CustomerStackParamList,
	VariationSelection,
	AddonSelection,
	PriceCalculation,
} from '../../../types'
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

	// Selection state
	const [variationSelections, setVariationSelections] = useState<
		Map<number, VariationSelection>
	>(new Map())
	const [addonSelections, setAddonSelections] = useState<
		Map<number, AddonSelection>
	>(new Map())
	const [quantity, setQuantity] = useState(1)

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
				initializeSelections(result.item)
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

	// Initialize selection state
	const initializeSelections = (item: any) => {
		const varSelections = new Map<number, VariationSelection>()
		const addSelections = new Map<number, AddonSelection>()

		// Initialize variation selections
		if (item.menu_item_variation_groups) {
			item.menu_item_variation_groups.forEach((group: any) => {
				varSelections.set(group.id, {
					groupId: group.id,
					groupName: group.name,
					selectionTypeCode: group.selection_types.code,
					multiLimit: group.multiLimit,
					selectedOptions: [],
				})
			})
		}

		// Initialize addon selections
		if (item.menu_item_addons_menu_item_addons_menu_item_idTomenu_items) {
			item.menu_item_addons_menu_item_addons_menu_item_idTomenu_items.forEach(
				(addon: any) => {
					const targetItem =
						addon.menu_items_menu_item_addons_target_menu_item_idTomenu_items
					const displayName = addon.label || targetItem?.name || 'Unknown'
					const displayPrice =
						addon.price_override ?? targetItem?.basePrice ?? 0

					addSelections.set(addon.id, {
						addonId: addon.id,
						addonName: displayName,
						price: parseFloat(displayPrice),
						selected: addon.required, // Auto-select required addons
					})
				}
			)
		}

		setVariationSelections(varSelections)
		setAddonSelections(addSelections)
	}

	// Calculate total price based on selections
	const priceCalculation: PriceCalculation = useMemo(() => {
		if (!menuItem) {
			return {
				basePrice: 0,
				variationAdjustments: 0,
				addonsTotal: 0,
				totalPrice: 0,
			}
		}

		const basePrice = parseFloat(menuItem.basePrice)

		// Sum variation price adjustments
		let variationAdjustments = 0
		variationSelections.forEach((selection) => {
			selection.selectedOptions.forEach((option) => {
				variationAdjustments += option.priceAdjustment
			})
		})

		// Sum addon prices
		let addonsTotal = 0
		addonSelections.forEach((addon) => {
			if (addon.selected) {
				addonsTotal += addon.price
			}
		})

		const totalPrice = basePrice + variationAdjustments + addonsTotal

		return {
			basePrice,
			variationAdjustments,
			addonsTotal,
			totalPrice,
		}
	}, [menuItem, variationSelections, addonSelections])

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

				{/* Description */}
				{menuItem.description && (
					<MenuItemInfo
						menuItem={menuItem}
						showPrice={false}
					/>
				)}

				{/* Price and Quantity */}
				<MenuItemInfo
					menuItem={menuItem}
					totalPrice={priceCalculation.totalPrice}
					quantity={quantity}
					setQuantity={setQuantity}
					showPrice={true}
				/>

				{/* Variations Section */}
				{menuItem.menu_item_variation_groups &&
					menuItem.menu_item_variation_groups.length > 0 && (
						<MenuItemVariations
							variationGroups={menuItem.menu_item_variation_groups}
							variationSelections={variationSelections}
							setVariationSelections={setVariationSelections}
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
							addonSelections={addonSelections}
							setAddonSelections={setAddonSelections}
						/>
					)}

				{/* Bottom Actions: Add to Cart / Order Now */}
				<MenuItemActions
					menuItem={menuItem}
					variationSelections={variationSelections}
					addonSelections={addonSelections}
					totalPrice={priceCalculation.totalPrice}
					quantity={quantity}
				/>
			</DynamicScrollView>
		</DynamicKeyboardView>
	)
}

export default MenuItemViewScreen
