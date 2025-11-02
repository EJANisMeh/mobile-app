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
import { createConcessionaireAddMenuItemStyles } from '../../../styles/concessionaire'
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
	VariationGroupsSection,
} from '../../../components/concessionaire/menu/addItem'
import { apiCall } from '../../../services/api/api'
import { AddMenuItemFormData, AddonInput, SelectionType } from '../../../types'
import { useConcessionaireNavigation } from '../../../hooks/useNavigation'

const AddMenuItemScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireAddMenuItemStyles(colors, responsive)
	const navigation = useConcessionaireNavigation()
	const { concession } = useConcessionContext()

	const {
		visible: alertModalVisible,
		title: alertModalTitle,
		message: alertModalMessage,
		showAlert,
		hideAlert,
		handleClose: handleCloseAlertModal,
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

		showConfirmation({
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
				<VariationGroupsSection
					formData={formData}
					setFormData={setFormData}
					categories={categories}
					selectionTypes={selectionTypes}
					menuItems={menuItems}
					errors={errors}
					setErrors={setErrors}
					showMenuModal={showMenuModal}
					showAlert={showAlert}
					showConfirmation={showConfirmation}
				/>

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
							style={styles.addonCard}>
							<View style={styles.addonHeader}>
								<Text style={styles.addonTitle}>
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
							<View style={styles.addonPriceRow}>
								<Text style={styles.addonPriceLabel}>Price Override: ₱</Text>
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
								style={styles.checkboxRow}
								onPress={() =>
									handleUpdateAddon(index, 'required', !addon.required)
								}>
								<View
									style={[
										styles.checkbox,
										addon.required
											? styles.checkboxChecked
											: styles.checkboxUnchecked,
									]}>
									{addon.required && (
										<Ionicons
											name="checkmark"
											size={14}
											color="#fff"
										/>
									)}
								</View>
								<Text style={styles.checkboxLabel}>Required</Text>
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
		</DynamicKeyboardView>
	)
}

export default AddMenuItemScreen
