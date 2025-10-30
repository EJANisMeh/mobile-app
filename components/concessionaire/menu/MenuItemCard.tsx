import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createConcessionaireMenuStyles } from '../../../styles/concessionaire'
import {
	UseAlertModalType,
	UseConfirmationModalType,
} from '../../../hooks/useModals/types'
import { useConcessionaireNavigation } from '../../../hooks/useNavigation'

interface MenuItemCardProps {
	id: number
	name: string
	basePrice: number | null
	images: string[]
	displayImageIndex: number
	availability: boolean
	customVariations?: any[] // Custom variation groups
	isExpanded?: boolean
	onToggleExpand?: () => void
	showAlert: UseAlertModalType['showAlert']
	showConfirmation: UseConfirmationModalType['showConfirmation']
	onToggleAvailability: (itemId: number, currentAvailability: boolean) => void
	onToggleVariationOptionAvailability: (
		optionId: number,
		currentAvailability: boolean
	) => void
	onDelete: (itemId: number) => void
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
	id,
	name,
	basePrice,
	images,
	displayImageIndex,
	availability,
	customVariations = [],
	isExpanded = false,
	onToggleExpand,
	showAlert,
	showConfirmation,
	onToggleAvailability,
	onToggleVariationOptionAvailability,
	onDelete,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireMenuStyles(colors, responsive)
	const navigation = useConcessionaireNavigation()
	const [showMenu, setShowMenu] = useState(false)

	const handleEditItemNav = () => {
		setShowMenu(false)
		navigation.navigate('EditMenuItem', { itemId: id.toString() })
	}

	const handleToggleAvailability = () => {
		setShowMenu(false)
		showConfirmation({
			title: availability ? 'Mark as Unavailable' : 'Mark as Available',
			message: `Are you sure you want to mark "${name}" as ${
				availability ? 'unavailable' : 'available'
			}?`,
			confirmText: 'Yes',
			cancelText: 'No',
			onConfirm: () => {
				onToggleAvailability(id, availability)
			},
		})
	}

	const handleDeleteItem = () => {
		setShowMenu(false)
		showConfirmation({
			title: 'Delete Item',
			message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
			confirmText: 'Delete',
			cancelText: 'Cancel',
			confirmStyle: 'destructive',
			onConfirm: () => {
				onDelete(id)
			},
		})
	}

	return (
		<View style={styles.menuItemCard}>
			{/* Main Row: Image, Info, Actions */}
			<View
				style={{
					flexDirection: 'row',
					gap: responsive.getResponsiveMargin().medium,
				}}>
				{/* Image */}
				<View style={styles.menuItemImageContainer}>
					{images && images.length > 0 ? (
						<Image
							source={{ uri: images[displayImageIndex] || images[0] }}
							style={styles.menuItemImage}
							resizeMode="cover"
						/>
					) : (
						<View style={styles.menuItemImagePlaceholder}>
							<MaterialCommunityIcons
								name="food"
								size={32}
								color={colors.placeholder}
							/>
						</View>
					)}
				</View>

				{/* Info */}
				<View style={styles.menuItemInfo}>
					<Text
						style={styles.menuItemName}
						numberOfLines={1}>
						{name}
					</Text>
					<Text style={styles.menuItemPrice}>
						₱
						{basePrice != null
							? typeof basePrice === 'number'
								? basePrice.toFixed(2)
								: Number(basePrice).toFixed(2)
							: '0.00'}
					</Text>
					<View style={styles.menuItemStatus}>
						<View
							style={[
								styles.statusIndicator,
								availability
									? styles.statusIndicatorAvailable
									: styles.statusIndicatorUnavailable,
							]}
						/>
						<Text
							style={[
								styles.statusText,
								availability
									? styles.statusTextAvailable
									: styles.statusTextUnavailable,
							]}>
							{availability ? 'Available' : 'Unavailable'}
						</Text>
					</View>
				</View>

				{/* Actions Menu */}
				<View style={styles.menuItemActions}>
					<TouchableOpacity
						onPress={() => setShowMenu(!showMenu)}
						style={styles.menuButton}>
						<MaterialCommunityIcons
							name="dots-vertical"
							size={24}
							color={colors.text}
						/>
					</TouchableOpacity>

					{showMenu && (
						<View style={styles.dropdownMenu}>
							<TouchableOpacity
								style={styles.dropdownItem}
								onPress={handleEditItemNav}>
								<MaterialCommunityIcons
									name="pencil"
									size={18}
									color={colors.text}
								/>
								<Text style={styles.dropdownText}>Edit Item</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.dropdownItem}
								onPress={handleToggleAvailability}>
								<MaterialCommunityIcons
									name={availability ? 'eye-off' : 'eye'}
									size={18}
									color={colors.text}
								/>
								<Text style={styles.dropdownText}>
									{availability ? 'Mark Unavailable' : 'Mark Available'}
								</Text>
							</TouchableOpacity>

							<View style={styles.dropdownDivider} />

							<TouchableOpacity
								style={styles.dropdownItem}
								onPress={handleDeleteItem}>
								<MaterialCommunityIcons
									name="delete"
									size={18}
									color="#dc3545"
								/>
								<Text style={[styles.dropdownText, styles.dropdownTextDanger]}>
									Delete Item
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
			</View>

			{/* Custom Variations Section */}
			{customVariations && customVariations.length > 0 && (
				<>
					{isExpanded && (
						<View style={styles.variationsContainer}>
							{customVariations.map((group, groupIndex) => (
								<View
									key={groupIndex}
									style={styles.variationGroup}>
									<Text style={styles.variationGroupName}>{group.name}</Text>
									{group.menu_item_variation_option_choices?.map(
										(option: any, optionIndex: number) => (
											<View
												key={optionIndex}
												style={styles.variationOption}>
												<View style={styles.variationOptionInfo}>
													<Text style={styles.variationOptionName}>
														{option.name}
													</Text>
													<Text style={styles.variationOptionPrice}>
														+₱
														{option.price_adjustment
															? Number(option.price_adjustment).toFixed(2)
															: '0.00'}
													</Text>
												</View>
												<TouchableOpacity
													style={[
														styles.availabilityToggle,
														option.availability &&
															styles.availabilityToggleActive,
													]}
													onPress={() => {
														showConfirmation({
															title: option.availability
																? 'Mark Option as Unavailable'
																: 'Mark Option as Available',
															message: `Are you sure you want to mark "${
																option.name
															}" as ${
																option.availability
																	? 'unavailable'
																	: 'available'
															}?`,
															confirmText: 'Yes',
															cancelText: 'No',
															onConfirm: () => {
																onToggleVariationOptionAvailability(
																	option.id,
																	option.availability
																)
															},
														})
													}}>
													<Text
														style={[
															styles.availabilityToggleText,
															option.availability &&
																styles.availabilityToggleTextActive,
														]}>
														{option.availability ? 'Available' : 'Unavailable'}
													</Text>
												</TouchableOpacity>
											</View>
										)
									)}
								</View>
							))}
						</View>
					)}

					{/* Toggle Variations Button */}
					<TouchableOpacity
						style={styles.toggleVariationsButton}
						onPress={onToggleExpand}>
						<MaterialCommunityIcons
							name={isExpanded ? 'chevron-up' : 'chevron-down'}
							size={20}
							color={colors.primary}
						/>
						<Text style={styles.toggleVariationsText}>
							{isExpanded ? 'Hide Variations' : 'Custom Variations'}
						</Text>
					</TouchableOpacity>
				</>
			)}
		</View>
	)
}

export default MenuItemCard
