import React from 'react'
import {
	ActivityIndicator,
	Image,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import type { ImageSourcePropType } from 'react-native'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import {
	CONCESSION_SCHEDULE_DAY_KEYS,
	CONCESSION_SCHEDULE_DAY_LABELS,
} from '../../../utils'
import type {
	CartGroup,
	CartItem,
	CartItemStatusInfo,
	GroupStatusInfo,
	StatusTone,
} from '../../../types'
import type { MenuItemDayKey } from '../../../types'
import type { createCustomerCartStyles } from '../../../styles/customer/cart'

const DEFAULT_MENU_IMAGE: ImageSourcePropType = require('../../../assets/icon.png')

type CartStyles = ReturnType<typeof createCustomerCartStyles>

interface CartGroupCardItem {
	item: CartItem
	status: CartItemStatusInfo
	canOrderIndividually: boolean
}

interface CartGroupCardProps {
	group: CartGroup
	items: CartGroupCardItem[]
	styles: CartStyles
	formatCurrency: (value: number) => string
	statusInfo: GroupStatusInfo
	buttonLabel: string
	buttonDisabled: boolean
	showProcessingIndicator: boolean
	onPlaceOrder: () => void
	onOrderItem: (item: CartItem) => void
	onRemoveItem: (item: CartItem) => void
	onUpdateQuantity: (item: CartItem, newQuantity: number) => void
}

const CartGroupCard: React.FC<CartGroupCardProps> = ({
	group,
	items,
	styles,
	formatCurrency,
	statusInfo,
	buttonLabel,
	buttonDisabled,
	showProcessingIndicator,
	onPlaceOrder,
	onOrderItem,
	onRemoveItem,
	onUpdateQuantity,
}) => {
	const getToneBadgeStyle = (tone: StatusTone) => {
		switch (tone) {
			case 'success':
				return {
					container: styles.itemStatusBadgeSuccess,
					text: styles.itemStatusBadgeTextSuccess,
				}
			case 'warning':
				return {
					container: styles.itemStatusBadgeWarning,
					text: styles.itemStatusBadgeTextWarning,
				}
			case 'error':
				return {
					container: styles.itemStatusBadgeError,
					text: styles.itemStatusBadgeTextError,
				}
			default:
				return {
					container: styles.itemStatusBadgeInfo,
					text: styles.itemStatusBadgeTextInfo,
				}
		}
	}

	const getStatusLabelToneStyle = (tone: StatusTone) => {
		switch (tone) {
			case 'success':
				return styles.groupStatusLabelSuccess
			case 'warning':
				return styles.groupStatusLabelWarning
			case 'error':
				return styles.groupStatusLabelError
			default:
				return styles.groupStatusLabelInfo
		}
	}

	return (
		<View style={styles.cartGroupCard}>
			<View style={styles.cartGroupHeader}>
				<View style={styles.cartGroupHeaderText}>
					<Text style={styles.cartGroupTitle}>{group.concessionName}</Text>
					<Text style={styles.groupSubtext}>
						{group.totalQuantity} {group.totalQuantity === 1 ? 'item' : 'items'}{' '}
						• {formatCurrency(group.totalAmount)}
					</Text>
				</View>
			</View>

			<Text
				style={[
					styles.groupStatusLabel,
					getStatusLabelToneStyle(statusInfo.tone),
				]}>
				{statusInfo.label}
			</Text>

			{statusInfo.helper ? (
				<Text
					style={[
						styles.groupHelperText,
						statusInfo.tone === 'warning'
							? styles.groupHelperWarning
							: undefined,
					]}>
					{statusInfo.helper}
				</Text>
			) : null}

			<View style={styles.cartGroupItems}>
				{items.map(({ item, status, canOrderIndividually }, index) => {
					const toneStyles = getToneBadgeStyle(status.tone)
					const imageSource: ImageSourcePropType = item.image
						? { uri: item.image }
						: DEFAULT_MENU_IMAGE
					const orderDisabled =
						buttonDisabled || showProcessingIndicator || !group.hasCompleteMeta
					const isLastItem = index === items.length - 1

					return (
						<View
							key={item.id}
							style={styles.cartGroupItem}>
							<View style={styles.cartGroupItemMain}>
								<View style={styles.cartGroupItemImageWrapper}>
									<Image
										source={imageSource}
										style={styles.cartGroupItemImage}
										resizeMode="cover"
									/>
								</View>
								<View style={styles.cartGroupItemDetails}>
									<Text style={styles.cartGroupItemName}>{item.name}</Text>
									{item.categoryName ? (
										<Text style={styles.cartGroupItemCategory}>
											{item.categoryName}
										</Text>
									) : null}
									{item.variationGroups
										.filter(
											(groupEntry) => groupEntry.selectedOptions.length > 0
										)
										.map((groupEntry) => (
											<Text
												key={`${item.id}-variation-${groupEntry.groupId}`}
												style={styles.cartGroupItemMeta}>
												{groupEntry.groupName}:{' '}
												{groupEntry.selectedOptions
													.map((option) => option.optionName)
													.join(', ')}
											</Text>
										))}
									{item.addons.length > 0 ? (
										<Text style={styles.cartGroupItemMeta}>
											Add-ons:{' '}
											{item.addons.map((addon) => addon.addonName).join(', ')}
										</Text>
									) : null}
									<View style={styles.cartGroupItemStatusRow}>
										<View
											style={[styles.itemStatusBadge, toneStyles.container]}>
											<Text
												style={[styles.itemStatusBadgeText, toneStyles.text]}>
												{status.label}
											</Text>
										</View>
									</View>
									<View style={styles.cartGroupItemFooter}>
										<View style={styles.cartGroupItemQuantityControl}>
											<TouchableOpacity
												style={[
													styles.quantityButton,
													item.quantity <= 1 && styles.quantityButtonDisabled,
												]}
												onPress={() =>
													onUpdateQuantity(item, Math.max(1, item.quantity - 1))
												}
												disabled={item.quantity <= 1}>
												<Ionicons
													name="remove"
													size={16}
													color={item.quantity <= 1 ? '#ccc' : '#0066ff'}
												/>
											</TouchableOpacity>
											<Text style={styles.cartGroupItemQuantity}>
												{item.quantity}
											</Text>
											<TouchableOpacity
												style={styles.quantityButton}
												onPress={() =>
													onUpdateQuantity(item, item.quantity + 1)
												}>
												<Ionicons
													name="add"
													size={16}
													color="#0066ff"
												/>
											</TouchableOpacity>
										</View>
										<Text style={styles.cartGroupItemPrice}>
											{formatCurrency(item.totalPrice)}
										</Text>
									</View>
								</View>
							</View>
							<View style={styles.cartGroupItemActionsRow}>
								{canOrderIndividually ? (
									<View style={styles.itemActionButtonWrapper}>
										<TouchableOpacity
											style={[
												styles.itemActionButton,
												orderDisabled && styles.itemActionButtonDisabled,
											]}
											onPress={() => onOrderItem(item)}
											disabled={orderDisabled}>
											<Text style={styles.itemActionButtonText}>
												Order separately
											</Text>
										</TouchableOpacity>
									</View>
								) : null}
								<TouchableOpacity
									style={styles.itemRemoveIconButton}
									onPress={() => onRemoveItem(item)}
									accessible
									accessibilityRole="button"
									accessibilityLabel={`Remove ${item.name} from cart`}>
									<MaterialCommunityIcons
										name="trash-can-outline"
										size={20}
										style={styles.itemRemoveIcon}
									/>
								</TouchableOpacity>
							</View>

							{!isLastItem ? (
								<View style={styles.cartGroupItemDivider} />
							) : null}
						</View>
					)
				})}
			</View>

			<View style={styles.cartGroupFooter}>
				<View style={styles.cartGroupScheduleBlock}>
					<Text style={styles.cartGroupScheduleLabel}>
						Selling days for the item/s in this concession
					</Text>
					<View style={styles.cartGroupScheduleRow}>
						{CONCESSION_SCHEDULE_DAY_KEYS.map((dayKey) => {
							const label = CONCESSION_SCHEDULE_DAY_LABELS[dayKey]
							const dayAvailable = group.sharedServingDays.includes(
								dayKey as MenuItemDayKey
							)

							return (
								<View
									key={`${group.concessionId}-${dayKey}`}
									style={[
										styles.scheduleChip,
										dayAvailable
											? styles.scheduleChipActive
											: styles.scheduleChipInactive,
									]}>
									<Text
										style={[
											styles.scheduleChipText,
											dayAvailable
												? styles.scheduleChipTextActive
												: styles.scheduleChipTextInactive,
										]}>
										{label.slice(0, 3)}
									</Text>
								</View>
							)
						})}
					</View>
				</View>

				<View style={styles.cartGroupFooterRow}>
					<View style={styles.cartGroupTotals}>
						<Text style={styles.groupTotalLabel}>Group Total</Text>
						<Text style={styles.groupTotalValue}>
							{formatCurrency(group.totalAmount)}
						</Text>
					</View>
					<View style={styles.cartGroupButtons}>
						<TouchableOpacity
							style={[
								styles.placeOrderButton,
								buttonDisabled && styles.placeOrderButtonDisabled,
							]}
							onPress={onPlaceOrder}
							disabled={buttonDisabled}>
							{showProcessingIndicator ? (
								<ActivityIndicator
									color="#fff"
									size="small"
								/>
							) : (
								<Text style={styles.placeOrderButtonText}>{buttonLabel}</Text>
							)}
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	)
}

export default CartGroupCard
