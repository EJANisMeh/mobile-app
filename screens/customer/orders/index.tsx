import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useAuthContext, useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createCustomerOrdersStyles } from '../../../styles/customer'
import { DynamicKeyboardView } from '../../../components'
import {
	OrderCard,
	OrderSearchBar,
	OrderFilterModal,
	OrderSortModal,
} from '../../../components/customer/orders'
import { orderApi } from '../../../services/api'
import type {
	CustomerOrder,
	OrderFilters,
	SortRule,
	OrderSortField,
} from '../../../types'

const OrdersScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const { user } = useAuthContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerOrdersStyles(colors, responsive)

	const [orders, setOrders] = useState<CustomerOrder[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [filterModalVisible, setFilterModalVisible] = useState(false)
	const [sortModalVisible, setSortModalVisible] = useState(false)

	const [filters, setFilters] = useState<OrderFilters>({
		searchQuery: '',
		searchField: 'all',
		statusFilter: null,
		orderModeFilter: null,
		dateFrom: null,
		dateTo: null,
	})

	const [sortRules, setSortRules] = useState<SortRule[]>([
		{ field: 'createdAt', direction: 'desc' },
	])

	const loadOrders = useCallback(async () => {
		if (!user?.id) {
			setOrders([])
			setLoading(false)
			return
		}

		setLoading(true)
		setError(null)
		try {
			const response = await orderApi.getOrdersByCustomer(user.id)
			if (response.success) {
				setOrders(response.orders as CustomerOrder[])
			} else {
				setError(response.error || 'Failed to load orders')
			}
		} catch (err) {
			console.error('Load orders error:', err)
			setError('Failed to load your orders. Please try again.')
		} finally {
			setLoading(false)
		}
	}, [user?.id])

	useFocusEffect(
		useCallback(() => {
			void loadOrders()
		}, [loadOrders])
	)

	const availableStatuses = useMemo(() => {
		const statusSet = new Set<string>()
		orders.forEach((order) => {
			if (order.order_statuses?.code) {
				statusSet.add(order.order_statuses.code)
			}
		})
		return Array.from(statusSet).sort()
	}, [orders])

	const filteredOrders = useMemo(() => {
		let result = [...orders]

		// Apply search
		if (filters.searchQuery.trim()) {
			const query = filters.searchQuery.toLowerCase()
			result = result.filter((order) => {
				if (filters.searchField === 'concessionName') {
					return order.concession?.name.toLowerCase().includes(query)
				}
				if (filters.searchField === 'status') {
					return (
						order.order_statuses?.code.toLowerCase().includes(query) ||
						order.order_statuses?.description?.toLowerCase().includes(query)
					)
				}
				// 'all' - search in all fields
				return (
					order.concession?.name.toLowerCase().includes(query) ||
					order.order_statuses?.code.toLowerCase().includes(query) ||
					order.order_statuses?.description?.toLowerCase().includes(query) ||
					order.id.toString().includes(query)
				)
			})
		}

		// Apply status filter
		if (filters.statusFilter) {
			result = result.filter(
				(order) => order.order_statuses?.code === filters.statusFilter
			)
		}

		// Apply order mode filter
		if (filters.orderModeFilter) {
			result = result.filter(
				(order) => order.orderMode === filters.orderModeFilter
			)
		}

		return result
	}, [orders, filters])

	const sortedOrders = useMemo(() => {
		const result = [...filteredOrders]

		result.sort((a, b) => {
			for (const rule of sortRules) {
				let comparison = 0

				switch (rule.field) {
					case 'concessionName':
						const nameA = a.concession?.name || ''
						const nameB = b.concession?.name || ''
						comparison = nameA.localeCompare(nameB)
						break
					case 'total':
						comparison = Number(a.total) - Number(b.total)
						break
					case 'status':
						const statusA = a.order_statuses?.code || ''
						const statusB = b.order_statuses?.code || ''
						comparison = statusA.localeCompare(statusB)
						break
					case 'orderMode':
						comparison = a.orderMode.localeCompare(b.orderMode)
						break
					case 'createdAt':
						comparison =
							new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
						break
					case 'scheduledFor':
						const dateA = a.scheduledFor ? new Date(a.scheduledFor).getTime() : 0
						const dateB = b.scheduledFor ? new Date(b.scheduledFor).getTime() : 0
						comparison = dateA - dateB
						break
				}

				if (comparison !== 0) {
					return rule.direction === 'asc' ? comparison : -comparison
				}
			}

			return 0
		})

		return result
	}, [filteredOrders, sortRules])

	const formatCurrency = useCallback((value: number) => `₱${value.toFixed(2)}`, [])

	const formatDate = useCallback((date: Date) => {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}, [])

	const handleOrderPress = (order: CustomerOrder) => {
		// TODO: Navigate to order details screen
		console.log('Order pressed:', order.id)
	}

	const handleApplyFilters = (newFilters: OrderFilters) => {
		setFilters(newFilters)
	}

	const handleApplySort = (newSortRules: SortRule[]) => {
		setSortRules(newSortRules)
	}

	let content: React.ReactNode

	if (!user) {
		content = (
			<View style={styles.stateContainer}>
				<Text style={styles.stateTitle}>Sign in required</Text>
				<Text style={styles.stateMessage}>
					Please sign in to view your orders.
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
				<Text style={styles.stateMessage}>Loading your orders...</Text>
			</View>
		)
	} else if (error) {
		content = (
			<View style={styles.stateContainer}>
				<Text style={styles.stateTitle}>Unable to load orders</Text>
				<Text style={styles.stateMessage}>{error}</Text>
			</View>
		)
	} else if (sortedOrders.length === 0) {
		content = (
			<View style={styles.stateContainer}>
				<Text style={styles.stateTitle}>
					{orders.length === 0 ? 'No orders yet' : 'No orders found'}
				</Text>
				<Text style={styles.stateMessage}>
					{orders.length === 0
						? 'Your orders will appear here once you place them.'
						: 'Try adjusting your search or filters.'}
				</Text>
			</View>
		)
	} else {
		content = (
			<FlatList
				data={sortedOrders}
				keyExtractor={(item) => item.id.toString()}
				style={styles.ordersList}
				contentContainerStyle={styles.ordersListContent}
				renderItem={({ item }) => (
					<OrderCard
						order={item}
						onPress={handleOrderPress}
						styles={styles}
						formatCurrency={formatCurrency}
						formatDate={formatDate}
					/>
				)}
				showsVerticalScrollIndicator={true}
			/>
		)
	}

	return (
		<DynamicKeyboardView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>My Orders</Text>
			</View>

			{user && (
				<OrderSearchBar
					searchQuery={filters.searchQuery}
					onSearchChange={(query) =>
						setFilters({ ...filters, searchQuery: query })
					}
					onFilterPress={() => setFilterModalVisible(true)}
					onSortPress={() => setSortModalVisible(true)}
					styles={styles}
					colors={colors}
				/>
			)}

			{content}

			<OrderFilterModal
				visible={filterModalVisible}
				onClose={() => setFilterModalVisible(false)}
				onApply={handleApplyFilters}
				currentFilters={filters}
				availableStatuses={availableStatuses}
			/>

			<OrderSortModal
				visible={sortModalVisible}
				onClose={() => setSortModalVisible(false)}
				onApply={handleApplySort}
				currentSortRules={sortRules}
			/>
		</DynamicKeyboardView>
	)
}

export default OrdersScreen
