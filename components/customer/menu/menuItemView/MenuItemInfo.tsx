import React, { Dispatch, SetStateAction } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../styles/customer'
import type {
	MenuItemAvailabilityStatus,
	MenuItemDayKey,
} from '../../../../types'

interface ScheduleDayDetail {
	key: MenuItemDayKey
	label: string
	isAvailable: boolean
	isToday: boolean
}

interface MenuItemInfoProps {
	menuItem: any
	totalPrice?: number
	quantity?: number
	setQuantity?: Dispatch<SetStateAction<number>>
	showPrice?: boolean
	scheduleDays?: ScheduleDayDetail[]
	availabilityStatus?: MenuItemAvailabilityStatus | null
}

const MenuItemInfo: React.FC<MenuItemInfoProps> = ({
	menuItem,
	totalPrice,
	quantity,
	setQuantity,
	showPrice = true,
	scheduleDays,
	availabilityStatus,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)

	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price
		return `₱${numPrice.toFixed(2)}`
	}

	const handleIncreaseQuantity = () => {
		if (setQuantity && quantity !== undefined) {
			setQuantity((prev) => prev + 1)
		}
	}

	const handleDecreaseQuantity = () => {
		if (setQuantity && quantity !== undefined && quantity > 1) {
			setQuantity((prev) => prev - 1)
		}
	}

	return (
		<View style={styles.infoContainer}>
			{/* Description (shown when showPrice is false) */}
			{!showPrice && menuItem.description && (
				<View style={styles.descriptionSection}>
					<Text style={styles.descriptionLabel}>Description</Text>
					<Text style={styles.description}>{menuItem.description}</Text>
				</View>
			)}

			{scheduleDays && scheduleDays.length > 0 ? (
				<View style={styles.scheduleSection}>
					<Text style={styles.scheduleLabel}>Selling Days</Text>
					<View style={styles.scheduleDayGroups}>
						<View style={styles.scheduleDayGroup}>
							<Text style={styles.scheduleGroupLabel}>Days Sold</Text>
							<View style={styles.scheduleChipRow}>
								{scheduleDays
									.filter((day) => day.isAvailable)
									.map((day) => (
										<View
											key={`available-${day.key}`}
											style={[
												styles.scheduleChip,
												styles.scheduleChipAvailable,
												day.isToday && styles.scheduleChipToday,
											]}>
											<Text style={styles.scheduleChipText}>{day.label}</Text>
										</View>
									))}
							</View>
						</View>
						<View style={styles.scheduleDayGroup}>
							<Text style={styles.scheduleGroupLabel}>Days Not Sold</Text>
							<View style={styles.scheduleChipRow}>
								{scheduleDays
									.filter((day) => !day.isAvailable)
									.map((day) => (
										<View
											key={`unavailable-${day.key}`}
											style={[
												styles.scheduleChip,
												styles.scheduleChipUnavailable,
											]}>
											<Text style={styles.scheduleChipText}>{day.label}</Text>
										</View>
									))}
							</View>
						</View>
					</View>
				</View>
			) : null}

			{/* Price and Quantity (shown when showPrice is true) */}
			{showPrice && totalPrice !== undefined && (
				<>
					<View style={styles.priceQuantityRow}>
						{/* Dynamic Price */}
						<View style={styles.priceSection}>
							<Text style={styles.priceLabel}>Price</Text>
							<Text style={styles.basePrice}>{formatPrice(totalPrice)}</Text>
						</View>

						{/* Quantity Input */}
						{quantity !== undefined && setQuantity && (
							<View style={styles.quantitySection}>
								<Text style={styles.quantityLabel}>Quantity</Text>
								<View style={styles.quantityControls}>
									<TouchableOpacity
										style={[
											styles.quantityButton,
											quantity <= 1 && styles.quantityButtonDisabled,
										]}
										onPress={handleDecreaseQuantity}
										disabled={quantity <= 1}>
										<Ionicons
											name="remove"
											size={20}
											color={quantity <= 1 ? colors.border : colors.primary}
										/>
									</TouchableOpacity>
									<Text style={styles.quantityValue}>{quantity}</Text>
									<TouchableOpacity
										style={styles.quantityButton}
										onPress={handleIncreaseQuantity}>
										<Ionicons
											name="add"
											size={20}
											color={colors.primary}
										/>
									</TouchableOpacity>
								</View>
							</View>
						)}
					</View>
				</>
			)}
		</View>
	)
}

export default MenuItemInfo
