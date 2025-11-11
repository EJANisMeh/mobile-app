import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, ActivityIndicator, BackHandler } from 'react-native'
import {
	useNavigation,
	useRoute,
	RouteProp,
	useFocusEffect,
} from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import {
	useThemeContext,
	useConcessionContext,
	useMenuContext,
} from '../../../context'
import { useResponsiveDimensions, useHideNavBar } from '../../../hooks'
import {
	useAlertModal,
	useConfirmationModal,
	useMenuModal,
	useCheckboxMenuModal,
} from '../../../hooks/useModals'
import { createConcessionaireEditMenuItemStyles } from '../../../styles/concessionaire'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'
import { apiCall } from '../../../services/api/api'
import {
	AlertModal,
	ConfirmationModal,
	MenuModal,
	CheckboxMenuModal,
	PriceAdjustmentWarningModal,
} from '../../../components/modals'
import {
	AddMenuItemFormData,
	ConcessionaireStackParamList,
	SelectionType,
	VariationGroupMode,
	RawMenuItemVariationGroup,
	RawMenuItemVariationOptionChoice,
} from '../../../types'
import {
	NameInput,
	DescriptionInput,
	BasePriceInput,
	CategorySelector,
	ImagePickerSection,
	VariationGroupsSection,
	AddonSection,
	FormActions,
} from '../../../components/concessionaire/menu/editItem'
import MenuAvailabilitySection from '../../../components/concessionaire/menu/shared/MenuAvailabilitySection'
import {
	createDefaultMenuItemSchedule,
	normalizeMenuItemSchedule,
	hasAnyMenuItemScheduleDay,
} from '../../../utils'

interface AffectedItem {
	id: number
	name: string
	originalPrice: number
	adjustedPrice: number
}

type EditMenuItemScreenNavigationProp = StackNavigationProp<
	ConcessionaireStackParamList,
	'EditMenuItem'
>
type EditMenuItemScreenRouteProp = RouteProp<
	ConcessionaireStackParamList,
	'EditMenuItem'
>

const EditMenuItemScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireEditMenuItemStyles(colors, responsive)
	const navigation = useNavigation<EditMenuItemScreenNavigationProp>()
	const route = useRoute<EditMenuItemScreenRouteProp>()
	const { concession } = useConcessionContext()

	const alertModal = useAlertModal()
	const confirmationModal = useConfirmationModal()
	const menuModal = useMenuModal()
	const checkboxMenuModal = useCheckboxMenuModal()
	const {
		categories,
		getMenuItems,
		getCategories,
		editMenuItem,
		getMenuItemById,
		menuItems,
	} = useMenuContext()

	useHideNavBar()

	const itemId = parseInt(route.params.itemId)

	const goBackToMenu = () => {
		if (navigation.canGoBack()) {
			navigation.goBack()
			return
		}

		navigation.navigate('MainTabs')
	}

	// Form state
	const [formData, setFormData] = useState<AddMenuItemFormData>({
		name: '',
		description: '',
		basePrice: '',
		images: [],
		displayImageIndex: 0,
		categoryIds: [],
		availability: true,
		variationGroups: [],
		addons: [],
		availabilitySchedule: createDefaultMenuItemSchedule(),
	})

	const [initialFormData, setInitialFormData] =
		useState<AddMenuItemFormData | null>(null)
	const [loadingItem, setLoadingItem] = useState(true)
	const [hasChanges, setHasChanges] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [selectionTypes, setSelectionTypes] = useState<SelectionType[]>([])
	const [loadingSelectionTypes, setLoadingSelectionTypes] = useState(false)
	const [categoriesLoading, setCategoriesLoading] = useState(false)
	const [priceWarningVisible, setPriceWarningVisible] = useState(false)
	const [affectedItems, setAffectedItems] = useState<AffectedItem[]>([])

	// Load item data on mount
	useEffect(() => {
		loadMenuItem()
	}, [itemId])

	// Load categories on mount and when returning from category management
	useFocusEffect(
		React.useCallback(() => {
			if (concession?.id) {
				setCategoriesLoading(true)
				getCategories(concession.id).finally(() => setCategoriesLoading(false))
				getMenuItems(concession.id)
			}
			// Load selection types
			loadSelectionTypes()
		}, [concession?.id])
	)

	const loadMenuItem = async () => {
		setLoadingItem(true)
		try {
			const result = await getMenuItemById(itemId)
			if (result.success && result.item) {
				const item = result.item

				// Extract category IDs from junction table
				const categoryIds = item.menu_item_category_links
					? item.menu_item_category_links.map((link: any) => link.category_id)
					: item.categoryId
					? [item.categoryId]
					: []

				// Transform backend data to form data structure
				const rawGroups = (item.menu_item_variation_groups ??
					[]) as RawMenuItemVariationGroup[]
				const transformedGroups = rawGroups.map((group) => {
					const fallbackMode: VariationGroupMode =
						group.kind === 'single_category_filter'
							? 'single-category'
							: group.kind === 'multi_category_filter'
							? 'multi-category'
							: group.kind === 'category_filter'
							? 'single-category'
							: group.kind === 'existing_items'
							? 'existing'
							: 'custom'
					const groupMode: VariationGroupMode =
						(group.code as VariationGroupMode | undefined) || fallbackMode
					const optionChoices = (group.menu_item_variation_option_choices ??
						[]) as RawMenuItemVariationOptionChoice[]
					const options =
						groupMode === 'custom'
							? optionChoices.map((option) => ({
									name: option.name || '',
									priceAdjustment:
										option.price_adjustment != null
											? option.price_adjustment.toString()
											: '0',
									availability: option.availability ?? true,
									isDefault: option.is_default ?? false,
									position: option.position ?? 0,
							  }))
							: []
					const existingMenuItemIds =
						groupMode === 'existing'
							? optionChoices
									.map((option) => {
										if (!option.code) {
											return null
										}
										const match = option.code.match(/item_(\d+)/)
										if (!match) {
											return null
										}
										const parsed = parseInt(match[1], 10)
										return Number.isNaN(parsed) ? null : parsed
									})
									.filter((maybeId): maybeId is number => maybeId != null)
							: []

					return {
						name: group.name || '',
						selectionTypeId: group.selection_type_id ?? 1,
						multiLimit: group.multi_limit ?? null,
						mode: groupMode,
						categoryFilterId: group.category_filter_id ?? null,
						categoryFilterIds: group.category_filter_ids ?? [],
						categoryPriceAdjustment:
							group.category_price_adjustment != null
								? group.category_price_adjustment.toString()
								: null,
						options,
						existingMenuItemIds,
						specificity: group.specificity ?? false,
						position: group.position ?? 0,
					}
				})

				const transformedData: AddMenuItemFormData = {
					name: item.name || '',
					description: item.description || '',
					basePrice: item.basePrice ? item.basePrice.toString() : '',
					images: item.images || [],
					displayImageIndex: item.display_image_index ?? 0,
					categoryIds: categoryIds,
					availability: item.availability ?? true,
					availabilitySchedule: normalizeMenuItemSchedule(
						item.availability_schedule ?? item.availabilitySchedule
					),
					variationGroups: transformedGroups,
					addons:
						item.menu_item_addons_menu_item_addons_menu_item_idTomenu_items?.map(
							(addon: any) => ({
								menuItemId: addon.target_menu_item_id ?? 0,
								label: addon.custom_label || null,
								priceOverride: addon.price_override
									? addon.price_override.toString()
									: null,
								required: addon.required ?? false,
								position: addon.position ?? 0,
							})
						) || [],
				}

				setFormData(transformedData)
				setInitialFormData(JSON.parse(JSON.stringify(transformedData)))
			} else {
				alertModal.showAlert({
					title: 'Error',
					message: result.error || 'Failed to load menu item',
				})
				goBackToMenu()
			}
		} catch (error) {
			console.error('Load menu item error:', error)
			alertModal.showAlert({
				title: 'Error',
				message: 'Failed to load menu item',
			})
			goBackToMenu()
		} finally {
			setLoadingItem(false)
		}
	}

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
		if (!initialFormData) {
			setHasChanges(false)
			return
		}

		const changed = JSON.stringify(formData) !== JSON.stringify(initialFormData)
		setHasChanges(changed)
	}, [formData, initialFormData])

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
				onConfirm: () => goBackToMenu(),
			})
		} else {
			goBackToMenu()
		}
	}

	// Compute quick validity (no side-effects) will be computed after validateForm is declared

	const validateForm = (setErrorMsgs = true) => {
		if (!initialFormData) {
			if (setErrorMsgs) {
				setErrors({})
			}
			return false
		}

		const newErrors: Record<string, string> = {}
		// name
		if (!formData.name.trim()) {
			newErrors['name'] = 'Item name is required'
		}
		// category
		if (formData.categoryIds.length === 0) {
			newErrors['category'] = 'At least one category is required'
		}
		// basePrice if provided must be a valid number >= 0
		if (formData.basePrice.trim()) {
			const p = parseFloat(formData.basePrice)
			if (isNaN(p) || p < 0) {
				newErrors['basePrice'] = 'Enter a valid price or leave empty'
			}
		}
		if (!hasAnyMenuItemScheduleDay(formData.availabilitySchedule)) {
			newErrors['availabilitySchedule'] = 'Select at least one day'
		}

		// Variation groups validations
		formData.variationGroups.forEach((group, i) => {
			const prefix = `variation-${i}`
			if (!group.name.trim()) {
				newErrors[`${prefix}-name`] = 'Group name is required'
			}
			if (group.mode === 'custom') {
				if (!group.options || group.options.length < 1) {
					newErrors[`${prefix}-options`] =
						'Add at least one option for custom mode'
				}
				// check each option name
				group.options.forEach((opt, j) => {
					if (!opt.name.trim()) {
						newErrors[`${prefix}-option-${j}`] = 'Option name required'
					}
				})
			} else if (group.mode === 'single-category') {
				if (!group.categoryFilterId) {
					newErrors[`${prefix}-categoryFilterId`] =
						'Select a category for this mode'
				}
			} else if (group.mode === 'multi-category') {
				if (!group.categoryFilterIds || group.categoryFilterIds.length === 0) {
					newErrors[`${prefix}-categoryFilterIds`] =
						'Select at least one category for this mode'
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
		if (!initialFormData) {
			return
		}
		validateForm(true)
	}, [formData, selectionTypes, initialFormData])

	// compute primary validity for enabling Save button
	const isFormValid = useMemo(() => {
		if (!initialFormData) {
			return false
		}
		if (!formData.name.trim()) {
			return false
		}
		if (formData.categoryIds.length === 0) {
			return false
		}
		if (formData.basePrice.trim()) {
			const p = parseFloat(formData.basePrice)
			if (isNaN(p) || p < 0) {
				return false
			}
		}
		if (!hasAnyMenuItemScheduleDay(formData.availabilitySchedule)) {
			return false
		}
		return true
	}, [formData, initialFormData])

	const proceedWithSave = () => {
		confirmationModal.showConfirmation({
			title: 'Save Changes',
			message: 'Save changes to this menu item?',
			confirmText: 'Save',
			cancelText: 'Cancel',
			onConfirm: async () => {
				try {
					const response = await editMenuItem(itemId, {
						concessionId: concession?.id,
						name: formData.name.trim(),
						description: formData.description.trim() || null,
						basePrice: formData.basePrice || '0',
						images: formData.images,
						displayImageIndex: formData.displayImageIndex,
						categoryIds: formData.categoryIds,
						availability: formData.availability,
						availabilitySchedule: formData.availabilitySchedule,
						variationGroups: formData.variationGroups.map((group) => ({
							name: group.name.trim(),
							selectionTypeId: group.selectionTypeId,
							multiLimit: group.multiLimit,
							mode: group.mode,
							categoryFilterId: group.categoryFilterId,
							categoryFilterIds: group.categoryFilterIds,
							categoryPriceAdjustment: group.categoryPriceAdjustment,
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
					})

					if (response.success) {
						await getMenuItems(concession?.id ?? 0)
						goBackToMenu()
					} else {
						alertModal.showAlert({
							title: 'Error',
							message: response.error || 'Failed to save changes',
						})
					}
				} catch (error) {
					console.error('Save error:', error)
					alertModal.showAlert({
						title: 'Error',
						message: 'Failed to save changes',
					})
				}
			},
		})
	}

	const handleSave = async () => {
		const valid = validateForm(true)
		if (!valid) {
			// focus/notify by modal briefly
			alertModal.showAlert({
				title: 'Validation Error',
				message: 'Please fix the highlighted fields before saving',
			})
			return
		}

		if (!hasChanges) {
			alertModal.showAlert({
				title: 'No Changes',
				message: 'No changes were made',
			})
			return
		}

		// Validate category price adjustments via API
		if (!concession?.id) {
			alertModal.showAlert({
				title: 'Error',
				message: 'Concession ID not found',
			})
			return
		}

		try {
			const { menuApi } = await import('../../../services/api')

			const validation = await menuApi.validatePriceAdjustment(
				concession.id,
				formData.variationGroups
			)

			if (!validation.success) {
				alertModal.showAlert({
					title: 'Error',
					message: validation.message || 'Failed to validate price adjustments',
				})
				return
			}

			if (validation.hasIssue && validation.message) {
				// Show warning with affected items
				setAffectedItems(validation.affectedItems || [])
				setPriceWarningVisible(true)
			} else {
				proceedWithSave()
			}
		} catch (error) {
			console.error('Error validating price adjustment:', error)
			// Proceed anyway if validation fails
			proceedWithSave()
		}
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

	if (loadingItem || categoriesLoading) {
		return (
			<View
				style={[
					styles.editItemContainer,
					{ justifyContent: 'center', alignItems: 'center' },
				]}>
				<ActivityIndicator
					size="large"
					color={colors.primary}
				/>
				<Text style={{ color: colors.text, marginTop: 16 }}>Loading...</Text>
			</View>
		)
	}

	return (
		<DynamicKeyboardView style={styles.editItemContainer}>
			<DynamicScrollView showsVerticalScrollIndicator={false}>
				<NameInput
					formData={formData}
					setFormData={setFormData}
					errors={errors}
				/>

				<DescriptionInput
					formData={formData}
					setFormData={setFormData}
				/>

				<BasePriceInput
					formData={formData}
					setFormData={setFormData}
					errors={errors}
				/>

				<CategorySelector
					formData={formData}
					setFormData={setFormData}
					categories={categories}
					errors={errors}
					showCheckboxMenu={checkboxMenuModal.showMenu}
					hideCheckboxMenu={checkboxMenuModal.hideMenu}
					onNavigateToCategoryManagement={() =>
						navigation.navigate('CategoryManagement')
					}
				/>

				<MenuAvailabilitySection
					schedule={formData.availabilitySchedule}
					onChange={(next) =>
						setFormData((prev) => ({
							...prev,
							availabilitySchedule: next,
						}))
					}
					error={errors['availabilitySchedule']}
					variant="edit"
				/>

				<ImagePickerSection
					formData={formData}
					setFormData={setFormData}
					showAlert={alertModal.showAlert}
				/>

				<VariationGroupsSection
					formData={formData}
					setFormData={setFormData}
					categories={categories}
					selectionTypes={selectionTypes}
					errors={errors}
					setErrors={setErrors}
					showMenuModal={menuModal.showMenu}
					showCheckboxMenu={checkboxMenuModal.showMenu}
					showAlert={alertModal.showAlert}
					showConfirmation={confirmationModal.showConfirmation}
					itemId={itemId}
				/>

				<AddonSection
					formData={formData}
					setFormData={setFormData}
					showAlert={alertModal.showAlert}
					showMenuModal={menuModal.showMenu}
					itemId={itemId}
				/>
			</DynamicScrollView>

			<FormActions
				isFormValid={isFormValid}
				hasChanges={hasChanges}
				handleSave={handleSave}
				handleCancel={handleCancel}
			/>

			<AlertModal
				visible={alertModal.visible}
				onClose={alertModal.hideAlert}
				title={alertModal.title}
				message={alertModal.message}
			/>
			<ConfirmationModal
				visible={confirmationModal.visible}
				onClose={confirmationModal.hideConfirmation}
				title={confirmationModal.props.title}
				message={confirmationModal.props.message}
				onConfirm={confirmationModal.props.onConfirm}
			/>
			<MenuModal
				visible={menuModal.visible}
				onClose={menuModal.hideMenu}
				title={menuModal.props.title}
				options={menuModal.props.options}
				onSelect={menuModal.props.onSelect}
				footer={menuModal.props.footer}
			/>
			<CheckboxMenuModal
				visible={checkboxMenuModal.visible}
				onClose={checkboxMenuModal.hideMenu}
				title={checkboxMenuModal.props.title}
				message={checkboxMenuModal.props.message}
				options={checkboxMenuModal.props.options}
				selectedValues={checkboxMenuModal.props.selectedValues}
				onSave={checkboxMenuModal.props.onSave}
				footer={checkboxMenuModal.props.footer}
			/>

			<PriceAdjustmentWarningModal
				visible={priceWarningVisible}
				onClose={() => setPriceWarningVisible(false)}
				affectedItems={affectedItems}
				onConfirm={() => {
					// Wait a bit before showing next modal to avoid conflicts
					setTimeout(() => proceedWithSave(), 350)
				}}
			/>
		</DynamicKeyboardView>
	)
}

export default EditMenuItemScreen
