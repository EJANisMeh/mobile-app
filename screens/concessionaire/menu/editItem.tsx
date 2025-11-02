import React, { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator, BackHandler } from 'react-native'
import {
	useNavigation,
	useRoute,
	RouteProp,
	useFocusEffect,
} from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useThemeContext, useConcessionContext, useMenuContext } from '../../../context'
import { useResponsiveDimensions, useHideNavBar } from '../../../hooks'
import { useCategoryBackend } from '../../../hooks/useBackend/useCategoryBackend'
import {
	useAlertModal,
	useConfirmationModal,
	useMenuModal,
} from '../../../hooks/useModals'
import { createConcessionaireEditMenuItemStyles } from '../../../styles/concessionaire'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'
import { menuApi } from '../../../services/api'
import {
	AlertModal,
	ConfirmationModal,
	MenuModal,
} from '../../../components/modals'
import { apiCall } from '../../../services/api/api'
import {
	AddMenuItemFormData,
	ConcessionaireStackParamList,
	SelectionType,
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
	const {
		categories,
		loading: categoriesLoading,
		getCategories,
	} = useCategoryBackend()
	const { getMenuItems } = useMenuContext()

	useHideNavBar()

	const itemId = parseInt(route.params.itemId)

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

	const [initialFormData, setInitialFormData] =
		useState<AddMenuItemFormData | null>(null)
	const [loadingItem, setLoadingItem] = useState(true)
	const [hasChanges, setHasChanges] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [selectionTypes, setSelectionTypes] = useState<SelectionType[]>([])
	const [loadingSelectionTypes, setLoadingSelectionTypes] = useState(false)

	// Load item data on mount
	useEffect(() => {
		loadMenuItem()
	}, [itemId])

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

	const loadMenuItem = async () => {
		setLoadingItem(true)
		try {
			const result = await menuApi.getMenuItemById(itemId)
			if (result.success && result.item) {
				const item = result.item

				// Transform backend data to form data structure
				const transformedData: AddMenuItemFormData = {
					name: item.name || '',
					description: item.description || '',
					basePrice: item.basePrice ? item.basePrice.toString() : '',
					images: item.images || [],
					displayImageIndex: item.display_image_index ?? 0,
					categoryId: item.categoryId ?? null,
					availability: item.availability ?? true,
					variationGroups:
						item.menu_item_variation_groups?.map((group: any) => ({
							name: group.name || '',
							selectionTypeId: group.selection_type_id ?? 1,
							multiLimit: group.multi_limit ?? null,
							mode: (group.code || 'custom') as
								| 'custom'
								| 'category'
								| 'existing',
							categoryFilterId: group.category_filter_id ?? null,
							options:
								group.menu_item_variation_option_choices?.map(
									(option: any) => ({
										name: option.name || '',
										priceAdjustment: option.price_adjustment
											? option.price_adjustment.toString()
											: '0',
										availability: option.availability ?? true,
										isDefault: option.is_default ?? false,
										position: option.position ?? 0,
									})
								) || [],
							existingMenuItemIds: [],
							position: group.position ?? 0,
						})) || [],
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
				navigation.goBack()
			}
		} catch (error) {
			console.error('Load menu item error:', error)
			alertModal.showAlert({
				title: 'Error',
				message: 'Failed to load menu item',
			})
			navigation.goBack()
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

		confirmationModal.showConfirmation({
			title: 'Save Changes',
			message: 'Save changes to this menu item?',
			confirmText: 'Save',
			cancelText: 'Cancel',
			onConfirm: async () => {
				try {
					const response = await apiCall(`/menu/edit/${itemId}`, {
						method: 'PUT',
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
						alertModal.showAlert({
							title: 'Success',
							message: 'Changes saved successfully!',
						})
						navigation.goBack()
					} else {
						alertModal.showAlert({
							title: 'Error',
							message: response.error || 'Failed to save changes',
						})
					}
				} catch (error) {
					console.error('Error saving changes:', error)
					alertModal.showAlert({
						title: 'Error',
						message: 'Failed to save changes. Please try again.',
					})
				}
			},
		})
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
		<DynamicKeyboardView
			style={styles.editItemContainer}
			useSafeArea={true}>
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
					showMenu={menuModal.showMenu}
					hideMenu={menuModal.hideMenu}
					onNavigateToCategoryManagement={() =>
						navigation.navigate('CategoryManagement')
					}
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
		</DynamicKeyboardView>
	)
}

export default EditMenuItemScreen
