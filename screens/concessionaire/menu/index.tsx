import React, { useState } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemeContext } from '../../../context'
import {
	useResponsiveDimensions,
	useAlertModal,
	useConfirmationModal,
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

	const { visible, title, message, showAlert, hideAlert } = useAlertModal()
	const {
		visible: confirmVisible,
		props: confirmProps,
		showConfirmation,
		hideConfirmation,
	} = useConfirmationModal()

	const [loading, setLoading] = useState(false)
	const [menuItems, setMenuItems] = useState<any[]>([]) // TODO: Replace with proper type





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
						<AddMenuItemButton showAlert={showAlert} />

						<ManageCategoriesButton showAlert={showAlert} />
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
									basePrice={item.basePrice}
									imageUrl={item.imageUrl}
									availability={item.availability}
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
