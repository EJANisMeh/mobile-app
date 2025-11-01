import React, { useState, useEffect } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	BackHandler,
	Image,
	ScrollView,
} from 'react-native'
import {
	useNavigation,
	useRoute,
	RouteProp,
	useFocusEffect,
} from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext, useConcessionContext } from '../../../context'
import { useResponsiveDimensions, useHideNavBar } from '../../../hooks'
import { useCategoryBackend } from '../../../hooks/useBackend/useCategoryBackend'
import { useMenuBackend } from '../../../hooks/useBackend/useMenuBackend'
import {
	useAlertModal,
	useConfirmationModal,
	useMenuModal,
} from '../../../hooks/useModals'
import { createConcessionaireMenuStyles } from '../../../styles/concessionaire'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'
import {
	AlertModal,
	ConfirmationModal,
	MenuModal,
} from '../../../components/modals'
import {
	NameInput,
	DescriptionInput,
	BasePriceInput,
	CategorySelector,
	ImagePickerSection,
} from '../../../components/concessionaire/menu/addItem'
import { apiCall } from '../../../services/api/api'
import {
	AddMenuItemFormData,
	ConcessionaireStackParamList,
	VariationGroupInput,
	VariationOptionInput,
	AddonInput,
	SelectionType,
} from '../../../types'

type AddMenuItemScreenNavigationProp = StackNavigationProp<
	ConcessionaireStackParamList,
	'AddMenuItem'
>
type AddMenuItemScreenRouteProp = RouteProp<
	ConcessionaireStackParamList,
	'AddMenuItem'
>

const AddMenuItemScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireMenuStyles(colors, responsive)
	const navigation = useNavigation<AddMenuItemScreenNavigationProp>()
	const { concession } = useConcessionContext()

	const {
		visible: alertModalVisible,
		title: alertModalTitle,
		message: alertModalMessage,
		showAlert,
		hideAlert,
		handleClose: handleCloseAlertModal,
	} = useAlertModal()
	const confirmationModal = useConfirmationModal()
	const {
		visible: menuModalVisible,
		props: menuModalProps,
		hideMenu: hideMenuModal,
		showMenu: showMenuModal,
	} = useMenuModal()
	const {
		categories,
		loading: categoriesLoading,
		getCategories,
	} = useCategoryBackend()
	const {
		menuItems,
		loading: menuItemsLoading,
		getMenuItems,
	} = useMenuBackend()

	useHideNavBar()

	// Form state
	const [formData, setFormData] = useState<AddMenuItemFormData>({
		name: '',
		description: '',
		basePrice: '',
		images: [],
		displayImageIndex: 0,
		categoryId: null,
		availability: true,
		variationGroups: [],
		addons: [],
	})

	const [hasChanges, setHasChanges] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [selectionTypes, setSelectionTypes] = useState<SelectionType[]>([])
	const [loadingSelectionTypes, setLoadingSelectionTypes] = useState(false)

	// Load categories on mount and when returning from category management
	useFocusEffect(
		React.useCallback(() => {
			if (concession?.id) {
				getCategories(concession.id)
				getMenuItems(concession.id)
			}
			// Load selection types
			loadSelectionTypes()
		}, [concession?.id])
	)

	const loadSelectionTypes = async () => {
		setLoadingSelectionTypes(true)
		try {
			const data = await apiCall('/menu/selection-types')
			if (data.success && data.selectionTypes) {
				setSelectionTypes(data.selectionTypes)
			} else {
				console.error('Failed to load selection types:', data.error)
			}
		} catch (error) {
			console.error('Failed to load selection types:', error)
		} finally {
			setLoadingSelectionTypes(false)
		}
	}

	// Track changes
	useEffect(() => {
		const changed =
			formData.name.trim() !== '' ||
			formData.description.trim() !== '' ||
			formData.basePrice.trim() !== '' ||
			formData.images.length > 0 ||
			formData.categoryId !== null

		setHasChanges(changed)
	}, [formData])

	// Handle back button
	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				handleCancel()
				return true
			}
		)

		return () => backHandler.remove()
	}, [hasChanges])

	const handleCancel = () => {
		if (hasChanges) {
			confirmationModal.showConfirmation({
				title: 'Discard Changes',
				message: 'You have unsaved changes. Discard them?',
				confirmText: 'Discard',
				cancelText: 'Keep Editing',
				confirmStyle: 'destructive',
				onConfirm: () => navigation.goBack(),
			})
		} else {
			navigation.goBack()
		}
	}

	// Compute quick validity (no side-effects) will be computed after validateForm is declared

	const validateForm = (setErrorMsgs = true) => {
		const newErrors: Record<string, string> = {}
		// name
		if (!formData.name.trim()) {
			newErrors['name'] = 'Item name is required'
		}
		// category
		if (!formData.categoryId) {
			newErrors['category'] = 'Category is required'
		}
		// basePrice if provided must be a valid number >= 0
		if (formData.basePrice.trim()) {
			const p = parseFloat(formData.basePrice)
			if (isNaN(p) || p < 0) {
				newErrors['basePrice'] = 'Enter a valid price or leave empty'
			}
		}

		// Variation groups validations
		formData.variationGroups.forEach((group, i) => {
			const prefix = `variation-${i}`
			if (!group.name.trim()) {
				newErrors[`${prefix}-name`] = 'Group name is required'
			}
			const selType = selectionTypes.find((t) => t.id === group.selectionTypeId)
			const isMulti = selType?.code?.startsWith('multi')
			if (isMulti) {
				if (!group.multiLimit && group.multiLimit !== 0) {
					newErrors[`${prefix}-multiLimit`] =
						'Limit is required for multi selection types'
				}
			}
			if (group.mode === 'custom') {
				if (!group.options || group.options.length < 2) {
					newErrors[`${prefix}-options`] =
						'Add at least 2 options for custom mode'
				}
				// check each option name
				group.options.forEach((opt, j) => {
					if (!opt.name.trim()) {
						newErrors[`${prefix}-option-${j}`] = 'Option name required'
					}
				})
			} else if (group.mode === 'category') {
				if (!group.categoryFilterId) {
					newErrors[`${prefix}-categoryFilterId`] =
						'Select a category for this mode'
				}
			} else if (group.mode === 'existing') {
				const ids = (group as any).existingMenuItemIds || []
				if (!ids || ids.length < 2) {
					newErrors[`${prefix}-existing`] = 'Select at least 2 existing items'
				}
			}
		})

		if (setErrorMsgs) setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	// Live validation on form data changes
	useEffect(() => {
		validateForm(true)
	}, [formData, selectionTypes])

	// compute validity (no side-effects)
	const isFormValid = validateForm(false)

	const handleSave = () => {
		const valid = validateForm(true)
		if (!valid) {
			// focus/notify by modal briefly
			showAlert({
				title: 'Validation Error',
				message: 'Please fix the highlighted fields before saving',
			})
			return
		}

		confirmationModal.showConfirmation({
			title: 'Add Item',
			message: 'Add this item to your menu?',
			confirmText: 'Add',
			cancelText: 'Cancel',
			onConfirm: async () => {
				try {
					const response = await apiCall('/menu/add', {
						method: 'POST',
						body: JSON.stringify({
							concessionId: concession?.id,
							name: formData.name.trim(),
							description: formData.description.trim() || null,
							basePrice: formData.basePrice || '0',
							images: formData.images,
							displayImageIndex: formData.displayImageIndex,
							categoryId: formData.categoryId,
							availability: formData.availability,
							variationGroups: formData.variationGroups.map((group) => ({
								name: group.name.trim(),
								selectionTypeId: group.selectionTypeId,
								multiLimit: group.multiLimit,
								mode: group.mode,
								categoryFilterId: group.categoryFilterId,
								options: group.options.map((opt) => ({
									name: opt.name.trim(),
									priceAdjustment: opt.priceAdjustment,
									isDefault: opt.isDefault,
									availability: opt.availability,
									position: opt.position,
								})),
								existingMenuItemIds: (group as any).existingMenuItemIds || [],
								position: group.position,
							})),
							addons: formData.addons.map((addon) => ({
								menuItemId: addon.menuItemId,
								label: addon.label?.trim() || null,
								priceOverride: addon.priceOverride,
								required: addon.required,
								position: addon.position,
							})),
						}),
					})

					if (response.success) {
						showAlert({
							title: 'Success',
							message: 'Item added successfully!',
						})
						navigation.goBack()
					} else {
						showAlert({
							title: 'Error',
							message: response.error || 'Failed to add item',
						})
					}
				} catch (error) {
					console.error('Error adding item:', error)
					showAlert({
						title: 'Error',
						message: 'Failed to add item. Please try again.',
					})
				}
			},
		})
	}

	// Variation Group Handlers
	const handleAddVariationGroup = () => {
		const newGroup: VariationGroupInput = {
			name: '',
			selectionTypeId: 1, // Default to first selection type
			multiLimit: null,
			mode: 'custom',
			categoryFilterId: null,
			options: [],
			existingMenuItemIds: [],
			position: formData.variationGroups.length,
		}
		setFormData((prev) => ({
			...prev,
			variationGroups: [...prev.variationGroups, newGroup],
		}))
	}

	const handleRemoveVariationGroup = (index: number) => {
		confirmationModal.showConfirmation({
			title: 'Remove Variation Group',
			message: 'Remove this variation group?',
			confirmText: 'Remove',
			cancelText: 'Cancel',
			confirmStyle: 'destructive',
			onConfirm: () => {
				setFormData((prev) => ({
					...prev,
					variationGroups: prev.variationGroups.filter((_, i) => i !== index),
				}))
			},
		})
	}

	const handleUpdateVariationGroup = (
		index: number,
		field: keyof VariationGroupInput,
		value: any
	) => {
		setFormData((prev) => ({
			...prev,
			variationGroups: prev.variationGroups.map((group, i) =>
				i === index ? { ...group, [field]: value } : group
			),
		}))
	}

	const handleAddVariationOption = (groupIndex: number) => {
		const newOption: VariationOptionInput = {
			name: '',
			priceAdjustment: '0',
			availability: true,
			isDefault: false,
			position: formData.variationGroups[groupIndex].options.length,
		}
		setFormData((prev) => ({
			...prev,
			variationGroups: prev.variationGroups.map((group, i) =>
				i === groupIndex
					? { ...group, options: [...group.options, newOption] }
					: group
			),
		}))
	}

	const handleRemoveVariationOption = (
		groupIndex: number,
		optionIndex: number
	) => {
		setFormData((prev) => ({
			...prev,
			variationGroups: prev.variationGroups.map((group, i) =>
				i === groupIndex
					? {
							...group,
							options: group.options.filter((_, j) => j !== optionIndex),
					  }
					: group
			),
		}))
	}

	const handleUpdateVariationOption = (
		groupIndex: number,
		optionIndex: number,
		field: keyof VariationOptionInput,
		value: any
	) => {
		setFormData((prev) => ({
			...prev,
			variationGroups: prev.variationGroups.map((group, i) =>
				i === groupIndex
					? {
							...group,
							options: group.options.map((option, j) =>
								j === optionIndex ? { ...option, [field]: value } : option
							),
					  }
					: group
			),
		}))
	}

	// Add-on Handlers
	const handleAddAddon = () => {
		if (menuItems.length === 0) {
			showAlert({
				title: 'No Menu Items',
				message: 'Create some menu items first to use as add-ons',
			})
			return
		}

		const menuItemOptions = menuItems.map((item) => ({
			label: `${item.name} - ₱${item.basePrice}`,
			value: item.id,
		}))

		showMenuModal({
			title: 'Select Menu Item',
			options: menuItemOptions,
			onSelect: (menuItemId: number) => {
				const selectedItem = menuItems.find((item) => item.id === menuItemId)
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

	if (categoriesLoading && categories.length === 0) {
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

	return (
		<DynamicKeyboardView style={styles.categoryManagementContainer}>
			<DynamicScrollView showsVerticalScrollIndicator={false}>
				{/* Item Name */}
				<NameInput
					formData={formData}
					setFormData={setFormData}
					errors={errors}
				/>

				{/* Description */}
				<DescriptionInput
					formData={formData}
					setFormData={setFormData}
				/>

				{/* Base Price */}
				<BasePriceInput
					formData={formData}
					setFormData={setFormData}
					errors={errors}
				/>

				{/* Category Selector */}
				<CategorySelector
					formData={formData}
					setFormData={setFormData}
					errors={errors}
					showMenu={showMenuModal}
					hideMenu={hideMenuModal}
				/>

				{/* Images Section */}
				<ImagePickerSection
					formData={formData}
					setFormData={setFormData}
					showAlert={showAlert}
				/>

				{/* Variations Section */}
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginBottom: 8,
					}}>
					<Text style={[styles.sectionTitle, { marginBottom: 0, flex: 1 }]}>
						Variations (Optional)
					</Text>
					<TouchableOpacity
						style={{ padding: 6 }}
						onPress={() =>
							showAlert({
								title: 'Variations Help',
								message:
									'Variations: group of choices for your menu item (e.g., sizes, toppings, rice type, etc.)',
							})
						}>
						<Text style={{ color: colors.primary, fontWeight: '600' }}>?</Text>
					</TouchableOpacity>
				</View>
				{formData.variationGroups.map((group, groupIndex) => (
					<View
						key={groupIndex}
						style={{
							backgroundColor: colors.surface,
							borderRadius: 8,
							padding: 12,
							marginBottom: 12,
							borderWidth: 1,
							borderColor: colors.border,
						}}>
						{/* Group Header */}
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginBottom: 8,
								gap: 8,
							}}>
							<Text
								style={{
									fontSize: 14,
									fontWeight: '600',
									color: colors.text,
									flex: 1,
								}}>
								Variation Group {groupIndex + 1}
							</Text>
							<TouchableOpacity
								onPress={() => handleRemoveVariationGroup(groupIndex)}>
								<Ionicons
									name="trash-outline"
									size={20}
									color="#ef4444"
								/>
							</TouchableOpacity>
						</View>
						{/* Group Name */}
						<View
							style={[
								styles.categoryInputContainer,
								{ marginBottom: 8, borderWidth: 1, borderColor: colors.border },
							]}>
							<TextInput
								style={styles.categoryInput}
								value={group.name}
								onChangeText={(text) =>
									handleUpdateVariationGroup(groupIndex, 'name', text)
								}
								placeholder="Group name (e.g., Size, Toppings)"
								placeholderTextColor={colors.textSecondary}
							/>
						</View>
						{errors[`variation-${groupIndex}-name`] && (
							<Text style={{ color: '#ef4444', marginBottom: 8 }}>
								{errors[`variation-${groupIndex}-name`]}
							</Text>
						)}
						{/* Mode Selection */}
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginBottom: 4,
							}}>
							<Text style={{ fontSize: 12, color: colors.text, flex: 1 }}>
								Mode:
							</Text>
							<TouchableOpacity
								style={{ padding: 6 }}
								onPress={() =>
									showAlert({
										title: 'Mode Help',
										message:
											'Custom: options specific to this menu item.\n\nCategory: include all menu items in a specified category.\n\nExisting Items: include individual existing items as options.',
									})
								}>
								<Text style={{ color: colors.primary, fontWeight: '600' }}>
									?
								</Text>
							</TouchableOpacity>
						</View>
						<View
							style={{
								flexDirection: 'row',
								gap: 8,
								marginBottom: 8,
								flexWrap: 'wrap',
							}}>
							{(['custom', 'category', 'existing'] as const).map((mode) => (
								<TouchableOpacity
									key={mode}
									onPress={() =>
										handleUpdateVariationGroup(groupIndex, 'mode', mode)
									}
									style={{
										paddingVertical: 6,
										paddingHorizontal: 12,
										borderRadius: 6,
										backgroundColor:
											group.mode === mode ? colors.primary : colors.background,
										borderWidth: 1,
										borderColor: colors.border,
									}}>
									<Text
										style={{
											fontSize: 12,
											color: group.mode === mode ? '#fff' : colors.text,
											fontWeight: group.mode === mode ? '600' : '400',
										}}>
										{mode === 'custom'
											? 'Custom'
											: mode === 'category'
											? 'Category'
											: 'Existing Items'}
									</Text>
								</TouchableOpacity>
							))}
						</View>
						{/* Category Filter (for category mode) */}
						{group.mode === 'category' && (
							<TouchableOpacity
								style={[styles.categoryInputContainer, { marginBottom: 8 }]}
								onPress={() => {
									const categoryOptions = categories.map((cat) => ({
										label: cat.name,
										value: cat.id,
									}))
									showMenuModal({
										title: 'Filter by Category',
										options: categoryOptions,
										onSelect: (value: number) => {
											handleUpdateVariationGroup(
												groupIndex,
												'categoryFilterId',
												value
											)
										},
									})
								}}>
								<Text
									style={[
										styles.categoryInput,
										!group.categoryFilterId && {
											color: colors.textSecondary,
										},
									]}>
									{group.categoryFilterId
										? categories.find((c) => c.id === group.categoryFilterId)
												?.name
										: 'Select category'}
								</Text>
								<Ionicons
									name="chevron-down"
									size={16}
									color={colors.textSecondary}
								/>
							</TouchableOpacity>
						)}
						{errors[`variation-${groupIndex}-categoryFilterId`] && (
							<Text style={{ color: '#ef4444', marginTop: 4, marginBottom: 8 }}>
								{errors[`variation-${groupIndex}-categoryFilterId`]}
							</Text>
						)}
						{/* Selection Type */}
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginBottom: 4,
							}}>
							<Text style={{ fontSize: 12, color: colors.text, flex: 1 }}>
								Selection Type:
							</Text>
							<TouchableOpacity
								style={{ padding: 6 }}
								onPress={() =>
									showAlert({
										title: 'Selection Type Help',
										message:
											'Single - Required: user must pick exactly one option.\n\nSingle - Optional: user can pick zero or one.\n\nMulti - Required: user must pick at least one up to the limit.\n\nMulti - Optional: user can pick zero or more up to the limit.',
									})
								}>
								<Text style={{ color: colors.primary, fontWeight: '600' }}>
									?
								</Text>
							</TouchableOpacity>
						</View>
						<TouchableOpacity
							style={[styles.categoryInputContainer, { marginBottom: 8 }]}
							onPress={() => {
								const typeOptions = selectionTypes.map((type) => ({
									label: type.code,
									value: type.id,
								}))
								showMenuModal({
									title: 'Select Type',
									options: typeOptions,
									onSelect: (value: number) => {
										handleUpdateVariationGroup(
											groupIndex,
											'selectionTypeId',
											value
										)
									},
								})
							}}>
							<Text style={styles.categoryInput}>
								{selectionTypes.find((t) => t.id === group.selectionTypeId)
									?.code || 'Select type'}
							</Text>
							<Ionicons
								name="chevron-down"
								size={16}
								color={colors.textSecondary}
							/>
						</TouchableOpacity>
						{/* Multi limit input for multi selection types */}
						{(
							selectionTypes.find((t) => t.id === group.selectionTypeId)
								?.code || ''
						).startsWith('multi') && (
							<View style={{ marginBottom: 8 }}>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										marginBottom: 4,
									}}>
									<Text style={{ fontSize: 12, color: colors.text, flex: 1 }}>
										Limit
									</Text>
									<TouchableOpacity
										style={{ padding: 6 }}
										onPress={() =>
											showAlert({
												title: 'Limit Help',
												message:
													'Limit: refers to up to how many choices user is required to enter.',
											})
										}>
										<Text style={{ color: colors.primary, fontWeight: '600' }}>
											?
										</Text>
									</TouchableOpacity>
								</View>
								<TextInput
									style={styles.categoryInput}
									value={group.multiLimit?.toString() || ''}
									onChangeText={(text) => {
										const num = text.trim() === '' ? null : parseInt(text, 10)
										handleUpdateVariationGroup(groupIndex, 'multiLimit', num)
										// clear error if any
										setErrors((prev) => ({
											...prev,
											[`variation-${groupIndex}-multiLimit`]: '',
										}))
									}}
									placeholder="Max choices"
									keyboardType="number-pad"
									placeholderTextColor={colors.textSecondary}
								/>
								{errors[`variation-${groupIndex}-multiLimit`] && (
									<Text style={{ color: '#ef4444', marginTop: 4 }}>
										{errors[`variation-${groupIndex}-multiLimit`]}
									</Text>
								)}
							</View>
						)}
						{/* Custom Options (for custom mode only) */}
						{group.mode === 'custom' && (
							<>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										marginBottom: 4,
									}}>
									<Text style={{ fontSize: 12, color: colors.text, flex: 1 }}>
										Options:
									</Text>
									<TouchableOpacity
										style={{ padding: 6 }}
										onPress={() =>
											showAlert({
												title: 'Options Help',
												message:
													'Options: name of option and additional price of the option',
											})
										}>
										<Text style={{ color: colors.primary, fontWeight: '600' }}>
											?
										</Text>
									</TouchableOpacity>
								</View>
								{group.options.map((option, optionIndex) => (
									<React.Fragment key={optionIndex}>
										<View
											style={{
												flexDirection: 'row',
												gap: 8,
												marginBottom: 8,
												alignItems: 'center',
											}}>
											<TextInput
												style={[styles.categoryInput, { flex: 2 }]}
												value={option.name}
												onChangeText={(text) =>
													handleUpdateVariationOption(
														groupIndex,
														optionIndex,
														'name',
														text
													)
												}
												placeholder="Option name"
												placeholderTextColor={colors.textSecondary}
											/>
											<View style={{ flexDirection: 'row', flex: 1, gap: 4 }}>
												<Text
													style={{
														fontSize: 14,
														color: colors.text,
														alignSelf: 'center',
													}}>
													₱
												</Text>
												<TextInput
													style={[styles.categoryInput, { flex: 1 }]}
													value={option.priceAdjustment}
													onChangeText={(text) =>
														handleUpdateVariationOption(
															groupIndex,
															optionIndex,
															'priceAdjustment',
															text
														)
													}
													placeholder="0.00"
													placeholderTextColor={colors.textSecondary}
													keyboardType="decimal-pad"
												/>
											</View>
											<TouchableOpacity
												onPress={() =>
													handleRemoveVariationOption(groupIndex, optionIndex)
												}>
												<Ionicons
													name="close-circle"
													size={20}
													color="#ef4444"
												/>
											</TouchableOpacity>
										</View>
										{errors[
											`variation-${groupIndex}-option-${optionIndex}`
										] && (
											<Text style={{ color: '#ef4444', marginBottom: 8 }}>
												{
													errors[
														`variation-${groupIndex}-option-${optionIndex}`
													]
												}
											</Text>
										)}
									</React.Fragment>
								))}
								{errors[`variation-${groupIndex}-options`] && (
									<Text style={{ color: '#ef4444', marginBottom: 8 }}>
										{errors[`variation-${groupIndex}-options`]}
									</Text>
								)}
								<TouchableOpacity
									style={[
										styles.addCategoryButton,
										{ marginTop: 4, marginBottom: 0 },
									]}
									onPress={() => handleAddVariationOption(groupIndex)}>
									<Ionicons
										name="add-circle-outline"
										size={16}
										color={colors.primary}
									/>
									<Text style={styles.addCategoryButtonText}>Add Option</Text>
								</TouchableOpacity>
							</>
						)}
						{/* Existing Items mode: allow selecting menu items as options */}
						{group.mode === 'existing' && (
							<>
								<Text
									style={{ fontSize: 12, color: colors.text, marginBottom: 4 }}>
									Options (Existing Items):
								</Text>
								{(group as any).existingMenuItemIds?.map(
									(itemId: number, idx: number) => {
										const mi = menuItems.find((m) => m.id === itemId)
										return (
											<View
												key={idx}
												style={{
													flexDirection: 'row',
													alignItems: 'center',
													justifyContent: 'space-between',
													marginBottom: 8,
													gap: 8,
												}}>
												<Text style={{ color: colors.text }}>
													{mi?.name || 'Unknown'}
												</Text>
												<TouchableOpacity
													onPress={() => {
														setFormData((prev) => ({
															...prev,
															variationGroups: prev.variationGroups.map(
																(g, gi) =>
																	gi === groupIndex
																		? {
																				...g,
																				existingMenuItemIds: (
																					g as any
																				).existingMenuItemIds?.filter(
																					(id: number) => id !== itemId
																				),
																		  }
																		: g
															),
														}))
													}}>
													<Ionicons
														name="close-circle"
														size={20}
														color="#ef4444"
													/>
												</TouchableOpacity>
											</View>
										)
									}
								)}

								<TouchableOpacity
									style={[
										styles.addCategoryButton,
										{ marginTop: 4, marginBottom: 0 },
									]}
									onPress={() => {
										if (menuItems.length === 0) {
											showAlert({
												title: 'No Menu Items',
												message: 'Create some menu items first',
											})
											return
										}
										const menuItemOptions = menuItems.map((item) => ({
											label: `${item.name} - ₱${item.basePrice}`,
											value: item.id,
										}))
										showMenuModal({
											title: 'Select Menu Item',
											options: menuItemOptions,
											onSelect: (menuItemId: number) => {
												setFormData((prev) => ({
													...prev,
													variationGroups: prev.variationGroups.map((g, gi) =>
														gi === groupIndex
															? {
																	...g,
																	existingMenuItemIds: [
																		...((g as any).existingMenuItemIds || []),
																		menuItemId,
																	],
															  }
															: g
													),
												}))
											},
										})
									}}>
									<Ionicons
										name="add-circle-outline"
										size={16}
										color={colors.primary}
									/>
									<Text style={styles.addCategoryButtonText}>
										Add Option (Existing Item)
									</Text>
								</TouchableOpacity>
								{errors[`variation-${groupIndex}-existing`] && (
									<Text style={{ color: '#ef4444', marginTop: 4 }}>
										{errors[`variation-${groupIndex}-existing`]}
									</Text>
								)}
							</>
						)}
					</View>
				))}

				<TouchableOpacity
					style={styles.addCategoryButton}
					onPress={handleAddVariationGroup}>
					<Ionicons
						name="add-circle-outline"
						size={20}
						color={colors.primary}
					/>
					<Text style={styles.addCategoryButtonText}>Add Variation Group</Text>
				</TouchableOpacity>

				{/* Add-ons Section */}
				<Text style={[styles.sectionTitle, { marginTop: 16 }]}>
					Add-ons (Optional)
				</Text>
				{formData.addons.map((addon, index) => {
					const menuItem = menuItems.find(
						(item) => item.id === addon.menuItemId
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
										borderColor: addon.required
											? colors.primary
											: colors.border,
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
								<Text style={{ fontSize: 14, color: colors.text }}>
									Required
								</Text>
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
			</DynamicScrollView>

			{/* Bottom Actions */}
			<View style={styles.bottomActions}>
				<TouchableOpacity
					style={styles.cancelButton}
					onPress={handleCancel}>
					<Text style={styles.cancelButtonText}>Cancel</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.saveButton, !isFormValid && styles.saveButtonDisabled]}
					onPress={handleSave}
					disabled={!isFormValid}>
					<Text style={styles.saveButtonText}>Add Item</Text>
				</TouchableOpacity>
			</View>

			<AlertModal
				visible={alertModalVisible}
				onClose={hideAlert}
				title={alertModalTitle}
				message={alertModalMessage}
			/>

			<ConfirmationModal
				visible={confirmationModal.visible}
				onClose={confirmationModal.hideConfirmation}
				title={confirmationModal.props.title}
				message={confirmationModal.props.message}
				onConfirm={confirmationModal.props.onConfirm}
			/>

			<MenuModal
				visible={menuModalVisible}
				onClose={hideMenuModal}
				title={menuModalProps.title}
				options={menuModalProps.options}
				onSelect={menuModalProps.onSelect}
				footer={menuModalProps.footer}
			/>
		</DynamicKeyboardView>
	)
}

export default AddMenuItemScreen
