import React, { Dispatch, SetStateAction } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import type { ImageSourcePropType } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../styles/customer'
import { AddonSelection } from '../../../../types'
import {
	normalizeMenuItemSchedule,
	getMenuItemAvailabilityStatus,
} from '../../../../utils'

const DEFAULT_MENU_IMAGE: ImageSourcePropType = require('../../../../assets/icon.png')

interface MenuItemAddonsProps {
	addons: any[]
	addonSelections: Map<number, AddonSelection>
	setAddonSelections: Dispatch<SetStateAction<Map<number, AddonSelection>>>
}

const MenuItemAddons: React.FC<MenuItemAddonsProps> = ({
	addons,
	addonSelections,
	setAddonSelections,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)

	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price
		return `₱${numPrice.toFixed(2)}`
	}

	const getAddonStatusText = (addon: any): string | null => {
		const targetItem =
			addon.menu_items_menu_item_addons_target_menu_item_idTomenu_items

		if (!targetItem) return null

		// Check availability field (out of stock toggle)
		if (targetItem.availability === false) {
			return 'Out of stock'
		}

		// Check if addon target item is available today based on schedule
		if (targetItem.availabilitySchedule) {
			const normalizedSchedule = normalizeMenuItemSchedule(
				targetItem.availabilitySchedule
			)
			const status = getMenuItemAvailabilityStatus(
				normalizedSchedule,
				targetItem.availability ?? true
			)

			if (status === 'not_served_today') {
				return 'Not available today'
			}
		}

		return null
	}

	const handleAddonToggle = (addonId: number) => {
		setAddonSelections((prev) => {
			const newMap = new Map(prev)
			const addon = newMap.get(addonId)

			if (addon) {
				addon.selected = !addon.selected
				newMap.set(addonId, addon)
			}

			return newMap
		})
	}

	const renderAddonItem = (addon: any, isRequired: boolean) => {
		const targetItem =
			addon.menu_items_menu_item_addons_target_menu_item_idTomenu_items
		const displayName = addon.label || targetItem?.name || 'Unknown'
		const displayPrice = addon.price_override ?? targetItem?.basePrice ?? 0
		const statusText = getAddonStatusText(addon)

		const selection = addonSelections.get(addon.id)
		const isSelected = selection?.selected || false

		if (isRequired) {
			// Required addons: Display only, no interaction
			return (
				<View
					key={addon.id}
					style={styles.addonItem}>
					{/* Item image */}
					<Image
						source={
							targetItem?.images &&
							targetItem.images.length > 0 &&
							targetItem.images[targetItem.display_image_index ?? 0]
								? {
										uri: targetItem.images[targetItem.display_image_index ?? 0],
								  }
								: DEFAULT_MENU_IMAGE
						}
						style={styles.addonItemImage}
						resizeMode="cover"
					/>
					<View style={styles.addonInfo}>
						<View style={{ flex: 1 }}>
							<Text style={styles.addonName}>{displayName}</Text>
							{statusText && (
								<Text style={styles.outOfStockText}>{statusText}</Text>
							)}
						</View>
						<Text style={styles.requiredBadge}>Required</Text>
					</View>
					<Text style={styles.addonPrice}>{formatPrice(displayPrice)}</Text>
				</View>
			)
		} else {
			// Optional addons: Radio button with toggle
			return (
				<TouchableOpacity
					key={addon.id}
					style={[
						styles.addonItemButton,
						isSelected && styles.addonItemSelected,
					]}
					onPress={() => handleAddonToggle(addon.id)}>
					{/* Item image */}
					<Image
						source={
							targetItem?.images &&
							targetItem.images.length > 0 &&
							targetItem.images[targetItem.display_image_index ?? 0]
								? {
										uri: targetItem.images[targetItem.display_image_index ?? 0],
								  }
								: DEFAULT_MENU_IMAGE
						}
						style={styles.addonItemImage}
						resizeMode="cover"
					/>
					<View style={styles.radioButton}>
						{isSelected && <View style={styles.radioButtonInner} />}
					</View>
					<View style={styles.addonContent}>
						<View style={{ flex: 1 }}>
							<Text style={styles.addonName}>{displayName}</Text>
							{statusText && (
								<Text style={styles.outOfStockText}>{statusText}</Text>
							)}
						</View>
						<Text style={styles.addonPrice}>{formatPrice(displayPrice)}</Text>
					</View>
				</TouchableOpacity>
			)
		}
	}

	return (
		<View style={styles.addonsContainer}>
			<Text style={styles.sectionTitle}>Add-ons</Text>
			<View style={styles.addonsList}>
				{addons.map((addon) => renderAddonItem(addon, addon.required))}
			</View>
		</View>
	)
}

export default MenuItemAddons
