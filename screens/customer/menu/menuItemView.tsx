import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import { useAuthContext, useThemeContext } from '../../../context'
import { useResponsiveDimensions, useHideNavBar } from '../../../hooks'
import { useCustomerNavigation } from '../../../hooks/useNavigation'
import { useAlertModal, useConfirmationModal } from '../../../hooks/useModals'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'
import { createCustomerMenuItemViewStyles } from '../../../styles/customer'
import {
	CustomerStackParamList,
	VariationSelection,
	AddonSelection,
	PriceCalculation,
	CreateOrderPayload,
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
import { AlertModal, ConfirmationModal } from '../../../components/modals'

type MenuItemViewRouteProp = RouteProp<CustomerStackParamList, 'MenuItemView'>

const MenuItemViewScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)
	const route = useRoute<MenuItemViewRouteProp>()
	const navigation = useCustomerNavigation()
	const { user } = useAuthContext()
	const alertModal = useAlertModal()
	const addToCartConfirmation = useConfirmationModal()
	const orderConfirmation = useConfirmationModal()

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
	const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)

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
				const selectionTypeCode =
					group?.selection_types?.code ?? 'single_optional'
				const multiLimitValue =
					typeof group?.multi_limit === 'number' ? group.multi_limit : 0
				varSelections.set(group.id, {
					groupId: group.id,
					groupName: group.name,
					selectionTypeCode,
					multiLimit: multiLimitValue,
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
					const numericPrice =
						typeof displayPrice === 'string'
							? parseFloat(displayPrice)
							: Number(displayPrice ?? 0)

					addSelections.set(addon.id, {
						addonId: addon.id,
						addonName: displayName,
						price: Number.isFinite(numericPrice) ? numericPrice : 0,
						selected: addon.required, // Auto-select required addons
					})
				}
			)
		}

		setVariationSelections(varSelections)
		setAddonSelections(addSelections)
	}

	const toNumericValue = (value: unknown): number => {
		if (typeof value === 'number') {
			return Number.isFinite(value) ? value : 0
		}
		if (typeof value === 'string') {
			const parsed = parseFloat(value)
			return Number.isFinite(parsed) ? parsed : 0
		}
		return 0
	}

	const roundCurrency = (value: number): number =>
		Number.isFinite(value) ? Number(value.toFixed(2)) : 0

	// Calculate total price based on selections
	const priceCalculation: PriceCalculation = useMemo(() => {
		if (!menuItem) {
			return {
				basePrice: 0,
				variationAdjustments: 0,
				addonsTotal: 0,
				unitPrice: 0,
				totalPrice: 0,
			}
		}

		const basePrice = toNumericValue(menuItem.basePrice)

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

		const unitPrice = roundCurrency(
			basePrice + variationAdjustments + addonsTotal
		)
		const totalPrice = roundCurrency(unitPrice * Math.max(quantity, 1))

		return {
			basePrice,
			variationAdjustments: roundCurrency(variationAdjustments),
			addonsTotal: roundCurrency(addonsTotal),
			unitPrice,
			totalPrice,
		}
	}, [addonSelections, menuItem, quantity, variationSelections])

	const areVariationRequirementsMet = useMemo(() => {
		if (!menuItem?.menu_item_variation_groups) {
			return true
		}

		return menuItem.menu_item_variation_groups.every((group: any) => {
			const selection = variationSelections.get(group.id)
			const selectionTypeCode =
				selection?.selectionTypeCode ?? group?.selection_types?.code ?? ''
			const selectedCount = selection?.selectedOptions.length ?? 0
			const multiLimit =
				selection?.multiLimit ??
				(typeof group?.multi_limit === 'number' ? group.multi_limit : 0)
			const isRequired = selectionTypeCode.includes('required')

			if (!isRequired) {
				return true
			}

			if (selectionTypeCode.startsWith('single')) {
				return selectedCount === 1
			}

			// For multi required selections, ensure at least one option is chosen
			if (selectedCount === 0) {
				return false
			}

			if (multiLimit > 0 && selectedCount > multiLimit) {
				return false
			}

			return true
		})
	}, [menuItem, variationSelections])

	const areAddonRequirementsMet = useMemo(() => {
		if (!menuItem?.menu_item_addons_menu_item_addons_menu_item_idTomenu_items) {
			return true
		}

		return menuItem.menu_item_addons_menu_item_addons_menu_item_idTomenu_items.every(
			(addon: any) => {
				if (!addon.required) {
					return true
				}
				const selection = addonSelections.get(addon.id)
				return selection?.selected === true
			}
		)
	}, [addonSelections, menuItem])

	const isActionDisabled =
		!areVariationRequirementsMet ||
		!areAddonRequirementsMet ||
		quantity < 1 ||
		!user

	const buildSelectionSnapshots = () => {
		const variationGroupsSnapshot = Array.from(
			variationSelections.values()
		).map((selection) => ({
			groupId: selection.groupId,
			groupName: selection.groupName,
			selectionTypeCode: selection.selectionTypeCode,
			multiLimit: selection.multiLimit,
			selectedOptions: selection.selectedOptions.map((option) => ({
				groupId: selection.groupId,
				optionId: option.optionId,
				optionName: option.optionName,
				priceAdjustment: option.priceAdjustment,
				menuItemId: option.menuItemId ?? null,
			})),
		}))

		const optionsSnapshot = variationGroupsSnapshot.flatMap((group) =>
			group.selectedOptions.map((option) => ({
				groupId: group.groupId,
				optionId: option.optionId,
				optionName: option.optionName,
				priceAdjustment: option.priceAdjustment,
				menuItemId: option.menuItemId ?? null,
			}))
		)

		const addonsSnapshot = Array.from(addonSelections.values())
			.filter((addon) => addon.selected)
			.map((addon) => ({
				addonId: addon.addonId,
				addonName: addon.addonName,
				price: addon.price,
			}))

		return { variationGroupsSnapshot, optionsSnapshot, addonsSnapshot }
	}

	const navigateBackToMenu = () => {
		if (navigation.canGoBack()) {
			navigation.goBack()
			return
		}

		navigation.navigate('Menu')
	}

	const getConcessionId = (): number | null => {
		if (!menuItem) {
			return null
		}

		if (typeof menuItem.concessionId === 'number') {
			return menuItem.concessionId
		}

		if (typeof menuItem.concession_id === 'number') {
			return menuItem.concession_id
		}

		if (typeof menuItem.concession?.id === 'number') {
			return menuItem.concession.id
		}

		return null
	}

	const buildOrderPayload = (): CreateOrderPayload | null => {
		const concessionId = getConcessionId()
		if (!menuItem || !user || concessionId === null) {
			return null
		}

		const { variationGroupsSnapshot, optionsSnapshot, addonsSnapshot } =
			buildSelectionSnapshots()
		const unitPrice = roundCurrency(priceCalculation.unitPrice)
		const itemTotal = roundCurrency(unitPrice * Math.max(quantity, 1))
		const total = itemTotal

		return {
			customerId: user.id,
			concessionId,
			total,
			payment_mode: {},
			concession_note: null,
			orderItems: [
				{
					menuItemId: menuItem.id,
					variationId: null,
					addon_menu_item_id: null,
					quantity,
					unitPrice,
					variation_snapshot: variationGroupsSnapshot,
					options_snapshot: optionsSnapshot,
					addons_snapshot: addonsSnapshot,
					item_total: itemTotal,
				},
			],
		}
	}

	const handleConfirmAddToCart = () => {
		if (!menuItem) {
			return
		}

		const { variationGroupsSnapshot, addonsSnapshot } =
			buildSelectionSnapshots()

		console.log('Cart item (preview only):', {
			menuItemId: menuItem.id,
			quantity,
			unitPrice: priceCalculation.unitPrice,
			totalPrice: priceCalculation.totalPrice,
			variations: variationGroupsSnapshot,
			addons: addonsSnapshot,
		})

		alertModal.showAlert({
			title: 'Added to Cart',
			message: 'Item added to cart preview. Cart storage coming soon.',
			onClose: navigateBackToMenu,
		})
	}

	const handleAddToCartPress = () => {
		if (isActionDisabled || isSubmittingOrder) {
			return
		}

		addToCartConfirmation.showConfirmation({
			title: 'Add to Cart',
			message: 'Add this item to your cart?',
			confirmText: 'Add to Cart',
			cancelText: 'Cancel',
			onConfirm: handleConfirmAddToCart,
		})
	}

	const placeOrder = async () => {
		const payload = buildOrderPayload()
		if (!payload) {
			alertModal.showAlert({
				title: 'Unable to Order',
				message: 'Please make sure you are signed in before ordering.',
			})
			return
		}

		setIsSubmittingOrder(true)
		try {
			const response = await menuApi.createOrder(payload)
			if (response.success) {
				alertModal.showAlert({
					title: 'Order Placed',
					message:
						response.message ||
						'Your order was placed successfully. We will notify you with updates.',
					onClose: navigateBackToMenu,
				})
			} else {
				alertModal.showAlert({
					title: 'Order Failed',
					message:
						response.error ||
						'Unable to place order right now. Please try again.',
				})
			}
		} catch (err) {
			alertModal.showAlert({
				title: 'Order Failed',
				message:
					err instanceof Error
						? err.message
						: 'Unexpected error occurred. Please try again.',
			})
		} finally {
			setIsSubmittingOrder(false)
		}
	}

	const handleOrderNowPress = () => {
		if (isActionDisabled || isSubmittingOrder) {
			return
		}

		orderConfirmation.showConfirmation({
			title: 'Order Now',
			message: 'Place this order now?',
			confirmText: 'Order Now',
			cancelText: 'Cancel',
			onConfirm: () => {
				void placeOrder()
			},
		})
	}

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
					disabled={isActionDisabled || isSubmittingOrder}
					isProcessing={isSubmittingOrder}
					onAddToCart={handleAddToCartPress}
					onOrderNow={handleOrderNowPress}
				/>
			</DynamicScrollView>

			<AlertModal
				visible={alertModal.visible}
				onClose={alertModal.handleClose}
				title={alertModal.title}
				message={alertModal.message}
			/>

			<ConfirmationModal
				visible={addToCartConfirmation.visible}
				onClose={addToCartConfirmation.hideConfirmation}
				title={addToCartConfirmation.props.title}
				message={addToCartConfirmation.props.message}
				confirmText={addToCartConfirmation.props.confirmText || 'Confirm'}
				cancelText={addToCartConfirmation.props.cancelText || 'Cancel'}
				onConfirm={addToCartConfirmation.props.onConfirm}
				onCancel={addToCartConfirmation.props.onCancel}
				confirmStyle={addToCartConfirmation.props.confirmStyle || 'default'}
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
		</DynamicKeyboardView>
	)
}

export default MenuItemViewScreen
