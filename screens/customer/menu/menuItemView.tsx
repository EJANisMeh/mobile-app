import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import {
	useAuthContext,
	useThemeContext,
	useOrderContext,
} from '../../../context'
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
	VariationGroupSnapshot,
	VariationOptionSnapshot,
	AddonSnapshot,
	CartItemInput,
	RawMenuItem,
	MenuItemAvailabilityStatus,
	MenuItemAvailabilitySchedule,
	ScheduleSelectionState,
	MenuItemDayKey,
	PaymentProof,
} from '../../../types'
import { menuApi } from '../../../services/api'
import {
	MenuItemHeader,
	MenuItemImages,
	MenuItemInfo,
	MenuItemVariations,
	MenuItemAddons,
	MenuItemActions,
	CustomerRequestInput,
} from '../../../components/customer/menu/menuItemView'
import { AlertModal, ConfirmationModal } from '../../../components/modals'
import {
	OrderScheduleModal,
	PaymentMethodModal,
	OrderConfirmationModal,
} from '../../../components/customer/cart'
import {
	transformRawMenuItem,
	appendCartItemForUser,
	normalizeMenuItemSchedule,
	getMenuItemAvailabilityStatus,
	getMenuItemDayKeyForDate,
	normalizeConcessionSchedule,
	hasUnavailableVariationSelections,
	hasUnavailableAddonSelections,
	CONCESSION_SCHEDULE_DAY_KEYS,
	CONCESSION_SCHEDULE_DAY_LABELS,
} from '../../../utils'
import { concessionApi } from '../../../services/api'
import type { PaymentMethodTuple } from '../../../types'

type MenuItemViewRouteProp = RouteProp<CustomerStackParamList, 'MenuItemView'>

