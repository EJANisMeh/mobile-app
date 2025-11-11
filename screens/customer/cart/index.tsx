import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import {
	useAuthContext,
	useThemeContext,
	useOrderContext,
} from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { useAlertModal, useConfirmationModal } from '../../../hooks/useModals'
import { createCustomerCartStyles } from '../../../styles/customer'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'
import {
	CartGroupCard,
	OrderScheduleModal,
	PaymentMethodModal,
	OrderConfirmationModal,
} from '../../../components/customer/cart'
import { AlertModal, ConfirmationModal } from '../../../components/modals'
import {
	loadCartItemsForUser,
	overwriteCartItemsForUser,
	normalizeMenuItemSchedule,
	normalizeConcessionSchedule,
	CONCESSION_SCHEDULE_DAY_KEYS,
	getMenuItemDayKeyForDate,
	getMenuItemAvailabilityStatus,
	hasAnyMenuItemScheduleDay,
} from '../../../utils'
import { menuApi, concessionApi } from '../../../services/api'
import type {
	CartItem,
	CartGroup,
	CartMenuItemMeta,
	MenuItemAvailabilitySchedule,
	ConcessionSchedule,
	ScheduleSelectionState,
	MenuItemAvailabilityStatus,
	MenuItemDayKey,
	CreateOrderPayload,
	GroupStatusInfo,
	CartItemStatusInfo,
	PaymentMethodTuple,
	PaymentProof,
} from '../../../types'

