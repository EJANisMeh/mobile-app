import React, { useCallback, useMemo, useState } from 'react'
import { View, Text, ActivityIndicator, Image } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useAuthContext, useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createCustomerCartStyles } from '../../../styles/customer'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'
import { loadCartItemsForUser } from '../../../utils'
import type { CartItem } from '../../../types'

const CartScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const { user } = useAuthContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerCartStyles(colors, responsive)
	const [cartItems, setCartItems] = useState<CartItem[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const refreshCart = useCallback(async () => {
		if (!user?.id) {
			setCartItems([])
			setError(null)
			return
		}

		setLoading(true)
		setError(null)
		try {
			const items = await loadCartItemsForUser(user.id)
			setCartItems(items)
		} catch (err) {
			console.error('Cart load error:', err)
			setError('Failed to load your cart. Please try again.')
		} finally {
			setLoading(false)
		}
	}, [user?.id])

	useFocusEffect(
		useCallback(() => {
			void refreshCart()
		}, [refreshCart])
	)

	const totalItems = useMemo(
		() => cartItems.reduce((sum, item) => sum + item.quantity, 0),
		[cartItems]
	)

	const totalAmount = useMemo(
		() => cartItems.reduce((sum, item) => sum + item.totalPrice, 0),
		[cartItems]
	)

	const formatCurrency = useCallback(
		(value: number) => `₱${value.toFixed(2)}`,
		[]
	)

	let content: React.ReactNode

	if (!user) {
		content = (
			<View style={styles.stateContainer}>
				<Text style={styles.stateTitle}>Sign in to view your cart</Text>
				<Text style={styles.stateMessage}>
					Please sign in so we can load the cart saved for your account.
				</Text>
			</View>
		)
	} else if (loading) {
		content = (
			<View style={styles.stateContainer}>
				<ActivityIndicator
					size="large"
					color={colors.primary}
				/>
				<Text style={styles.stateMessage}>Loading your cart...</Text>
			</View>
		)
	} else if (error) {
		content = (
			<View style={styles.stateContainer}>
				<Text style={styles.stateTitle}>Unable to load cart</Text>
				<Text style={styles.stateMessage}>{error}</Text>
			</View>
		)
	} else if (cartItems.length === 0) {
		content = (
			<View style={styles.stateContainer}>
				<Text style={styles.stateTitle}>Your cart is empty</Text>
				<Text style={styles.stateMessage}>Items you add will appear here.</Text>
			</View>
		)
	} else {
		content = (
			<View style={styles.cartContent}>
				{cartItems.map((item) => (
					<View
						key={item.id}
						style={styles.cartItemCard}>
						<View style={styles.cartItemImageWrapper}>
							{item.image ? (
								<Image
									source={{ uri: item.image }}
									style={styles.cartItemImage}
									resizeMode="cover"
								/>
							) : (
								<View style={styles.cartItemPlaceholder}>
									<Ionicons
										name="fast-food-outline"
										size={responsive.getResponsiveFontSize(20)}
										color={colors.textSecondary}
									/>
								</View>
							)}
						</View>

						<View style={styles.cartItemDetails}>
							<Text style={styles.cartItemName}>{item.name}</Text>
							{item.categoryName ? (
								<Text style={styles.cartItemCategory}>{item.categoryName}</Text>
							) : null}

							{item.variationGroups
								.filter((group) => group.selectedOptions.length > 0)
								.map((group) => (
									<Text
										key={`${item.id}-variation-${group.groupId}`}
										style={styles.cartItemMetaText}>
										{group.groupName}:{' '}
										{group.selectedOptions
											.map((option) => option.optionName)
											.join(', ')}
									</Text>
								))}

							{item.addons.length > 0 ? (
								<Text style={styles.cartItemMetaText}>
									Add-ons:{' '}
									{item.addons.map((addon) => addon.addonName).join(', ')}
								</Text>
							) : null}

							<Text style={styles.cartItemUnitPrice}>
								{formatCurrency(item.unitPrice)} each
							</Text>

							<View style={styles.cartItemFooter}>
								<Text style={styles.cartItemQuantity}>
									Qty: {item.quantity}
								</Text>
								<Text style={styles.cartItemPrice}>
									{formatCurrency(item.totalPrice)}
								</Text>
							</View>
						</View>
					</View>
				))}

				<View style={styles.totalsCard}>
					<View style={styles.totalRow}>
						<Text style={styles.totalLabel}>Subtotal</Text>
						<Text style={styles.totalValue}>{formatCurrency(totalAmount)}</Text>
					</View>
				</View>
			</View>
		)
	}

	return (
		<DynamicKeyboardView>
			<DynamicScrollView
				style={styles.container}
				showsVerticalScrollIndicator>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>Cart</Text>
					{user ? (
						<Text style={styles.headerSubtext}>
							{totalItems} {totalItems === 1 ? 'item' : 'items'}
						</Text>
					) : null}
				</View>

				{content}
			</DynamicScrollView>
		</DynamicKeyboardView>
	)
}

export default CartScreen
