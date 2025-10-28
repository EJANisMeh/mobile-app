import React, { useState, useEffect } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	BackHandler,
} from 'react-native'
import { useThemeContext, useConcessionContext } from '../../../context'
import { useHideNavBar, useResponsiveDimensions } from '../../../hooks'
import { useCategoryBackend } from '../../../hooks/useBackend/useCategoryBackend'
import { useAlertModal } from '../../../hooks/useModals/useAlertModal'
import { useConfirmationModal } from '../../../hooks/useModals/useConfirmationModal'
import { createConcessionaireMenuStyles } from '../../../styles/concessionaire'
import {
	AlertModal,
	ConfirmationModal,
	DynamicKeyboardView,
	DynamicScrollView,
} from '../../../components'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

interface CategoryItem {
	id?: number
	name: string
	position: number
	isNew?: boolean
}

const CategoryManagementScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireMenuStyles(colors, responsive)
	const navigation = useNavigation()

	const { concession } = useConcessionContext()
	const { categories, loading, getCategories, updateCategories } =
		useCategoryBackend()

	const alertModal = useAlertModal()
	const confirmationModal = useConfirmationModal()

	const [editedCategories, setEditedCategories] = useState<CategoryItem[]>([])
	const [hasChanges, setHasChanges] = useState(false)

	useHideNavBar()

	// Load categories on mount
	useEffect(() => {
		let isMounted = true

		const fetchCategories = async () => {
			if (concession?.id) {
				const result = await getCategories(concession.id)

				if (isMounted && result.success && result.categories) {
					setEditedCategories(
						result.categories.map((cat) => ({
							id: cat.id,
							name: cat.name,
							position: cat.position || 0,
						}))
					)
				}
			}
		}

		fetchCategories()

		return () => {
			isMounted = false
		}
	}, [concession?.id])

	// Check if there are changes
	useEffect(() => {
		if (categories.length === 0 && editedCategories.length === 0) {
			setHasChanges(false)
			return
		}

		// Filter out empty new categories for comparison
		const nonEmptyEdited = editedCategories.filter(
			(cat) => !cat.isNew || cat.name.trim() !== ''
		)

		// Check if lengths are different (after filtering empty new ones)
		if (categories.length !== nonEmptyEdited.length) {
			setHasChanges(true)
			return
		}

		// Check if any category has changed
		const changed = nonEmptyEdited.some((edited) => {
			const original = categories.find((cat) => cat.id === edited.id)
			if (!original) return true // New category with value
			return original.name !== edited.name
		})

		setHasChanges(changed)
	}, [categories, editedCategories])

	const handleCategoryNameChange = (index: number, newName: string) => {
		setEditedCategories((prev) =>
			prev.map((cat, i) => (i === index ? { ...cat, name: newName } : cat))
		)
	}

	const handleRemoveCategory = (index: number) => {
		const category = editedCategories[index]

		// If it's a new category with no value, remove without confirmation
		if (category.isNew && category.name.trim() === '') {
			setEditedCategories((prev) => prev.filter((_, i) => i !== index))
			return
		}

		// Show confirmation
		confirmationModal.showConfirmation({
			title: 'Remove Category',
			message: `Are you sure you want to remove "${category.name}"?`,
			confirmText: 'Remove',
			cancelText: 'Cancel',
			confirmStyle: 'destructive',
			onConfirm: () => {
				setEditedCategories((prev) => prev.filter((_, i) => i !== index))
			},
		})
	}

	const handleAddCategory = () => {
		setEditedCategories((prev) => [
			...prev,
			{
				name: '',
				position: prev.length,
				isNew: true,
			},
		])
	}

	const handleCancel = () => {
		if (hasChanges) {
			confirmationModal.showConfirmation({
				title: 'Discard Changes',
				message:
					'You have unsaved changes. Are you sure you want to discard them?',
				confirmText: 'Discard',
				cancelText: 'Keep Editing',
				confirmStyle: 'destructive',
				onConfirm: () => {
					// Reset to original categories
					setEditedCategories(
						categories.map((cat) => ({
							id: cat.id,
							name: cat.name,
							position: cat.position || 0,
						}))
					)
					navigation.goBack()
				},
			})
		} else {
			navigation.goBack()
		}
	}

	const handleSave = () => {
		confirmationModal.showConfirmation({
			title: 'Save Changes',
			message: 'Are you sure you want to save these changes?',
			confirmText: 'Save',
			cancelText: 'Cancel',
			onConfirm: async () => {
				if (!concession?.id) return

				// Filter out empty categories and update positions
				const validCategories = editedCategories
					.filter((cat) => cat.name.trim() !== '')
					.map((cat, index) => ({
						id: cat.id,
						name: cat.name.trim(),
						position: index,
					}))

				const result = await updateCategories(concession.id, validCategories)
				if (!result.success) {
					alertModal.showAlert({
						title: 'Error',
						message: result.error || 'Failed to update categories',
					})
				}
				navigation.goBack()
			},
		})
	}

	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				handleCancel()
				return true // Prevent default back behavior
			}
		)

		return () => backHandler.remove() // Remove backhandler function after unmounting
	}, [hasChanges])

	// Check if add button should be disabled (any empty input exists)
	const hasEmptyInput = editedCategories.some((cat) => cat.name.trim() === '')

	if (loading && categories.length === 0) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator
					size="large"
					color={colors.primary}
				/>
				<Text style={styles.loadingText}>Loading categories...</Text>
			</View>
		)
	}

	return (
		<DynamicKeyboardView
			style={styles.categoryManagementContainer}
			useSafeArea={true}>
			<DynamicScrollView showsVerticalScrollIndicator={false}>
				{editedCategories.map((category, index) => (
					<View
						key={index}
						style={styles.categoryInputContainer}>
						<TextInput
							style={styles.categoryInput}
							value={category.name}
							onChangeText={(text) => handleCategoryNameChange(index, text)}
							placeholder="Category name"
							placeholderTextColor={colors.textSecondary}
						/>
						<TouchableOpacity
							style={styles.removeIconButton}
							onPress={() => handleRemoveCategory(index)}>
							<Ionicons
								name="trash-outline"
								size={20}
								color="#ef4444"
							/>
						</TouchableOpacity>
					</View>
				))}

				<TouchableOpacity
					style={[
						styles.addCategoryButton,
						hasEmptyInput && styles.addCategoryButtonDisabled,
					]}
					onPress={handleAddCategory}
					disabled={hasEmptyInput}>
					<Ionicons
						name="add-circle-outline"
						size={20}
						color={hasEmptyInput ? colors.textSecondary : colors.primary}
					/>
					<Text
						style={[
							styles.addCategoryButtonText,
							hasEmptyInput && styles.addCategoryButtonTextDisabled,
						]}>
						Add Category
					</Text>
				</TouchableOpacity>
			</DynamicScrollView>

			<View style={styles.bottomActions}>
				<TouchableOpacity
					style={styles.cancelButton}
					onPress={handleCancel}>
					<Text style={styles.cancelButtonText}>Cancel</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
					onPress={handleSave}
					disabled={!hasChanges}>
					<Text style={styles.saveButtonText}>Save Changes</Text>
				</TouchableOpacity>
			</View>

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
		</DynamicKeyboardView>
	)
}

export default CategoryManagementScreen
