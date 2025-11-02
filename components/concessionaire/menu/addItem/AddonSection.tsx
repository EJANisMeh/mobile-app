import React from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext, useMenuContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionaireAddMenuItemStyles } from '../../../../styles/concessionaire/addMenuItem'
import {
	AddMenuItemFormData,
	AddonInput,
} from '../../../../types/menuItemTypes'
import {
	UseAlertModalType,
	UseMenuModalType,
} from '../../../../hooks/useModals/types'

interface AddonSectionProps {
	formData: AddMenuItemFormData
	setFormData: React.Dispatch<React.SetStateAction<AddMenuItemFormData>>
	showAlert: UseAlertModalType['showAlert']
	showMenuModal: UseMenuModalType['showMenu']
}

const AddonSection: React.FC<AddonSectionProps> = ({
	formData,
	setFormData,
	showAlert,
	showMenuModal,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireAddMenuItemStyles(colors, responsive)
	const { menuItems } = useMenuContext()

	// Add-on Handlers
	const handleAddAddon = () => {
		if (menuItems.length === 0) {
			showAlert({
				title: 'No Menu Items',
				message: 'Create some menu items first to use as add-ons',
			})
			return
		}

		const menuItemOptions = menuItems.map((item: any) => ({
			label: `${item.name} - ₱${item.basePrice}`,
			value: item.id,
		}))

		showMenuModal({
			title: 'Select Menu Item',
			options: menuItemOptions,
			onSelect: (menuItemId: number) => {
				const selectedItem = menuItems.find(
					(item: any) => item.id === menuItemId
				)
				if (selectedItem) {
					const newAddon: AddonInput = {
						menuItemId: menuItemId,
						label: null,
						priceOverride: null,
						required: false,
						position: formData.addons.length,
					}
					setFormData((prev) => ({
						...prev,
						addons: [...prev.addons, newAddon],
					}))
				}
			},
		})
	}

	const handleRemoveAddon = (index: number) => {
		setFormData((prev) => ({
			...prev,
			addons: prev.addons.filter((_, i) => i !== index),
		}))
	}

	const handleUpdateAddon = (
		index: number,
		field: keyof AddonInput,
		value: any
	) => {
		setFormData((prev) => ({
			...prev,
			addons: prev.addons.map((addon, i) =>
				i === index ? { ...addon, [field]: value } : addon
			),
		}))
	}

	return (
		<>
			<Text style={[styles.sectionTitle, styles.addonSectionTitle]}>
				Add-ons (Optional)
			</Text>
			{formData.addons.map((addon, index) => {
				const menuItem = menuItems.find(
					(item: any) => item.id === addon.menuItemId
				)
				return (
					<View
						key={index}
						style={styles.addonCard}>
						<View style={styles.addonHeader}>
							<Text style={styles.addonTitle}>
								{menuItem?.name || 'Unknown Item'}
							</Text>
							<TouchableOpacity onPress={() => handleRemoveAddon(index)}>
								<Ionicons
									name="trash-outline"
									size={20}
									color="#ef4444"
								/>
							</TouchableOpacity>
						</View>

						{/* Custom Label */}
						<TextInput
							style={[styles.categoryInput, styles.addonLabelInput]}
							value={addon.label || ''}
							onChangeText={(text) =>
								handleUpdateAddon(index, 'label', text || null)
							}
							placeholder="Custom label (optional)"
							placeholderTextColor={colors.textSecondary}
						/>

						{/* Price Override */}
						<View style={styles.addonPriceRow}>
							<Text style={styles.addonPriceLabel}>Price Override: ₱</Text>
							<TextInput
								style={[styles.categoryInput, styles.addonPriceInput]}
								value={addon.priceOverride || ''}
								onChangeText={(text) =>
									handleUpdateAddon(index, 'priceOverride', text || null)
								}
								placeholder={menuItem?.basePrice?.toString() || '0.00'}
								placeholderTextColor={colors.textSecondary}
								keyboardType="decimal-pad"
							/>
						</View>

						{/* Required Toggle */}
						<TouchableOpacity
							style={styles.checkboxRow}
							onPress={() =>
								handleUpdateAddon(index, 'required', !addon.required)
							}>
							<View
								style={[
									styles.checkbox,
									addon.required
										? styles.checkboxChecked
										: styles.checkboxUnchecked,
								]}>
								{addon.required && (
									<Ionicons
										name="checkmark"
										size={14}
										color="#fff"
									/>
								)}
							</View>
							<Text style={styles.checkboxLabel}>Required</Text>
						</TouchableOpacity>
					</View>
				)
			})}

			<TouchableOpacity
				style={styles.addCategoryButton}
				onPress={handleAddAddon}>
				<Ionicons
					name="add-circle-outline"
					size={20}
					color={colors.primary}
				/>
				<Text style={styles.addCategoryButtonText}>Add Add-on</Text>
			</TouchableOpacity>
		</>
	)
}

export default AddonSection
