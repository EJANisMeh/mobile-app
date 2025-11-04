import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
	View,
	Text,
	ActivityIndicator,
	Image,
	TouchableOpacity,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import {
	useAuthContext,
	useThemeContext,
	useOrderContext,
} from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { useAlertModal, useConfirmationModal } from '../../../hooks/useModals'
import { createCustomerCartStyles } from '../../../styles/customer'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'
import { OrderScheduleModal } from '../../../components/customer/cart'
import { AlertModal, ConfirmationModal } from '../../../components/modals'
import {
	loadCartItemsForUser,
	overwriteCartItemsForUser,
	normalizeMenuItemSchedule,
	normalizeConcessionSchedule,
	CONCESSION_SCHEDULE_DAY_KEYS,
	CONCESSION_SCHEDULE_DAY_LABELS,
	getMenuItemDayKeyForDate,
	getMenuItemAvailabilityStatus,
} from '../../../utils'
import { menuApi } from '../../../services/api'
import type {
	CartItem,
	MenuItemAvailabilitySchedule,
	ConcessionSchedule,
	ScheduleSelectionState,
	MenuItemAvailabilityStatus,
	MenuItemDayKey,
	CreateOrderPayload,
} from '../../../types'

interface CartMenuItemMeta {
	schedule: MenuItemAvailabilitySchedule
	availabilityStatus: MenuItemAvailabilityStatus
	concessionSchedule: ConcessionSchedule | null
	concessionIsOpen: boolean
	concessionName: string | null
}

interface CartGroup {
	concessionId: number
	concessionName: string
	items: CartItem[]
	menuMeta: Record<number, CartMenuItemMeta>
	missingMetaItemIds: number[]
	hasCompleteMeta: boolean
	status: MenuItemAvailabilityStatus
	concessionSchedule: ConcessionSchedule | null
	concessionIsOpen: boolean
	combinedSchedule: MenuItemAvailabilitySchedule | null
	hasServingDay: boolean
	totalQuantity: number
	totalAmount: number
}

type StatusTone = 'success' | 'warning' | 'error' | 'info'

const roundCurrency = (value: number): number =>
	Number.isFinite(value) ? Number(value.toFixed(2)) : 0

const CartScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const { user } = useAuthContext()
	const orderBackend = useOrderContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerCartStyles(colors, responsive)
	const alertModal = useAlertModal()
	const orderConfirmation = useConfirmationModal()
	const [cartItems, setCartItems] = useState<CartItem[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [menuItemMeta, setMenuItemMeta] = useState<
		Record<number, CartMenuItemMeta>
	>({})
	const [metaLoading, setMetaLoading] = useState(false)
	const [metaError, setMetaError] = useState<string | null>(null)
	const [scheduleModalVisible, setScheduleModalVisible] = useState(false)
	const [activeGroupId, setActiveGroupId] = useState<number | null>(null)
	const [processingGroupId, setProcessingGroupId] = useState<number | null>(
		null
	)

	const refreshCart = useCallback(async () => {
		if (!user?.id) {
			setCartItems([])
			setMenuItemMeta({})
			setMetaError(null)
			setError(null)
			return
		}

		setLoading(true)
		setError(null)
		try {
			const items = await loadCartItemsForUser(user.id)
			setCartItems(items)
		} catch (err) {
			console.error('Cart load error:', err)
			setError('Failed to load your cart. Please try again.')
		} finally {
			setLoading(false)
		}
	}, [user?.id])

	useFocusEffect(
		useCallback(() => {
			void refreshCart()
		}, [refreshCart])
	)

	useEffect(() => {
		if (!user?.id || cartItems.length === 0) {
			setMenuItemMeta({})
			setMetaError(null)
			setMetaLoading(false)
			return
		}

		let isCancelled = false
		const uniqueMenuItemIds = Array.from(
			new Set(cartItems.map((item) => item.menuItemId))
		)

		const loadMetadata = async () => {
			setMetaLoading(true)
			setMetaError(null)

			try {
				const responses = await Promise.allSettled(
					uniqueMenuItemIds.map((itemId) => menuApi.getMenuItemById(itemId))
				)

				const nextMeta: Record<number, CartMenuItemMeta> = {}
				const failures: number[] = []

				responses.forEach((result, index) => {
					const itemId = uniqueMenuItemIds[index]
					if (result.status !== 'fulfilled') {
						failures.push(itemId)
						return
					}

					const payload = result.value
					if (!payload || !payload.success || !payload.item) {
						failures.push(itemId)
						return
					}

					const schedule = normalizeMenuItemSchedule(
						payload.item.availabilitySchedule ?? undefined
					)
					const availabilityStatus = getMenuItemAvailabilityStatus(
						schedule,
						Boolean(payload.item.availability)
					)
					const concessionSchedule = payload.item.concession?.schedule
						? normalizeConcessionSchedule(payload.item.concession.schedule)
						: null

					nextMeta[itemId] = {
						schedule,
						availabilityStatus,
						concessionSchedule,
						concessionIsOpen: Boolean(payload.item.concession?.is_open),
						concessionName:
							typeof payload.item.concession?.name === 'string'
								? payload.item.concession.name
								: null,
					}
				})

				if (isCancelled) {
					return
				}

				setMenuItemMeta(nextMeta)
				setMetaError(
					failures.length > 0
						? 'Some items could not be checked for availability right now.'
						: null
				)
			} catch (err) {
				if (isCancelled) {
					return
				}
				setMetaError(
					err instanceof Error
						? err.message
						: 'Unable to check item availability right now.'
				)
			} finally {
				if (!isCancelled) {
					setMetaLoading(false)
				}
			}
		}

		void loadMetadata()

		return () => {
			isCancelled = true
		}
	}, [cartItems, user?.id])

	const groupedCart = useMemo(() => {
		if (cartItems.length === 0) {
			return []
		}

		const groupsMap = new Map<number, CartGroup>()

		cartItems.forEach((item) => {
			const meta = menuItemMeta[item.menuItemId]
			const existing = groupsMap.get(item.concessionId)
			const baseGroup: CartGroup = existing ?? {
				concessionId: item.concessionId,
				concessionName:
					item.concessionName ??
					menuItemMeta[item.menuItemId]?.concessionName ??
					'Concession',
				items: [],
				menuMeta: {},
				missingMetaItemIds: [],
				hasCompleteMeta: false,
				status: 'not_served_today',
				concessionSchedule: null,
				concessionIsOpen: false,
				combinedSchedule: null,
				hasServingDay: false,
				totalQuantity: 0,
				totalAmount: 0,
			}

			baseGroup.items.push(item)
			baseGroup.totalQuantity += item.quantity
			baseGroup.totalAmount = roundCurrency(
				baseGroup.totalAmount + item.totalPrice
			)

			if (meta) {
				baseGroup.menuMeta[item.menuItemId] = meta
				if (!baseGroup.concessionName && meta.concessionName) {
					baseGroup.concessionName = meta.concessionName
				}
			} else {
				baseGroup.missingMetaItemIds.push(item.menuItemId)
			}

			groupsMap.set(item.concessionId, baseGroup)
		})

		const result: CartGroup[] = []

		groupsMap.forEach((group) => {
			const metaEntries = Object.values(group.menuMeta)
			const hasCompleteMeta =
				group.items.length > 0 && group.missingMetaItemIds.length === 0

			let concessionSchedule: ConcessionSchedule | null = null
			let concessionIsOpen = false
			let combinedSchedule: MenuItemAvailabilitySchedule | null = null

			if (metaEntries.length > 0) {
				const firstMeta = metaEntries[0]
				concessionSchedule = firstMeta.concessionSchedule
				concessionIsOpen = firstMeta.concessionIsOpen
			}

			if (hasCompleteMeta) {
				const template = normalizeMenuItemSchedule()
				metaEntries.forEach((meta) => {
					CONCESSION_SCHEDULE_DAY_KEYS.forEach((dayKey) => {
						const typedKey = dayKey as MenuItemDayKey
						template[typedKey] = Boolean(
							template[typedKey] && meta.schedule[typedKey]
						)
					})
				})
				combinedSchedule = template
			}

			const statusSequence = metaEntries.map((meta) => meta.availabilityStatus)
			let status: MenuItemAvailabilityStatus = 'available'

			if (statusSequence.includes('out_of_stock')) {
				status = 'out_of_stock'
			} else if (statusSequence.includes('not_served_today')) {
				status = 'not_served_today'
			}

			const hasServingDay = Boolean(
				combinedSchedule &&
					CONCESSION_SCHEDULE_DAY_KEYS.some((dayKey) =>
						Boolean(combinedSchedule?.[dayKey as MenuItemDayKey])
					)
			)

			if (status === 'available') {
				const todayKey = getMenuItemDayKeyForDate(new Date())
				const servesToday = Boolean(
					combinedSchedule?.[todayKey as MenuItemDayKey]
				)

				if (!servesToday || !concessionIsOpen) {
					status = 'not_served_today'
				}
			}

			result.push({
				...group,
				hasCompleteMeta,
				status,
				concessionSchedule,
				concessionIsOpen,
				combinedSchedule,
				hasServingDay,
				concessionName: group.concessionName || 'Concession',
			})
		})

		return result.sort((a, b) =>
			a.concessionName.localeCompare(b.concessionName)
		)
	}, [cartItems, menuItemMeta])

	const activeGroup = useMemo(() => {
		if (activeGroupId === null) {
			return null
		}
		return (
			groupedCart.find((group) => group.concessionId === activeGroupId) ?? null
		)
	}, [activeGroupId, groupedCart])

	const totalItems = useMemo(
		() => cartItems.reduce((sum, item) => sum + item.quantity, 0),
		[cartItems]
	)

	const totalAmount = useMemo(
		() => groupedCart.reduce((sum, group) => sum + group.totalAmount, 0),
		[groupedCart]
	)

	const formatCurrency = useCallback(
		(value: number) => `₱${value.toFixed(2)}`,
		[]
	)

	const getGroupStatusInfo = (
		group: CartGroup
	): {
		label: string
		helper: string | null
		tone: StatusTone
		servedToday: boolean
	} => {
		const todayKey = getMenuItemDayKeyForDate(new Date())
		const servedToday = Boolean(
			group.combinedSchedule?.[todayKey as MenuItemDayKey]
		)

		if (!group.hasCompleteMeta) {
			return {
				label: 'Checking availability…',
				helper: 'We are confirming each item for this concession.',
				tone: 'info',
				servedToday,
			}
		}

		if (!group.hasServingDay) {
			return {
				label: 'No selling days',
				helper: 'These items are not open for ordering right now.',
				tone: 'warning',
				servedToday,
			}
		}

		if (group.status === 'out_of_stock') {
			return {
				label: 'Out of stock',
				helper: 'Some items in this group are unavailable.',
				tone: 'error',
				servedToday,
			}
		}

		if (!group.concessionIsOpen) {
			return {
				label: 'Concession closed',
				helper: 'Schedule this order for another day.',
				tone: 'warning',
				servedToday,
			}
		}

		if (group.status === 'not_served_today' || !servedToday) {
			return {
				label: 'Not sold today',
				helper: 'Schedule this order on a selling day.',
				tone: 'warning',
				servedToday,
			}
		}

		return {
			label: 'Ready today',
			helper: 'Order now or schedule ahead.',
			tone: 'success',
			servedToday,
		}
	}

	const handlePlaceOrderPress = (group: CartGroup) => {
		if (!user) {
			alertModal.showAlert({
				title: 'Sign In Required',
				message: 'Please sign in to place an order.',
			})
			return
		}

		if (orderBackend.isProcessing) {
			return
		}

		if (!group.hasCompleteMeta) {
			alertModal.showAlert({
				title: 'Still Checking Availability',
				message:
					'Please wait a moment while we confirm item availability for this concession.',
			})
			return
		}

		if (!group.hasServingDay) {
			alertModal.showAlert({
				title: 'No Selling Days',
				message:
					'These items are not open for scheduling right now. Please try again later.',
			})
			return
		}

		if (group.status === 'out_of_stock') {
			alertModal.showAlert({
				title: 'Items Unavailable',
				message:
					'Some items in this group are currently out of stock. Remove them to continue.',
			})
			return
		}

		setActiveGroupId(group.concessionId)
		setScheduleModalVisible(true)
	}

	const handleScheduleModalClose = () => {
		setScheduleModalVisible(false)
		setActiveGroupId(null)
	}

	const buildOrderPayload = (
		group: CartGroup,
		selection: ScheduleSelectionState
	): CreateOrderPayload | null => {
		if (!user) {
			return null
		}

		const orderItems = group.items.map((item) => ({
			menuItemId: item.menuItemId,
			variationId: null,
			addon_menu_item_id: null,
			quantity: item.quantity,
			unitPrice: roundCurrency(item.unitPrice),
			variation_snapshot: item.variationGroups,
			options_snapshot: item.variationOptions,
			addons_snapshot: item.addons,
			item_total: roundCurrency(item.totalPrice),
		}))

		const total = roundCurrency(
			orderItems.reduce((sum, entry) => sum + entry.item_total, 0)
		)

		const scheduledForIso =
			selection.mode === 'scheduled' && selection.scheduledAt
				? selection.scheduledAt.toISOString()
				: null

		return {
			orderMode: selection.mode,
			scheduledFor: scheduledForIso,
			customerId: user.id,
			concessionId: group.concessionId,
			total,
			payment_mode: {},
			concession_note: null,
			orderItems,
		}
	}

	const removeGroupFromCart = async (group: CartGroup) => {
		if (!user) {
			return
		}

		const remaining = cartItems.filter(
			(item) => item.concessionId !== group.concessionId
		)

		await overwriteCartItemsForUser(user.id, remaining)
		setCartItems(remaining)
		setMenuItemMeta((prev) => {
			const next = { ...prev }
			group.items.forEach((item) => {
				delete next[item.menuItemId]
			})
			return next
		})
	}

	const placeOrderForGroup = async (
		group: CartGroup,
		selection: ScheduleSelectionState
	) => {
		const payload = buildOrderPayload(group, selection)
		if (!payload) {
			alertModal.showAlert({
				title: 'Unable to Order',
				message: 'Please sign in before placing an order.',
			})
			return
		}

		setProcessingGroupId(group.concessionId)

		try {
			const response = await orderBackend.createOrder(payload)
			if (response.success) {
				await removeGroupFromCart(group)
				alertModal.showAlert({
					title: 'Order Placed',
					message:
						response.message ||
						`We sent your order to ${group.concessionName}. We will keep you updated.`,
					onClose: () => {
						setActiveGroupId(null)
						void refreshCart()
					},
				})
				return
			}

			if ('reasons' in response && Array.isArray(response.reasons)) {
				const reasonsList = response.reasons
					.map((reason: string, index: number) => `${index + 1}. ${reason}`)
					.join('\n')

				alertModal.showAlert({
					title: 'Order Failed',
					message: `${response.error}\n\n${reasonsList}`,
				})
				return
			}

			alertModal.showAlert({
				title: 'Order Failed',
				message:
					response.error ||
					'Unable to place your order right now. Please try again.',
			})
		} catch (err) {
			alertModal.showAlert({
				title: 'Order Failed',
				message:
					err instanceof Error
						? err.message
						: 'Unexpected error occurred. Please try again.',
			})
		} finally {
			setProcessingGroupId(null)
		}
	}

	const handleScheduleSelectionConfirm = (
		selection: ScheduleSelectionState
	) => {
		if (!activeGroup) {
			alertModal.showAlert({
				title: 'Unable to Continue',
				message:
					'We could not find the items for this concession. Please try again.',
			})
			return
		}

		const isScheduled = selection.mode === 'scheduled'
		const scheduleDetail =
			isScheduled && selection.scheduledAt
				? `Scheduled for ${selection.scheduledAt.toLocaleString()}.`
				: 'We will request this order for immediate preparation.'

		orderConfirmation.showConfirmation({
			title: isScheduled ? 'Confirm Scheduled Order' : 'Confirm Order',
			message: `${scheduleDetail}\n\nContinue with ${
				activeGroup.totalQuantity
			} ${activeGroup.totalQuantity === 1 ? 'item' : 'items'} from ${
				activeGroup.concessionName
			}?`,
			confirmText: 'Place Order',
			cancelText: 'Back',
			onConfirm: () => {
				void placeOrderForGroup(activeGroup, selection)
			},
			onCancel: () => {
				setActiveGroupId(activeGroup.concessionId)
				setScheduleModalVisible(true)
			},
		})
	}

	const renderCartItem = (item: CartItem) => (
		<View
			key={item.id}
			style={styles.cartGroupItem}>
			<View style={styles.cartGroupItemImageWrapper}>
				{item.image ? (
					<Image
						source={{ uri: item.image }}
						style={styles.cartGroupItemImage}
						resizeMode="cover"
					/>
				) : (
					<View style={styles.cartGroupItemPlaceholder}>
						<Ionicons
							name="fast-food-outline"
							size={responsive.getResponsiveFontSize(18)}
							color={colors.textSecondary}
						/>
					</View>
				)}
			</View>
			<View style={styles.cartGroupItemDetails}>
				<Text style={styles.cartGroupItemName}>{item.name}</Text>
				{item.categoryName ? (
					<Text style={styles.cartGroupItemCategory}>{item.categoryName}</Text>
				) : null}
				{item.variationGroups
					.filter((group) => group.selectedOptions.length > 0)
					.map((group) => (
						<Text
							key={`${item.id}-variation-${group.groupId}`}
							style={styles.cartGroupItemMeta}>
							{group.groupName}:{' '}
							{group.selectedOptions
								.map((option) => option.optionName)
								.join(', ')}
						</Text>
					))}
				{item.addons.length > 0 ? (
					<Text style={styles.cartGroupItemMeta}>
						Add-ons: {item.addons.map((addon) => addon.addonName).join(', ')}
					</Text>
				) : null}
				<View style={styles.cartGroupItemFooter}>
					<Text style={styles.cartGroupItemQuantity}>Qty: {item.quantity}</Text>
					<Text style={styles.cartGroupItemPrice}>
						{formatCurrency(item.totalPrice)}
					</Text>
				</View>
			</View>
		</View>
	)

	let content: React.ReactNode

	if (!user) {
		content = (
			<View style={styles.stateContainer}>
				<Text style={styles.stateTitle}>Sign in to view your cart</Text>
				<Text style={styles.stateMessage}>
					Please sign in so we can load the cart saved for your account.
				</Text>
			</View>
		)
	} else if (loading) {
		content = (
			<View style={styles.stateContainer}>
				<ActivityIndicator
					size="large"
					color={colors.primary}
				/>
				<Text style={styles.stateMessage}>Loading your cart…</Text>
			</View>
		)
	} else if (error) {
		content = (
			<View style={styles.stateContainer}>
				<Text style={styles.stateTitle}>Unable to load cart</Text>
				<Text style={styles.stateMessage}>{error}</Text>
			</View>
		)
	} else if (groupedCart.length === 0) {
		content = (
			<View style={styles.stateContainer}>
				<Text style={styles.stateTitle}>Your cart is empty</Text>
				<Text style={styles.stateMessage}>Items you add will appear here.</Text>
			</View>
		)
	} else {
		content = (
			<View style={styles.cartContent}>
				{metaError ? (
					<Text style={styles.metaErrorText}>{metaError}</Text>
				) : null}
				{groupedCart.map((group) => {
					const statusInfo = getGroupStatusInfo(group)
					const isGroupLoading = metaLoading && !group.hasCompleteMeta
					const buttonDisabled =
						orderBackend.isProcessing ||
						isGroupLoading ||
						!group.hasCompleteMeta ||
						group.status === 'out_of_stock' ||
						!group.hasServingDay
					const buttonLabel =
						statusInfo.servedToday &&
						group.concessionIsOpen &&
						group.status === 'available'
							? 'Place Order'
							: 'Schedule Order'
					const showProcessingIndicator =
						orderBackend.isProcessing &&
						processingGroupId === group.concessionId
					const badgeStyle =
						statusInfo.tone === 'success'
							? styles.groupBadgeSuccess
							: statusInfo.tone === 'warning'
							? styles.groupBadgeWarning
							: statusInfo.tone === 'error'
							? styles.groupBadgeError
							: styles.groupBadgeInfo

					return (
						<View
							key={group.concessionId}
							style={styles.cartGroupCard}>
							<View style={styles.cartGroupHeader}>
								<View style={styles.cartGroupHeaderText}>
									<Text style={styles.cartGroupTitle}>
										{group.concessionName}
									</Text>
									<Text style={styles.groupSubtext}>
										{group.totalQuantity}{' '}
										{group.totalQuantity === 1 ? 'item' : 'items'} •{' '}
										{formatCurrency(group.totalAmount)}
									</Text>
								</View>
								<View style={[styles.groupBadge, badgeStyle]}>
									<Text style={styles.groupBadgeText}>{statusInfo.label}</Text>
								</View>
							</View>

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

							<View style={styles.cartGroupScheduleRow}>
								{CONCESSION_SCHEDULE_DAY_KEYS.map((dayKey) => {
									const label = CONCESSION_SCHEDULE_DAY_LABELS[dayKey]
									const dayAvailable = Boolean(
										group.combinedSchedule?.[dayKey as MenuItemDayKey]
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

							<View style={styles.cartGroupItems}>
								{group.items.map(renderCartItem)}
							</View>

							<View style={styles.cartGroupFooter}>
								<View>
									<Text style={styles.groupTotalLabel}>Group Total</Text>
									<Text style={styles.groupTotalValue}>
										{formatCurrency(group.totalAmount)}
									</Text>
								</View>
								<TouchableOpacity
									style={[
										styles.placeOrderButton,
										buttonDisabled && styles.placeOrderButtonDisabled,
									]}
									onPress={() => handlePlaceOrderPress(group)}
									disabled={buttonDisabled}>
									{showProcessingIndicator ? (
										<ActivityIndicator
											color="#fff"
											size="small"
										/>
									) : (
										<Text style={styles.placeOrderButtonText}>
											{buttonLabel}
										</Text>
									)}
								</TouchableOpacity>
							</View>
						</View>
					)
				})}
			</View>
		)
	}

	return (
		<DynamicKeyboardView>
			<DynamicScrollView
				style={styles.container}
				showsVerticalScrollIndicator>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>Cart</Text>
					{user ? (
						<Text style={styles.headerSubtext}>
							{totalItems} {totalItems === 1 ? 'item' : 'items'} •{' '}
							{formatCurrency(totalAmount)}
						</Text>
					) : null}
				</View>

				{content}
			</DynamicScrollView>

			<AlertModal
				visible={alertModal.visible}
				onClose={alertModal.handleClose}
				title={alertModal.title}
				message={alertModal.message}
			/>

			<ConfirmationModal
				visible={orderConfirmation.visible}
				onClose={orderConfirmation.hideConfirmation}
				title={orderConfirmation.props.title}
				message={orderConfirmation.props.message}
				confirmText={orderConfirmation.props.confirmText || 'Confirm'}
				cancelText={orderConfirmation.props.cancelText || 'Cancel'}
				onConfirm={orderConfirmation.props.onConfirm}
				onCancel={orderConfirmation.props.onCancel}
				confirmStyle={orderConfirmation.props.confirmStyle || 'default'}
			/>

			<OrderScheduleModal
				visible={scheduleModalVisible}
				onClose={handleScheduleModalClose}
				onConfirm={handleScheduleSelectionConfirm}
				schedule={activeGroup?.combinedSchedule ?? undefined}
				concessionSchedule={activeGroup?.concessionSchedule ?? undefined}
				availabilityStatus={activeGroup?.status ?? 'not_served_today'}
				itemName={`from ${activeGroup?.concessionName ?? 'this concession'}`}
			/>
		</DynamicKeyboardView>
	)
}

export default CartScreen
