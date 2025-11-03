import React from 'react'
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'
import { createCustomerFullMenuStyles } from '../../../styles/customer'
import { useConcessionMenuItems } from '../../../hooks/useBackend'
import { MenuItemListItem } from '../../../components/customer/menu'
import { useCustomerNavigation } from '../../../hooks/useNavigation'
import type { CustomerStackParamList } from '../../../types'

type FullMenuRouteProp = RouteProp<CustomerStackParamList, 'FullMenuList'>

const FullMenuListScreen: React.FC = () => {
	const route = useRoute<FullMenuRouteProp>()
	const navigation = useCustomerNavigation()
	const { concessionId, concessionName } = route.params
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerFullMenuStyles(colors, responsive)
	const { menuItems, loading, error, refetch } =
		useConcessionMenuItems(concessionId)

	const handleMenuItemPress = (menuItemId: number) => {
		navigation.navigate('MenuItemView', { menuItemId })
	}

	const renderLoadingState = () => (
		<View style={styles.stateContainer}>
			<ActivityIndicator
				size="large"
				color={colors.primary}
			/>
			<Text style={styles.stateMessage}>Loading menu items...</Text>
		</View>
	)

	const renderErrorState = () => (
		<View style={styles.stateContainer}>
			<Text style={styles.stateTitle}>Unable to load menu</Text>
			<Text style={styles.stateMessage}>
				{error || 'Failed to load menu items. Please try again.'}
			</Text>
			<TouchableOpacity
				style={styles.retryButton}
				onPress={refetch}
				accessibilityRole="button"
				accessibilityLabel="Retry loading menu items">
				<Text style={styles.retryButtonText}>Try Again</Text>
			</TouchableOpacity>
		</View>
	)

	const renderEmptyState = () => (
		<View style={styles.stateContainer}>
			<Text style={styles.stateTitle}>No menu items yet</Text>
			<Text style={styles.stateMessage}>
				This concession has no menu items available right now.
			</Text>
		</View>
	)

	return (
		<DynamicKeyboardView>
			<DynamicScrollView
				styles={styles.container}
				showsVerticalScrollIndicator={true}>
				<View style={styles.headerContainer}>
					<Text style={styles.concessionTitle}>{concessionName}</Text>
					<Text style={styles.itemCountLabel}>
						{menuItems.length} {menuItems.length === 1 ? 'item' : 'items'} found
					</Text>
				</View>

				{loading && menuItems.length === 0 ? renderLoadingState() : null}
				{!loading && error ? renderErrorState() : null}
				{!loading && !error && menuItems.length === 0
					? renderEmptyState()
					: null}

				{menuItems.map((item) => (
					<MenuItemListItem
						key={item.id}
						item={item}
						onPress={() => handleMenuItemPress(item.id)}
					/>
				))}

				{loading && menuItems.length > 0 ? (
					<View style={styles.stateContainer}>
						<ActivityIndicator
							size="small"
							color={colors.primary}
						/>
					</View>
				) : null}
			</DynamicScrollView>
		</DynamicKeyboardView>
	)
}

export default FullMenuListScreen
