import React, { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemeContext, useConcessionContext } from '../../../context'
import {
	useResponsiveDimensions,
	useAlertModal,
	useConfirmationModal,
	useMenuBackend,
} from '../../../hooks'
import { createConcessionaireMenuStyles } from '../../../styles/concessionaire'
import {
	MenuItemCard,
	AddMenuItemButton,
	ManageCategoriesButton,
} from '../../../components/concessionaire/menu'
import { AlertModal, ConfirmationModal } from '../../../components/modals'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'

const MenuScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireMenuStyles(colors, responsive)
	const { concession } = useConcessionContext()

	const { visible, title, message, showAlert, hideAlert } = useAlertModal()
	const {
		visible: confirmVisible,
		props: confirmProps,
		showConfirmation,
		hideConfirmation,
	} = useConfirmationModal()

	const {
		loading,
		error,
		menuItems,
		getMenuItems,
		toggleAvailability,
		deleteMenuItem,
	} = useMenuBackend()

	// Fetch menu items on mount
	useEffect(() => {
		let isMounted = true

		const fetchItems = async () => {
			if (concession?.id) {
				const result = await getMenuItems(concession.id)
				// Show error only if component is still mounted
				if (isMounted && !result.success && result.error) {
					showAlert({
						title: 'Error',
						message: result.error,
					})
				}
			}
		}

		fetchItems()

		return () => {
			isMounted = false
		}
	}, [concession?.id])

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator
					size="large"
					color={colors.primary}
				/>
				<Text style={styles.loadingText}>Loading menu...</Text>
			</View>
		)
	}

	return (
		<DynamicKeyboardView>
			<DynamicScrollView
				styles={styles.container}
				autoCenter={false}
				showsVerticalScrollIndicator={true}>
				<View style={styles.scrollContent}>
					{/* Header Actions */}
					<View style={styles.headerActions}>
						<AddMenuItemButton />

						<ManageCategoriesButton />
					</View>

					{/* Menu Items List */}
					{menuItems.length === 0 ? (
						<View style={styles.emptyState}>
							<MaterialCommunityIcons
								name="food-off"
								size={64}
								color={colors.placeholder}
							/>
							<Text style={styles.emptyStateText}>No menu items yet</Text>
						</View>
					) : (
						<View style={styles.menuItemsList}>
							{menuItems.map((item) => (
								<MenuItemCard
									key={item.id}
									id={item.id}
									name={item.name}
									basePrice={item.basePrice}
									imageUrl={item.imageUrl}
									availability={item.availability}
									showAlert={showAlert}
									showConfirmation={showConfirmation}
									onToggleAvailability={async (itemId, currentAvailability) => {
										const result = await toggleAvailability(
											itemId,
											currentAvailability
										)
										if (result.success) {
											showAlert({
												title: 'Success',
												message: `Item marked as ${
													currentAvailability ? 'unavailable' : 'available'
												}`,
											})
										}
									}}
									onDelete={async (itemId) => {
										const result = await deleteMenuItem(itemId)
										if (result.success) {
											showAlert({
												title: 'Deleted',
												message: 'Menu item has been deleted successfully',
											})
										}
									}}
								/>
							))}
						</View>
					)}
				</View>
			</DynamicScrollView>

			<AlertModal
				visible={visible}
				onClose={hideAlert}
				title={title}
				message={message}
			/>

			<ConfirmationModal
				visible={confirmVisible}
				onClose={hideConfirmation}
				title={confirmProps.title}
				message={confirmProps.message}
				confirmText={confirmProps.confirmText}
				cancelText={confirmProps.cancelText}
				confirmStyle={confirmProps.confirmStyle}
				onConfirm={confirmProps.onConfirm}
			/>
		</DynamicKeyboardView>
	)
}

export default MenuScreen
