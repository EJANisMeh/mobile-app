import React, { Dispatch, SetStateAction } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../styles/customer'
import { AddonSelection } from '../../../../types'

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

		const selection = addonSelections.get(addon.id)
		const isSelected = selection?.selected || false

		if (isRequired) {
			// Required addons: Display only, no interaction
			return (
				<View
					key={addon.id}
					style={styles.addonItem}>
					<View style={styles.addonInfo}>
						<Text style={styles.addonName}>{displayName}</Text>
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
					<View style={styles.radioButton}>
						{isSelected && <View style={styles.radioButtonInner} />}
					</View>
					<View style={styles.addonContent}>
						<Text style={styles.addonName}>{displayName}</Text>
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