let debug = false

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
	const orderBackend = useOrderContext()

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
	const [customerRequest, setCustomerRequest] = useState('')
	const [isAddingToCart, setIsAddingToCart] = useState(false)
	const [isOrderModalVisible, setOrderModalVisible] = useState(false)
	const [paymentModalVisible, setPaymentModalVisible] = useState(false)
	const [orderConfirmationVisible, setOrderConfirmationVisible] =
		useState(false)
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

	const menuItemId = route.params.menuItemId

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

	const normalizedSchedule = useMemo(
		() =>
			normalizeMenuItemSchedule(menuItem?.availabilitySchedule ?? undefined),
		[menuItem?.availabilitySchedule]
	)

	const availabilityStatus: MenuItemAvailabilityStatus | null = useMemo(() => {
		if (!menuItem) {
			return null
		}

		return getMenuItemAvailabilityStatus(
			normalizedSchedule,
			Boolean(menuItem.availability)
		)
	}, [menuItem, normalizedSchedule])

	const normalizedConcessionSchedule = useMemo(
		() =>
			normalizeConcessionSchedule(menuItem?.concession?.schedule ?? undefined),
		[menuItem?.concession?.schedule]
	)

	const scheduleDayDetails = useMemo(() => {
		if (!menuItem) {
			return []
		}

		const todayKey = getMenuItemDayKeyForDate(new Date())

		return CONCESSION_SCHEDULE_DAY_KEYS.map((dayKey) => ({
			key: dayKey as MenuItemDayKey,
			label: CONCESSION_SCHEDULE_DAY_LABELS[dayKey],
			isAvailable: Boolean(normalizedSchedule[dayKey as MenuItemDayKey]),
			isToday: dayKey === todayKey,
		}))
	}, [menuItem, normalizedSchedule])

	// Check if any selected variation option is out of stock
	const hasOutOfStockVariationSelection = useMemo(() => {
		return hasUnavailableVariationSelections(
			menuItem?.menu_item_variation_groups,
			variationSelections
		)
	}, [menuItem, variationSelections])

	const orderNowAllowed =
		availabilityStatus === 'available' && !hasOutOfStockVariationSelection

	// Check if any selected addons are unavailable
	const hasUnavailableAddonSelection = useMemo(() => {
		return hasUnavailableAddonSelections(
			menuItem?.menu_item_addons_menu_item_addons_menu_item_idTomenu_items,
			addonSelections
		)
	}, [menuItem, addonSelections])

	const hasAnyUnavailableSelection =
		hasOutOfStockVariationSelection || hasUnavailableAddonSelection

	// Collect all schedules from main item + selected variations + selected addons
	const allItemSchedules = useMemo(() => {
		// debugging for allItemSchedules function
		debug = false

		debug && console.log('\n--Function: allItemSchedules--')
		const schedules: (MenuItemAvailabilitySchedule | undefined | null)[] = []

		// Add main item schedule
		debug && console.log('--Adding main item schedule--')
		debug && console.log(`Menu Item ID: ${menuItem ? menuItem.id : 'null'}`)
		debug &&
			console.log(
				`Pushing Menu Item schedule: ${JSON.stringify(
					menuItem?.availabilitySchedule
				)}`
			)
		schedules.push(menuItem?.availabilitySchedule)

		// Collect variation option schedules from raw menuItem data
		debug && console.log('\n--Collecting variation option schedules--')
		if (menuItem?.menu_item_variation_groups) {
			debug &&
				console.log(
					`# of Variation groups: ${menuItem.menu_item_variation_groups.length}`
				)
			variationSelections.forEach((selection) => {
				// Find the variation group
				debug &&
					console.log(`\nFinding variation group with ID: ${selection.groupId}`)
				const varGroup = menuItem.menu_item_variation_groups.find(
					(g: any) => g.id === selection.groupId
				)
				debug &&
					console.log(
						`Found variation group: ${varGroup ? varGroup.name : 'not found'}`
					)

				if (varGroup) {
					debug &&
						console.log(
							`Selected Options for varGroup ${JSON.stringify(
								varGroup.name
							)}: ${JSON.stringify(
								selection.selectedOptions.map((o) => o.optionName)
							)}`
						)
					selection.selectedOptions.forEach((option) => {
						debug &&
							console.log(
								`Processing option with menuItemId: ${option.menuItemId}`
							)
						let optionMenuItem: any = null

						// Find the menu item based on variation group kind
						debug && console.log(`Variation group kind: ${varGroup.kind}`)
						if (varGroup.kind === 'single_category_filter') {
							debug &&
								console.log(`vargroup table: ${JSON.stringify(varGroup)}`)
							debug && console.log(`option: ${JSON.stringify(option)}`)
							optionMenuItem = varGroup.categoryMenuItems?.find(
								(mi: any) => mi.id === option.menuItemId
							)
						} else if (varGroup.kind === 'multi_category_filter') {
							debug &&
								console.log(`vargroup table: ${JSON.stringify(varGroup)}`)
							debug && console.log(`option: ${JSON.stringify(option)}`)

							optionMenuItem = varGroup.categoryMenuItems?.find(
								(mi: any) => mi.id === option.menuItemId
							)
						} else if (varGroup.kind === 'existing_items') {
							optionMenuItem = varGroup.existingMenuItems?.find(
								(item: any) => item.id === option.menuItemId
							)
							debug &&
								console.log(
									`Found option menu item for existing_items?: ${
										optionMenuItem ? optionMenuItem.id : 'not found'
									}`
								)
						} // Add the option's schedule if it exists
						debug &&
							console.log(
								`Adding option schedule: ${
									optionMenuItem?.availabilitySchedule ? 'true' : 'false'
								}`
							)
						if (optionMenuItem?.availabilitySchedule) {
							debug &&
								console.log(
									`Pushing Selected Menu Item Option schedule: ${JSON.stringify(
										optionMenuItem.availabilitySchedule
									)}`
								)
							schedules.push(optionMenuItem.availabilitySchedule)
						}
						debug &&
							console.log(
								`Added option schedule: ${
									optionMenuItem?.availabilitySchedule ? 'true' : 'false'
								}`
							)

						// Recursively collect subvariation schedules
						debug &&
							console.log(
								`Processing subvariation selections for option with menuItemId: ${option.menuItemId}`
							)
						if (option.subVariationSelections) {
							debug &&
								console.log(
									`Subvariation selections: ${JSON.stringify(
										option.subVariationSelections
									)}`
								)
							option.subVariationSelections.forEach((subSelection) => {
								// Find subvariation group
								debug &&
									console.log(
										`Finding subvariation group with ID: ${subSelection.groupId}`
									)
								const subVarGroup = optionMenuItem?.variationGroups?.find(
									(g: any) => g.id === subSelection.groupId
								)
								debug &&
									console.log(
										`Found subvariation group: ${
											subVarGroup ? subVarGroup.id : 'not found'
										}`
									)

								if (subVarGroup) {
									subSelection.selectedOptions.forEach((subOption) => {
										let subOptionMenuItem: any = null

										// Find the menu item based on subvariation group kind
										debug &&
											console.log(
												`Subvariation group kind: ${subVarGroup.kind}`
											)

										// Skip custom variation groups (group, multi_group) - they don't have menu items
										if (
											subVarGroup.kind === 'group' ||
											subVarGroup.kind === 'multi_group'
										) {
											debug &&
												console.log(
													`Skipping custom subvariation group - no menu items to check`
												)
											return
										}

										if (subVarGroup.kind === 'single_category_filter') {
											subOptionMenuItem = subVarGroup.categoryMenuItems?.find(
												(mi: any) => mi.id === subOption.menuItemId
											)
										} else if (subVarGroup.kind === 'multi_category_filter') {
											subOptionMenuItem = subVarGroup.categoryMenuItems?.find(
												(mi: any) => mi.id === subOption.menuItemId
											)
										} else if (subVarGroup.kind === 'existing_items') {
											subOptionMenuItem = subVarGroup.existingMenuItems?.find(
												(item: any) => item.id === subOption.menuItemId
											)
										}
										debug &&
											console.log(
												`SubVariation option is a menu item?: ${
													subOptionMenuItem ? 'true' : 'false'
												}`
											) // Add the suboption's schedule if it exists
										debug &&
											console.log(
												`Adding suboption schedule: ${
													subOptionMenuItem?.availabilitySchedule
														? 'true'
														: 'false'
												}`
											)
										if (subOptionMenuItem?.availabilitySchedule) {
											debug &&
												console.log(
													`Pushing Selected Suboption schedule: ${JSON.stringify(
														subOptionMenuItem.availabilitySchedule
													)}`
												)
											schedules.push(subOptionMenuItem.availabilitySchedule)
										}
									})
								}
							})
						}
					})
				}
			})
		} //--- Collect all schedules from main item + selected variations + selected addons

		// Collect addon schedules - addons are menu items themselves
		debug && console.log('\n--Collecting addon schedules--')
		if (menuItem?.menu_item_addons_menu_item_addons_menu_item_idTomenu_items) {
			debug &&
				console.log(
					`# of Addons: ${menuItem.menu_item_addons_menu_item_addons_menu_item_idTomenu_items.length}`
				)
			addonSelections.forEach((addon) => {
				if (addon.selected) {
					// Find the addon in the raw data
					debug && console.log(`Processing selected addon: ${addon.addonName}`)
					const addonData =
						menuItem.menu_item_addons_menu_item_addons_menu_item_idTomenu_items.find(
							(a: any) => a.id === addon.addonId
						)

					// Addons reference a target menu item
					const targetMenuItem =
						addonData?.menu_items_menu_item_addons_target_menu_item_idTomenu_items
					if (targetMenuItem?.availabilitySchedule) {
						debug &&
							console.log(
								`Pushing Selected Addon schedule: ${JSON.stringify(
									targetMenuItem.availabilitySchedule
								)}`
							)
						schedules.push(targetMenuItem.availabilitySchedule)
					}
				}
			})
		}
		debug && console.log(`Collected schedules: ${JSON.stringify(schedules)}`)
		debug && console.log('--End of function allItemSchedules--\n')
		if (debug) debug = false
		return schedules
	}, [menuItem, variationSelections, addonSelections])

	const orderRestrictionMessage = useMemo(() => {
		if (!menuItem || !availabilityStatus) {
			return null
		}

		// Check for out of stock or unavailable variation/addon selections first
		if (hasAnyUnavailableSelection) {
			return 'One or more selected items are out of stock or not available today. You can only schedule an advanced order.'
		}

		switch (availabilityStatus) {
			case 'out_of_stock':
				return `${menuItem.name ?? 'This item'} is out of stock right now.`
			case 'not_served_today':
				return `${
					menuItem.name ?? 'This item'
				} is not being sold today. You can schedule an advanced order on an available day.`
			default:
				return null
		}
	}, [availabilityStatus, menuItem, hasAnyUnavailableSelection])

	const isOrdering = orderBackend.isProcessing

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
				// Use menuItemBasePrice if available (for category/existing modes)
				// Otherwise use priceAdjustment (for custom mode)
				if (
					option.menuItemBasePrice !== undefined &&
					option.menuItemBasePrice !== null
				) {
					variationAdjustments += option.menuItemBasePrice
				} else {
					variationAdjustments += option.priceAdjustment
				}

				// Add subvariation prices if present
				if (option.subVariationSelections) {
					option.subVariationSelections.forEach((subSelection) => {
						subSelection.selectedOptions.forEach((subOption) => {
							variationAdjustments += subOption.priceAdjustment
						})
					})
				}
			})
		})

		// Sum addon prices
		let addonsTotal = 0
		addonSelections.forEach((addon) => {
			if (addon.selected) {
				addonsTotal += addon.price
			}
		})

		// Ensure unit price never goes below 0
		const unitPrice = Math.max(
			0,
			roundCurrency(basePrice + variationAdjustments + addonsTotal)
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

		debug = true
		debug && console.log('\n--Function: areVariationRequirementsMet--')

		return menuItem.menu_item_variation_groups.every((group: any) => {
			const selection = variationSelections.get(group.id)
			debug &&
				console.log(
					`\nChecking group: ${group.name} (ID: ${
						group.id
					}) with selection: ${JSON.stringify(selection)}`
				)
			const selectionTypeCode =
				selection?.selectionTypeCode ?? group?.selection_types?.code ?? ''
			const selectedCount = selection?.selectedOptions.length ?? 0
			const multiLimit =
				selection?.multiLimit ??
				(typeof group?.multi_limit === 'number' ? group.multi_limit : 0)
			const isRequired = selectionTypeCode.includes('required')

			debug &&
				console.log(
					`Selection Type: ${selectionTypeCode}, Selected Count: ${selectedCount}, Multi Limit: ${multiLimit}, Is Required: ${isRequired}`
				)

			if (selectionTypeCode.startsWith('single')) {
				if (isRequired && selectedCount < 1) {
					return false
				}
			} else {
				// For multi required selections, ensure at least one option is chosen
				if (isRequired && selectedCount < 1) {
					return false
				}

				if (multiLimit > 0 && selectedCount > multiLimit) {
					return false
				}
			}
			debug &&
				console.log(
					`--Checking subvariation requirements for group: ${group.name} (ID: ${group.id})--`
				)
			// Check subvariation requirements for selected options
			debug &&
				console.log(
					`Selected options count: ${selection?.selectedOptions.length}`
				)
			if (selection && selection.selectedOptions.length > 0) {
				for (const option of selection.selectedOptions) {
					if (option.subVariationSelections) {
						// Iterate through the subvariation selections Map
						for (const [
							subGroupId,
							subSelection,
						] of option.subVariationSelections.entries()) {
							const subSelectionTypeCode = subSelection.selectionTypeCode || ''
							const subSelectedCount = subSelection.selectedOptions.length
							const subIsRequired = subSelectionTypeCode.includes('required')

							debug &&
								console.log(
									`Checking subvariation group ID: ${subGroupId}, Required: ${subIsRequired}, Selected Count: ${subSelectedCount}`
								)

							if (!subIsRequired) {
								continue
							}

							if (subSelectionTypeCode.startsWith('single')) {
								if (subSelectedCount !== 1) {
									return false
								}
							} else {
								// Multi required
								if (subSelectedCount === 0) {
									return false
								}

								const subMultiLimit = subSelection.multiLimit || 0
								if (subMultiLimit > 0 && subSelectedCount > subMultiLimit) {
									return false
								}
							}
						}
					}
				}
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

	const orderSummary = useMemo(() => {
		if (
			!menuItem ||
			!pendingScheduleSelection ||
			!selectedPaymentMethod ||
			!concessionPaymentMethods
		) {
			return null
		}

		const paymentTuple = concessionPaymentMethods.find(
			([method]) => method === selectedPaymentMethod
		)

		if (!paymentTuple) {
			return null
		}

		// Build item details with variations and addons
		const { variationGroupsSnapshot, optionsSnapshot, addonsSnapshot } =
			buildSelectionSnapshots()

		return {
			items: [
				{
					name: menuItem.name,
					quantity,
					unitPrice: priceCalculation.unitPrice,
					totalPrice: priceCalculation.totalPrice,
					variationGroups: variationGroupsSnapshot,
					addons: addonsSnapshot,
					customer_request: customerRequest.trim() || null,
				},
			],
			total: priceCalculation.totalPrice,
			orderMode: pendingScheduleSelection.mode,
			scheduledFor: pendingScheduleSelection.scheduledAt,
			paymentMethod: paymentTuple[0],
			paymentDetails: paymentTuple[1],
			paymentProof: selectedPaymentProof,
			concessionName:
				menuItem.concession?.name ||
				menuItem.concession?.concession_name ||
				'Unknown',
		}
	}, [
		menuItem,
		quantity,
		priceCalculation.totalPrice,
		priceCalculation.unitPrice,
		pendingScheduleSelection,
		selectedPaymentMethod,
		selectedPaymentProof,
		concessionPaymentMethods,
		customerRequest,
		variationSelections,
		addonSelections,
	])

	const isActionDisabled =
		!areVariationRequirementsMet ||
		!areAddonRequirementsMet ||
		quantity < 1 ||
		isAddingToCart ||
		isOrdering

	function buildSelectionSnapshots(): {
		variationGroupsSnapshot: VariationGroupSnapshot[]
		optionsSnapshot: VariationOptionSnapshot[]
		addonsSnapshot: AddonSnapshot[]
	} {
		const variationGroupsSnapshot = Array.from(
			variationSelections.values()
		).map((selection) => ({
			groupId: selection.groupId,
			groupName: selection.groupName,
			selectionTypeCode: selection.selectionTypeCode,
			multiLimit: selection.multiLimit,
			selectedOptions: selection.selectedOptions.map((option) => {
				const optionSnapshot: VariationOptionSnapshot = {
					groupId: selection.groupId,
					optionId: option.optionId,
					optionName: option.optionName,
					priceAdjustment: option.priceAdjustment,
					menuItemId: option.menuItemId ?? null,
				}

				// Include subvariation data if present
				if (
					option.subVariationSelections &&
					option.subVariationSelections.size > 0
				) {
					optionSnapshot.subVariationGroups = Array.from(
						option.subVariationSelections.values()
					).map((subSelection) => ({
						groupId: subSelection.groupId,
						groupName: subSelection.groupName,
						selectionTypeCode: subSelection.selectionTypeCode,
						multiLimit: subSelection.multiLimit,
						selectedOptions: subSelection.selectedOptions.map((subOption) => ({
							groupId: subSelection.groupId,
							optionId: subOption.optionId,
							optionName: subOption.optionName,
							priceAdjustment: subOption.priceAdjustment,
							menuItemId: subOption.menuItemId ?? null,
						})),
					}))
				}

				return optionSnapshot
			}),
		}))

		const optionsSnapshot = variationGroupsSnapshot.flatMap((group) =>
			group.selectedOptions.map((option) => ({
				groupId: group.groupId,
				optionId: option.optionId,
				optionName: option.optionName,
				priceAdjustment: option.priceAdjustment,
				menuItemId: option.menuItemId ?? null,
				subVariationGroups: option.subVariationGroups, // Include subvariations in flat list too
			}))
		)

		debug = true
		debug && console.log('\n--Function: buildSelectionSnapshots--')
		debug &&
			console.log(
				`Variation Groups Snapshot: ${JSON.stringify(
					variationGroupsSnapshot,
					null,
					2
				)}`
			)
		debug &&
			console.log(
				`Options Snapshot: ${JSON.stringify(optionsSnapshot, null, 2)}`
			)
		const addonsSnapshot = Array.from(addonSelections.values())
			.filter((addon) => addon.selected)
			.map((addon) => {
				// Find the addon data to get target menu item ID
				debug && console.log(`Processing addon with ID: ${addon.addonId}`)
				const addonData =
					menuItem?.menu_item_addons_menu_item_addons_menu_item_idTomenu_items?.find(
						(a: any) => a.id === addon.addonId
					)
				debug &&
					console.log(`Found addon data: ${addonData ? 'true' : 'false'}`)

				return {
					addonId: addon.addonId,
					addonName: addon.addonName,
					price: addon.price,
					menuItemId: addonData?.target_menu_item?.id ?? null,
				}
			})
		debug &&
			console.log(`Addons Snapshot: ${JSON.stringify(addonsSnapshot, null, 2)}`)
		debug && console.log('--End of function buildSelectionSnapshots--\n')
		if (debug) debug = false

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

	const buildOrderPayload = (
		selection: ScheduleSelectionState
	): CreateOrderPayload | null => {
		const concessionId = getConcessionId()
		if (!menuItem || !user || concessionId === null) {
			return null
		}

		const { variationGroupsSnapshot, optionsSnapshot, addonsSnapshot } =
			buildSelectionSnapshots()
		const unitPrice = roundCurrency(priceCalculation.unitPrice)
		const itemTotal = roundCurrency(unitPrice * Math.max(quantity, 1))
		const total = itemTotal
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
			concessionId,
			total,
			payment_mode,
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
					customer_request: customerRequest.trim() || null,
				},
			],
		}
	}

	const handleConfirmAddToCart = async (): Promise<void> => {
		if (!menuItem) {
			return
		}

		if (!user) {
			alertModal.showAlert({
				title: 'Sign In Required',
				message: 'Please sign in to add items to your cart.',
			})
			return
		}

		const concessionId = getConcessionId()
		if (concessionId === null) {
			alertModal.showAlert({
				title: 'Unable to Add Item',
				message:
					'This item is missing concession details. Please try again later.',
			})
			return
		}

		const { variationGroupsSnapshot, optionsSnapshot, addonsSnapshot } =
			buildSelectionSnapshots()

		const transformedItem = transformRawMenuItem(menuItem as RawMenuItem)
		const sanitizedQuantity = Math.max(1, quantity)
		const unitPrice = roundCurrency(priceCalculation.unitPrice)
		const concessionName =
			typeof menuItem.concession?.name === 'string'
				? menuItem.concession.name
				: null

		const cartItemInput: CartItemInput = {
			menuItemId: menuItem.id,
			concessionId,
			concessionName,
			name: menuItem.name ?? transformedItem.name,
			description: menuItem.description ?? null,
			image: transformedItem.imageToDisplay,
			categoryName: transformedItem.category?.name ?? null,
			quantity: sanitizedQuantity,
			unitPrice,
			variationGroups: variationGroupsSnapshot,
			variationOptions: optionsSnapshot,
			addons: addonsSnapshot,
			customer_request: customerRequest.trim() || null,
		}

		try {
			setIsAddingToCart(true)
			await appendCartItemForUser(user.id, cartItemInput)
			alertModal.showAlert({
				title: 'Added to Cart',
				message: 'This item was added to your cart.',
			})
		} catch (err) {
			console.error('Add to cart error:', err)
			alertModal.showAlert({
				title: 'Add to Cart Failed',
				message:
					err instanceof Error
						? err.message
						: 'We could not add this item to your cart. Please try again.',
			})
		} finally {
			setIsAddingToCart(false)
		}
	}

	const handleAddToCartPress = () => {
		if (isActionDisabled || isOrdering) {
			return
		}

		addToCartConfirmation.showConfirmation({
			title: 'Add to Cart',
			message: 'Add this item to your cart?',
			confirmText: 'Add to Cart',
			cancelText: 'Cancel',
			onConfirm: () => {
				void handleConfirmAddToCart()
			},
		})
	}

	const placeOrder = async (selection: ScheduleSelectionState) => {
		const payload = buildOrderPayload(selection)
		if (!payload) {
			alertModal.showAlert({
				title: 'Unable to Order',
				message: 'Please make sure you are signed in before ordering.',
			})
			return
		}

		try {
			const response = await orderBackend.createOrder(payload)
			if (response.success) {
				alertModal.showAlert({
					title: 'Order Placed',
					message:
						response.message ||
						'Your order was placed successfully. We will notify you with updates.',
					onClose: navigateBackToMenu,
				})
			} else if (
				'reasons' in response &&
				Array.isArray(response.reasons) &&
				response.reasons.length > 0
			) {
				const reasonsList = response.reasons
					.map((reason: string, index: number) => `${index + 1}. ${reason}`)
					.join('\n')

				alertModal.showAlert({
					title: 'Order Failed',
					message: `${response.error}\n\n${reasonsList}`,
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
		}
	}

	const handleStartOrderFlow = () => {
		if (isActionDisabled) {
			return
		}

		if (!user) {
			alertModal.showAlert({
				title: 'Sign In Required',
				message: 'Please sign in to place an order.',
			})
			return
		}

		// Console logs to help understand data structure

		setOrderModalVisible(true)
	}

	const handleOrderModalClose = () => {
		setOrderModalVisible(false)
	}

	const handlePaymentModalClose = () => {
		setPaymentModalVisible(false)
	}

	const handleResetOrderFlow = () => {
		setOrderModalVisible(false)
		setPaymentModalVisible(false)
		setPendingScheduleSelection(null)
		setSelectedPaymentMethod(null)
		setConcessionPaymentMethods([])
		setPaymentMethodsLoading(false)
	}

	const handleScheduleSelectionConfirm = async (
		selection: ScheduleSelectionState
	) => {
		setPendingScheduleSelection(selection)
		setOrderModalVisible(false)

		// Fetch concession payment methods
		if (!menuItem?.concession?.id) {
			alertModal.showAlert({
				title: 'Unable to Continue',
				message: 'Concession information is missing. Please try again.',
			})
			handleResetOrderFlow()
			return
		}

		setPaymentMethodsLoading(true)
		try {
			const response = await concessionApi.getConcession(menuItem.concession.id)
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

		if (!pendingScheduleSelection) {
			alertModal.showAlert({
				title: 'Unable to Continue',
				message: 'Something went wrong. Please try again.',
			})
			handleResetOrderFlow()
			return
		}

		// Show order confirmation modal
		setOrderConfirmationVisible(true)
	}

	const handleConfirmOrder = () => {
		if (!pendingScheduleSelection) {
			alertModal.showAlert({
				title: 'Unable to Continue',
				message: 'Something went wrong. Please try again.',
			})
			handleResetOrderFlow()
			return
		}

		setOrderConfirmationVisible(false)
		void placeOrder(pendingScheduleSelection)
	}

	const handleOrderConfirmationClose = () => {
		setOrderConfirmationVisible(false)
		setPaymentModalVisible(true)
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
		<DynamicKeyboardView useSafeArea={true}>
			<DynamicScrollView showsVerticalScrollIndicator={false}>
				{/* Header: Name and Categories */}
				<MenuItemHeader menuItem={menuItem} />
				{/* Images Carousel */}
				{menuItem.images && menuItem.images.length > 0 && (
					<MenuItemImages images={menuItem.images} />
				)}
				{/* Description and schedule */}
				{(menuItem.description || scheduleDayDetails.length > 0) && (
					<MenuItemInfo
						menuItem={menuItem}
						showPrice={false}
						scheduleDays={scheduleDayDetails}
						availabilityStatus={availabilityStatus}
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
							concessionId={menuItem.concessionId}
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
				{/* Customer Request Section */}
				<CustomerRequestInput
					customerRequest={customerRequest}
					onChangeRequest={setCustomerRequest}
				/>
				{/* Bottom Actions: Add to Cart / Order Flow */}
				<MenuItemActions
					disabled={isActionDisabled}
					isProcessing={isOrdering}
					onAddToCart={handleAddToCartPress}
					onStartOrder={handleStartOrderFlow}
					orderNowAllowed={orderNowAllowed}
					orderRestrictionMessage={orderRestrictionMessage}
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
			<OrderScheduleModal
				visible={isOrderModalVisible}
				onClose={handleOrderModalClose}
				onConfirm={handleScheduleSelectionConfirm}
				schedule={menuItem.availabilitySchedule}
				concessionSchedule={normalizedConcessionSchedule}
				availabilityStatus={availabilityStatus ?? 'not_served_today'}
				isConcessionOpen={Boolean(menuItem.concession?.is_open)}
				itemName={menuItem.name ?? 'this item'}
				hasOutOfStockVariationSelection={hasAnyUnavailableSelection}
				itemSchedules={allItemSchedules}
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

export default MenuItemViewScreen