type ScheduleContext = 'group' | 'split'

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
	const [paymentModalVisible, setPaymentModalVisible] = useState(false)
	const [orderConfirmationVisible, setOrderConfirmationVisible] =
		useState(false)
	const [activeGroupId, setActiveGroupId] = useState<number | null>(null)
	const [processingGroupId, setProcessingGroupId] = useState<number | null>(
		null
	)
	const [splitQueue, setSplitQueue] = useState<CartItem[]>([])
	const [splitIndex, setSplitIndex] = useState(0)
	const [scheduleContext, setScheduleContext] =
		useState<ScheduleContext>('group')
	const [pendingScheduleSelection, setPendingScheduleSelection] =
		useState<ScheduleSelectionState | null>(null)
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
		string | null
	>(null)
	const [selectedPaymentProof, setSelectedPaymentProof] =
		useState<PaymentProof | null>(null)
	const [concessionPaymentMethods, setConcessionPaymentMethods] = useState<
		PaymentMethodTuple[]
	>([])
	const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(false)

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
				sharedServingDays: [],
				requiresSplitScheduling: false,
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

			const sharedServingDays: MenuItemDayKey[] = combinedSchedule
				? (CONCESSION_SCHEDULE_DAY_KEYS.filter((dayKey) => {
						const typedKey = dayKey as MenuItemDayKey
						if (!combinedSchedule?.[typedKey]) {
							return false
						}

						if (!concessionSchedule) {
							return true
						}

						const concessionDay = concessionSchedule[dayKey]
						return Boolean(
							concessionDay?.isOpen &&
								typeof concessionDay.open === 'string' &&
								typeof concessionDay.close === 'string'
						)
				  }) as MenuItemDayKey[])
				: []

			const statusSequence = metaEntries.map((meta) => meta.availabilityStatus)
			let status: MenuItemAvailabilityStatus = 'available'

			if (statusSequence.includes('out_of_stock')) {
				status = 'out_of_stock'
			} else if (statusSequence.includes('not_served_today')) {
				status = 'not_served_today'
			}

			const hasServingDay = sharedServingDays.length > 0

			const requiresSplitScheduling = Boolean(
				hasCompleteMeta &&
					sharedServingDays.length === 0 &&
					metaEntries.some((meta) => hasAnyMenuItemScheduleDay(meta.schedule))
			)

			if (status === 'available') {
				const todayKey = getMenuItemDayKeyForDate(new Date())
				const servesToday = sharedServingDays.includes(todayKey)

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
				sharedServingDays,
				requiresSplitScheduling,
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

	const splitActiveItem = useMemo(() => {
		if (splitQueue.length === 0) {
			return null
		}
		const index = Math.min(splitIndex, splitQueue.length - 1)
		return splitQueue[index] ?? null
	}, [splitIndex, splitQueue])

	const scheduleModalState = useMemo<{
		schedule: MenuItemAvailabilitySchedule | null | undefined
		concessionSchedule: ConcessionSchedule | null | undefined
		availabilityStatus: MenuItemAvailabilityStatus
		itemName: string
		isConcessionOpen: boolean
	}>(() => {
		if (!activeGroup) {
			return {
				schedule: undefined,
				concessionSchedule: undefined,
				availabilityStatus: 'not_served_today',
				itemName: 'from this concession',
				isConcessionOpen: false,
			}
		}

		const concessionLabel = activeGroup.concessionName ?? 'this concession'

		if (scheduleContext === 'split' && splitActiveItem) {
			const itemMeta = activeGroup.menuMeta[splitActiveItem.menuItemId]
			return {
				schedule: itemMeta?.schedule ?? null,
				concessionSchedule:
					itemMeta?.concessionSchedule ??
					activeGroup.concessionSchedule ??
					null,
				availabilityStatus: itemMeta?.availabilityStatus ?? 'not_served_today',
				itemName: `${splitActiveItem.name} from ${concessionLabel}`,
				isConcessionOpen:
					itemMeta?.concessionIsOpen ?? activeGroup.concessionIsOpen,
			}
		}

		return {
			schedule: activeGroup.combinedSchedule ?? null,
			concessionSchedule: activeGroup.concessionSchedule ?? null,
			availabilityStatus: activeGroup.status,
			itemName: `items from ${concessionLabel}`,
			isConcessionOpen: activeGroup.concessionIsOpen,
		}
	}, [activeGroup, scheduleContext, splitActiveItem])

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

	const getGroupStatusInfo = (group: CartGroup): GroupStatusInfo => {
		const todayKey = getMenuItemDayKeyForDate(new Date())
		const servedToday = group.sharedServingDays.includes(todayKey)

		if (!group.hasCompleteMeta) {
			return {
				label: 'Checking availability…',
				helper: 'We are confirming each item for this concession.',
				tone: 'info',
				servedToday,
			}
		}

		if (!group.hasServingDay) {
			if (group.requiresSplitScheduling) {
				const isSingleItem = group.items.length === 1
				return {
					label: isSingleItem
						? 'No common selling days'
						: 'Different schedules',
					helper: isSingleItem
						? 'Schedule this item on an available day.'
						: 'Order each item separately to pick different days.',
					tone: 'warning',
					servedToday,
				}
			}
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
				helper: 'Schedule this order/items for another day.',
				tone: 'warning',
				servedToday,
			}
		}

		if (group.status === 'not_served_today' || !servedToday) {
			return {
				label: 'Includes items not sold today',
				helper: 'Schedule this order/items on a selling day.',
				tone: 'warning',
				servedToday,
			}
		}

		return {
			label: 'All items available',
			helper: 'Order now or schedule ahead.',
			tone: 'success',
			servedToday,
		}
	}

	const getCartItemStatusInfo = useCallback(
		(item: CartItem): CartItemStatusInfo => {
			const meta = menuItemMeta[item.menuItemId]
			if (!meta) {
				return {
					label: 'Checking availability…',
					tone: 'info',
				}
			}

			if (!hasAnyMenuItemScheduleDay(meta.schedule)) {
				return {
					label: 'No selling days',
					tone: 'warning',
				}
			}

			if (!meta.concessionIsOpen) {
				return {
					label: 'Concession closed',
					tone: 'warning',
				}
			}

			switch (meta.availabilityStatus) {
				case 'out_of_stock':
					return {
						label: 'Out of stock',
						tone: 'error',
					}
				case 'not_served_today':
					return {
						label: 'Not available for today',
						tone: 'warning',
					}
				default:
					return {
						label: 'Available',
						tone: 'success',
					}
			}
		},
		[menuItemMeta]
	)

	const cartGroupCards = useMemo(
		() =>
			groupedCart.map((group) => {
				const statusInfo = getGroupStatusInfo(group)
				const isGroupLoading = metaLoading && !group.hasCompleteMeta
				const buttonDisabled =
					orderBackend.isProcessing || isGroupLoading || !group.hasCompleteMeta
				const showProcessingIndicator =
					orderBackend.isProcessing && processingGroupId === group.concessionId
				const itemsWithStatus = group.items.map((item) => {
					const meta = group.menuMeta[item.menuItemId]
					const canOrderIndividually = Boolean(
						group.items.length > 1 &&
							meta &&
							hasAnyMenuItemScheduleDay(meta.schedule)
					)
					return {
						item,
						status: getCartItemStatusInfo(item),
						canOrderIndividually,
					}
				})

				return {
					group,
					statusInfo,
					buttonLabel: 'Place Order',
					buttonDisabled,
					showProcessingIndicator,
					items: itemsWithStatus,
				}
			}),
		[
			groupedCart,
			getCartItemStatusInfo,
			metaLoading,
			orderBackend.isProcessing,
			processingGroupId,
		]
	)

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
			if (group.requiresSplitScheduling) {
				const eligibleItems = group.items.filter((item) => {
					const meta = group.menuMeta[item.menuItemId]
					return Boolean(meta && hasAnyMenuItemScheduleDay(meta.schedule))
				})

				if (eligibleItems.length === 0) {
					alertModal.showAlert({
						title: 'Items Unavailable',
						message:
							'We could not load item schedules right now. Please try again later.',
					})
					return
				}

				setScheduleContext('split')
				setActiveGroupId(group.concessionId)
				setSplitQueue(eligibleItems)
				setSplitIndex(0)
				setScheduleModalVisible(true)
				return
			}

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

		setScheduleContext('group')
		setActiveGroupId(group.concessionId)
		setScheduleModalVisible(true)
	}

	const handleOrderSingleItemPress = (group: CartGroup, item: CartItem) => {
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

		const meta = group.menuMeta[item.menuItemId]
		if (!meta) {
			alertModal.showAlert({
				title: 'Checking Availability',
				message:
					'We are still confirming the schedule for this item. Please try again shortly.',
			})
			return
		}

		if (!hasAnyMenuItemScheduleDay(meta.schedule)) {
			alertModal.showAlert({
				title: 'Cannot Order This Item',
				message: 'This item is not accepting orders right now.',
			})
			return
		}

		setScheduleContext('split')
		setActiveGroupId(group.concessionId)
		setSplitQueue([item])
		setSplitIndex(0)
		setScheduleModalVisible(true)
	}

	const handleRemoveItemPress = (group: CartGroup, item: CartItem) => {
		orderConfirmation.showConfirmation({
			title: 'Remove item?',
			message: `Remove ${item.name} from ${group.concessionName}?`,
			confirmText: 'Remove',
			cancelText: 'Keep item',
			confirmStyle: 'destructive',
			onConfirm: () => {
				void removeItemsFromCart([item])
				setSplitQueue((prev) => prev.filter((queued) => queued.id !== item.id))
			},
		})
	}

	const handleUpdateQuantity = async (item: CartItem, newQuantity: number) => {
		if (!user || newQuantity < 1) {
			return
		}

		const updatedItems = cartItems.map((cartItem) =>
			cartItem.id === item.id
				? {
						...cartItem,
						quantity: newQuantity,
						totalPrice: roundCurrency(cartItem.unitPrice * newQuantity),
				  }
				: cartItem
		)

		await overwriteCartItemsForUser(user.id, updatedItems)
		setCartItems(updatedItems)
	}

	const handleScheduleModalClose = () => {
		setScheduleModalVisible(false)
		// Don't reset state here - only reset after final confirmation or cancel
	}

	const handlePaymentModalClose = () => {
		setPaymentModalVisible(false)
	}

	const handleResetOrderFlow = () => {
		setScheduleModalVisible(false)
		setPaymentModalVisible(false)
		setActiveGroupId(null)
		setSplitQueue([])
		setSplitIndex(0)
		setScheduleContext('group')
		setPendingScheduleSelection(null)
		setSelectedPaymentMethod(null)
		setSelectedPaymentProof(null)
		setConcessionPaymentMethods([])
		setPaymentMethodsLoading(false)
	}

	const buildOrderPayload = (
		group: CartGroup,
		selection: ScheduleSelectionState,
		proof: PaymentProof | null
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
			customer_request: item.customer_request || null,
		}))

		const total = roundCurrency(
			orderItems.reduce((sum, entry) => sum + entry.item_total, 0)
		)

		const scheduledForIso =
			selection.mode === 'scheduled' && selection.scheduledAt
				? selection.scheduledAt.toISOString()
				: null

		// Build payment_mode object from selected payment method
		const paymentTuple = concessionPaymentMethods.find(
			([type]) => type === selectedPaymentMethod
		)
		const payment_mode = paymentTuple
			? {
					type: paymentTuple[0],
					details: paymentTuple[1],
					needsProof: paymentTuple[2],
					proofMode: paymentTuple[3],
			  }
			: {}

		return {
			orderMode: selection.mode,
			scheduledFor: scheduledForIso,
			customerId: user.id,
			concessionId: group.concessionId,
			total,
			payment_mode,
			payment_proof: proof,
			concession_note: null,
			orderItems,
		}
	}

	const buildSingleItemOrderPayload = (
		group: CartGroup,
		item: CartItem,
		selection: ScheduleSelectionState,
		proof: PaymentProof | null
	): CreateOrderPayload | null => {
		if (!user) {
			return null
		}

		const orderItem = {
			menuItemId: item.menuItemId,
			variationId: null,
			addon_menu_item_id: null,
			quantity: item.quantity,
			unitPrice: roundCurrency(item.unitPrice),
			variation_snapshot: item.variationGroups,
			options_snapshot: item.variationOptions,
			addons_snapshot: item.addons,
			item_total: roundCurrency(item.totalPrice),
			customer_request: item.customer_request || null,
		}

		const scheduledForIso =
			selection.mode === 'scheduled' && selection.scheduledAt
				? selection.scheduledAt.toISOString()
				: null

		// Build payment_mode object from selected payment method
		const paymentTuple = concessionPaymentMethods.find(
			([type]) => type === selectedPaymentMethod
		)
		const payment_mode = paymentTuple
			? {
					type: paymentTuple[0],
					details: paymentTuple[1],
					needsProof: paymentTuple[2],
					proofMode: paymentTuple[3],
			  }
			: {}

		return {
			orderMode: selection.mode,
			scheduledFor: scheduledForIso,
			customerId: user.id,
			concessionId: group.concessionId,
			total: roundCurrency(orderItem.item_total),
			payment_mode,
			payment_proof: proof,
			concession_note: null,
			orderItems: [orderItem],
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

	const removeItemsFromCart = async (itemsToRemove: CartItem[]) => {
		if (!user || itemsToRemove.length === 0) {
			return
		}

		const idsToRemove = new Set(itemsToRemove.map((item) => item.id))
		const remaining = cartItems.filter((item) => !idsToRemove.has(item.id))

		await overwriteCartItemsForUser(user.id, remaining)
		setCartItems(remaining)
		setMenuItemMeta((prev) => {
			const next = { ...prev }
			itemsToRemove.forEach((item) => {
				const stillInCart = remaining.some(
					(remainingItem) => remainingItem.menuItemId === item.menuItemId
				)
				if (!stillInCart) {
					delete next[item.menuItemId]
				}
			})
			return next
		})
	}

	const placeOrderForGroup = async (
		group: CartGroup,
		selection: ScheduleSelectionState
	) => {
		const payload = buildOrderPayload(group, selection, selectedPaymentProof)
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
				handleResetOrderFlow()
				alertModal.showAlert({
					title: 'Order Placed',
					message:
						response.message ||
						`We sent your order to ${group.concessionName}. We will keep you updated.`,
					onClose: () => {
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

	const placeOrderForSplitItem = async (
		group: CartGroup,
		item: CartItem,
		selection: ScheduleSelectionState
	) => {
		const payload = buildSingleItemOrderPayload(
			group,
			item,
			selection,
			selectedPaymentProof
		)
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
				const remainingQueue = splitQueue.filter(
					(queued) => queued.id !== item.id
				)

				await removeItemsFromCart([item])
				setSplitQueue(remainingQueue)
				setSplitIndex(0)

				alertModal.showAlert({
					title: 'Order Placed',
					message:
						response.message ||
						`We sent your order for ${item.name} to ${group.concessionName}.`,
					onClose: () => {
						if (remainingQueue.length > 0) {
							setScheduleContext('split')
							setActiveGroupId(group.concessionId)
							setScheduleModalVisible(true)
						} else {
							handleResetOrderFlow()
							void refreshCart()
						}
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

	const handleScheduleSelectionConfirm = async (
		selection: ScheduleSelectionState
	) => {
		if (!activeGroup) {
			alertModal.showAlert({
				title: 'Unable to Continue',
				message:
					'We could not find the items for this concession. Please try again.',
			})
			handleResetOrderFlow()
			return
		}

		// Store the schedule selection
		setPendingScheduleSelection(selection)
		setScheduleModalVisible(false)

		// Fetch concession payment methods
		setPaymentMethodsLoading(true)
		try {
			const response = await concessionApi.getConcession(
				activeGroup.concessionId
			)
			const concessionData = response.concession_data || response.concession
			if (response.success && concessionData?.payment_methods) {
				const methods = Array.isArray(concessionData.payment_methods)
					? concessionData.payment_methods
					: []
				setConcessionPaymentMethods(methods as PaymentMethodTuple[])
				setPaymentModalVisible(true)
			} else {
				throw new Error('Unable to load payment methods')
			}
		} catch (err) {
			alertModal.showAlert({
				title: 'Unable to Continue',
				message:
					'Could not load payment methods for this concession. Please try again.',
			})
			handleResetOrderFlow()
		} finally {
			setPaymentMethodsLoading(false)
		}
	}

	const handlePaymentMethodConfirm = (
		paymentMethod: string,
		paymentDetails: string,
		needsProof: boolean,
		proofMode: 'text' | 'screenshot' | null,
		proof: PaymentProof | null
	) => {
		setSelectedPaymentMethod(paymentMethod)
		setSelectedPaymentProof(proof)
		setPaymentModalVisible(false)

		if (!activeGroup || !pendingScheduleSelection) {
			alertModal.showAlert({
				title: 'Unable to Continue',
				message: 'Something went wrong. Please try again.',
			})
			handleResetOrderFlow()
			return
		}

		// Show order confirmation modal instead of generic confirmation
		setOrderConfirmationVisible(true)
	}

	const orderSummary = useMemo(() => {
		if (!activeGroup || !pendingScheduleSelection || !selectedPaymentMethod) {
			return null
		}

		const paymentTuple = concessionPaymentMethods.find(
			([type]) => type === selectedPaymentMethod
		)
		const paymentDetails = paymentTuple?.[1] || ''

		// Build items array based on context
		const items =
			scheduleContext === 'split' && splitActiveItem
				? [
						{
							name: splitActiveItem.name,
							quantity: splitActiveItem.quantity,
							unitPrice: splitActiveItem.unitPrice,
							totalPrice: splitActiveItem.totalPrice,
							variationGroups: splitActiveItem.variationGroups,
							addons: splitActiveItem.addons,
							customer_request: splitActiveItem.customer_request,
						},
				  ]
				: activeGroup.items.map((item) => ({
						name: item.name,
						quantity: item.quantity,
						unitPrice: item.unitPrice,
						totalPrice: item.totalPrice,
						variationGroups: item.variationGroups,
						addons: item.addons,
						customer_request: item.customer_request,
				  }))

		const total =
			scheduleContext === 'split' && splitActiveItem
				? splitActiveItem.totalPrice
				: activeGroup.items.reduce((sum, item) => sum + item.totalPrice, 0)

		return {
			items,
			total,
			orderMode: pendingScheduleSelection.mode,
			scheduledFor: pendingScheduleSelection.scheduledAt,
			paymentMethod: selectedPaymentMethod,
			paymentDetails,
			paymentProof: selectedPaymentProof,
			concessionName: activeGroup.concessionName || 'Unknown Concession',
		}
	}, [
		activeGroup,
		pendingScheduleSelection,
		selectedPaymentMethod,
		selectedPaymentProof,
		concessionPaymentMethods,
		scheduleContext,
		splitActiveItem,
	])

	const handleConfirmOrder = async () => {
		if (!activeGroup || !pendingScheduleSelection) {
			return
		}

		setOrderConfirmationVisible(false)

		if (scheduleContext === 'split') {
			const currentItem = splitActiveItem
			if (!currentItem) {
				alertModal.showAlert({
					title: 'Unable to Continue',
					message:
						'The selected item is no longer in your cart. Please reload your cart and try again.',
				})
				handleResetOrderFlow()
				return
			}

			await placeOrderForSplitItem(
				activeGroup,
				currentItem,
				pendingScheduleSelection
			)
			return
		}

		await placeOrderForGroup(activeGroup, pendingScheduleSelection)
	}

	const handleOrderConfirmationClose = () => {
		setOrderConfirmationVisible(false)
		// Go back to payment selection
		setPaymentModalVisible(true)
	}

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
				{cartGroupCards.map((card) => (
					<CartGroupCard
						key={card.group.concessionId}
						group={card.group}
						items={card.items}
						styles={styles}
						formatCurrency={formatCurrency}
						statusInfo={card.statusInfo}
						buttonLabel={card.buttonLabel}
						buttonDisabled={card.buttonDisabled}
						showProcessingIndicator={card.showProcessingIndicator}
						onPlaceOrder={() => handlePlaceOrderPress(card.group)}
						onOrderItem={(item) => handleOrderSingleItemPress(card.group, item)}
						onRemoveItem={(item) => handleRemoveItemPress(card.group, item)}
						onUpdateQuantity={handleUpdateQuantity}
					/>
				))}
			</View>
		)
	}

	return (
		<DynamicKeyboardView useSafeArea={true}>
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
				schedule={scheduleModalState.schedule}
				concessionSchedule={scheduleModalState.concessionSchedule}
				availabilityStatus={scheduleModalState.availabilityStatus}
				isConcessionOpen={scheduleModalState.isConcessionOpen}
				itemName={scheduleModalState.itemName}
			/>
			<PaymentMethodModal
				visible={paymentModalVisible}
				onClose={handlePaymentModalClose}
				onConfirm={handlePaymentMethodConfirm}
				selectedMethod={selectedPaymentMethod}
				concessionPaymentMethods={concessionPaymentMethods}
			/>
			{orderSummary && (
				<OrderConfirmationModal
					visible={orderConfirmationVisible}
					onClose={handleOrderConfirmationClose}
					onConfirm={handleConfirmOrder}
					orderSummary={orderSummary}
				/>
			)}
		</DynamicKeyboardView>
	)
}

export default CartScreen
