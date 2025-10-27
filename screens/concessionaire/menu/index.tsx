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
import DynamicScrollView from '../../../components/DynamicScrollView'
import {
	MenuItemCard,
	AddMenuItemButton,
	ManageCategoriesButton,
} from '../../../components/concessionaire/menu'
import { AlertModal, ConfirmationModal } from '../../../components/modals'

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
		if (concession?.id) {
			getMenuItems(concession.id)
		}
	}, [concession?.id])

	// Show error if any
	useEffect(() => {
		if (error) {
			showAlert({
				title: 'Error',
				message: error,
			})
		}
	}, [error])

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
		<>
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
							<Text style={styles.emptyStateSubtext}>
								Add your first item to get started
							</Text>
						</View>
					) : (
						<View style={styles.menuItemsList}>
							{menuItems.map((item) => (
								<MenuItemCard
									key={item.id}
									id={item.id}
									name={item.name}
									basePrice={item.price}
									imageUrl={item.image_url}
									availability={item.available}
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
		</>
	)
}

export default MenuScreen
