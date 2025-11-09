import React, { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator, BackHandler } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
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
import { createConcessionaireAddMenuItemStyles } from '../../../styles/concessionaire'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'
import {
	AlertModal,
	ConfirmationModal,
	MenuModal,
	CheckboxMenuModal,
} from '../../../components/modals'
import {
	NameInput,
	DescriptionInput,
	BasePriceInput,
	CategorySelector,
	ImagePickerSection,
	VariationGroupsSection,
	FormActions,
} from '../../../components/concessionaire/menu/addItem'
import MenuAvailabilitySection from '../../../components/concessionaire/menu/shared/MenuAvailabilitySection'
import { AddMenuItemFormData, SelectionType } from '../../../types'
import { useConcessionaireNavigation } from '../../../hooks/useNavigation'
import AddonSection from '../../../components/concessionaire/menu/addItem/AddonSection'
import { apiCall } from '../../../services/api/api'
import {
	createDefaultMenuItemSchedule,
	hasAnyMenuItemScheduleDay,
	isMenuItemScheduleAllDays,
	validateCategoryPriceAdjustment,
} from '../../../utils'

const AddMenuItemScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireAddMenuItemStyles(colors, responsive)
	const navigation = useConcessionaireNavigation()
	const { concession } = useConcessionContext()
	const { categories, getMenuItems, getCategories, addMenuItem, menuItems } =
		useMenuContext()

	const {
		visible: alertModalVisible,
		title: alertModalTitle,
		message: alertModalMessage,
		showAlert,
		hideAlert,
	} = useAlertModal()
	const {
		visible: confirmationModalVisible,
		props: confirmationModalProps,
		showConfirmation,
		hideConfirmation,
	} = useConfirmationModal()
	const {
		visible: menuModalVisible,
		props: menuModalProps,
		hideMenu: hideMenuModal,
		showMenu: showMenuModal,
	} = useMenuModal()
	const {
		visible: checkboxMenuModalVisible,
		props: checkboxMenuModalProps,
		hideMenu: hideCheckboxMenuModal,
		showMenu: showCheckboxMenuModal,
	} = useCheckboxMenuModal()

	useHideNavBar()

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

	const [hasChanges, setHasChanges] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [selectionTypes, setSelectionTypes] = useState<SelectionType[]>([])
	const [categoriesLoading, setCategoriesLoading] = useState(false)

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

	const loadSelectionTypes = async () => {
		try {
			const data = await apiCall('/menu/selection-types')
			if (data.success && data.selectionTypes) {
				setSelectionTypes(data.selectionTypes)
			} else {
				console.error('Failed to load selection types:', data.error)
			}
		} catch (error) {
			console.error('Failed to load selection types:', error)
		}
	}

	// Track changes
	useEffect(() => {
		const scheduleChanged = !isMenuItemScheduleAllDays(
			formData.availabilitySchedule
		)
		const changed =
			formData.name.trim() !== '' ||
			formData.description.trim() !== '' ||
			formData.basePrice.trim() !== '' ||
			formData.images.length > 0 ||
			formData.categoryIds.length > 0 ||
			scheduleChanged

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
			showConfirmation({
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
		validateForm(true)
	}, [formData, selectionTypes])

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

		// Check for price adjustment issues in multi-category variation groups
		const priceIssues: Array<{ groupName: string; message: string }> = []

		formData.variationGroups.forEach((group) => {
			if (group.mode === 'multi-category' && group.categoryPriceAdjustment) {
				// Get all menu items from the selected categories
				const categoryMenuItems = menuItems.filter((item: any) =>
					group.categoryFilterIds?.some((catId) =>
						item.category_ids?.includes(catId)
					)
				)

				const validation = validateCategoryPriceAdjustment(
					categoryMenuItems,
					group.categoryPriceAdjustment
				)

				if (validation.hasIssue && validation.message) {
					priceIssues.push({
						groupName: group.name,
						message: validation.message,
					})
				}
			}
		})

		// If there are price issues, show warning confirmation
		if (priceIssues.length > 0) {
			const issueMessages = priceIssues
				.map((issue) => `${issue.groupName}:\n${issue.message}`)
				.join('\n\n')

			showConfirmation({
				title: 'Price Adjustment Warning',
				message: issueMessages,
				confirmText: 'Continue',
				cancelText: 'Cancel',
				onConfirm: () => proceedWithSave(),
			})
		} else {
			proceedWithSave()
		}
	}

	const proceedWithSave = () => {
		showConfirmation({
			title: 'Add Item',
			message: 'Add this item to your menu?',
			confirmText: 'Add',
			cancelText: 'Cancel',
			onConfirm: async () => {
				if (!concession?.id) {
					showAlert({
						title: 'Error',
						message: 'Concession not found',
					})
					return
				}

				const response = await addMenuItem(concession.id, formData)

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

	return (
		<DynamicKeyboardView style={styles.addItemContainer}>
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
					categories={categories}
					errors={errors}
					showCheckboxMenu={showCheckboxMenuModal}
					hideCheckboxMenu={hideCheckboxMenuModal}
				/>

				{/* Availability Schedule */}
				<MenuAvailabilitySection
					schedule={formData.availabilitySchedule}
					onChange={(next) =>
						setFormData((prev) => ({
							...prev,
							availabilitySchedule: next,
						}))
					}
					error={errors['availabilitySchedule']}
					variant="add"
				/>

				{/* Images Section */}
				<ImagePickerSection
					formData={formData}
					setFormData={setFormData}
					showAlert={showAlert}
				/>

				{/* Variations Section */}
				<VariationGroupsSection
					formData={formData}
					setFormData={setFormData}
					categories={categories}
					selectionTypes={selectionTypes}
					errors={errors}
					setErrors={setErrors}
					showMenuModal={showMenuModal}
					showCheckboxMenu={showCheckboxMenuModal}
					showAlert={showAlert}
					showConfirmation={showConfirmation}
				/>

				{/* Add-ons Section */}
				<AddonSection
					formData={formData}
					setFormData={setFormData}
					showAlert={showAlert}
					showMenuModal={showMenuModal}
				/>
			</DynamicScrollView>

			{/* Bottom Actions */}
			<View style={styles.bottomActions}>
				<FormActions
					isFormValid={isFormValid}
					handleSave={handleSave}
					handleCancel={handleCancel}
				/>
			</View>

			<AlertModal
				visible={alertModalVisible}
				onClose={hideAlert}
				title={alertModalTitle}
				message={alertModalMessage}
			/>

			<ConfirmationModal
				visible={confirmationModalVisible}
				onClose={hideConfirmation}
				title={confirmationModalProps.title}
				message={confirmationModalProps.message}
				onConfirm={confirmationModalProps.onConfirm}
			/>

			<MenuModal
				visible={menuModalVisible}
				onClose={hideMenuModal}
				title={menuModalProps.title}
				options={menuModalProps.options}
				onSelect={menuModalProps.onSelect}
				footer={menuModalProps.footer}
			/>

			<CheckboxMenuModal
				visible={checkboxMenuModalVisible}
				onClose={hideCheckboxMenuModal}
				title={checkboxMenuModalProps.title}
				message={checkboxMenuModalProps.message}
				options={checkboxMenuModalProps.options}
				selectedValues={checkboxMenuModalProps.selectedValues}
				onSave={checkboxMenuModalProps.onSave}
				footer={checkboxMenuModalProps.footer}
			/>
		</DynamicKeyboardView>
	)
}

export default AddMenuItemScreen
