import React from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { useMenuBackend } from '../../../../hooks/useBackend/useMenuBackend'
import { createConcessionaireEditMenuItemStyles } from '../../../../styles/concessionaire'
import { AddMenuItemFormData, AddonInput } from '../../../../types'
import {
	UseAlertModalType,
	UseMenuModalType,
} from '../../../../hooks/useModals/types'

interface AddonSectionProps {
	formData: AddMenuItemFormData
	setFormData: React.Dispatch<React.SetStateAction<AddMenuItemFormData>>
	showAlert: UseAlertModalType['showAlert']
	showMenuModal: UseMenuModalType['showMenu']
	itemId: number
}

const AddonSection: React.FC<AddonSectionProps> = ({
	formData,
	setFormData,
	showAlert,
	showMenuModal,
	itemId,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireEditMenuItemStyles(colors, responsive)
	const { menuItems } = useMenuBackend()

	// Add-on Handlers
	const handleAddAddon = () => {
		const availableItems = menuItems.filter((item: any) => item.id !== itemId)

		if (availableItems.length === 0) {
			showAlert({
				title: 'No Items Available',
				message:
					'An item cannot be an addon of itself. Add other menu items first.',
			})
			return
		}

		const menuItemOptions = availableItems.map((item: any) => ({
			label: `${item.name} - ₱${item.basePrice}`,
			value: item.id,
		}))

		showMenuModal({
			title: 'Select Menu Item',
			options: menuItemOptions,
			onSelect: (menuItemId: number) => {
				const selectedItem = availableItems.find(
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
			<Text style={[styles.sectionTitle, { marginTop: 16 }]}>
				Add-ons (Optional)
			</Text>
			{formData.addons.map((addon, index) => {
				const menuItem = menuItems.find(
					(item: any) => item.id === addon.menuItemId
				)
				return (
					<View
						key={index}
						style={{
							backgroundColor: colors.surface,
							borderRadius: 8,
							padding: 12,
							marginBottom: 8,
							borderWidth: 1,
							borderColor: colors.border,
						}}>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
								marginBottom: 8,
							}}>
							<Text
								style={{
									fontSize: 14,
									fontWeight: '600',
									color: colors.text,
									flex: 1,
								}}>
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
							style={[styles.categoryInput, { marginBottom: 8 }]}
							value={addon.label || ''}
							onChangeText={(text) =>
								handleUpdateAddon(index, 'label', text || null)
							}
							placeholder="Custom label (optional)"
							placeholderTextColor={colors.textSecondary}
						/>

						{/* Price Override */}
						<View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
							<Text
								style={{
									fontSize: 14,
									color: colors.text,
									alignSelf: 'center',
								}}>
								Price Override: ₱
							</Text>
							<TextInput
								style={[styles.categoryInput, { flex: 1 }]}
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
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								gap: 8,
							}}
							onPress={() =>
								handleUpdateAddon(index, 'required', !addon.required)
							}>
							<View
								style={{
									width: 20,
									height: 20,
									borderRadius: 4,
									borderWidth: 2,
									borderColor: addon.required ? colors.primary : colors.border,
									backgroundColor: addon.required
										? colors.primary
										: 'transparent',
									justifyContent: 'center',
									alignItems: 'center',
								}}>
								{addon.required && (
									<Ionicons
										name="checkmark"
										size={14}
										color="#fff"
									/>
								)}
							</View>
							<Text style={{ fontSize: 14, color: colors.text }}>Required</Text>
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
