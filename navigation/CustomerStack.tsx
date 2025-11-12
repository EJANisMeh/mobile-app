import React, { useState, useCallback } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { CustomerStackParamList } from '../types/navigation'
import { useAuthContext } from '../context'
import { notificationApi } from '../services/api'

// Import screen components
import MenuScreen from '../screens/customer/menu'
import CartScreen from '../screens/customer/cart'
import OrdersScreen from '../screens/customer/orders'
import NotificationsScreen from '../screens/customer/notification'
import ProfileScreen from '../screens/customer/profile'
import AccountDetailsScreen from '../screens/customer/accountDetails'
import MenuItemViewScreen from '../screens/customer/menu/menuItemView'
import FullMenuListScreen from '../screens/customer/menu/fullMenuList'
import OrderDetailsScreen from '../screens/customer/orders/orderDetails'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator<CustomerStackParamList>()

const TabNavigator: React.FC = () => {
	const { user } = useAuthContext()
	const [unreadCount, setUnreadCount] = useState(0)

	const loadUnreadCount = useCallback(async () => {
		if (!user?.id) return

		try {
			const response = await notificationApi.getNotifications(user.id)
			if (response.success && response.notifications) {
				const unread = response.notifications.filter((n) => !n.isRead).length
				setUnreadCount(unread)
			}
		} catch (err) {
			console.error('Load unread count error:', err)
		}
	}, [user?.id])

	useFocusEffect(
		useCallback(() => {
			void loadUnreadCount()
		}, [loadUnreadCount])
	)

	return (
		<Tab.Navigator
			initialRouteName="MenuTab"
			screenOptions={{
				tabBarActiveTintColor: '#007bff',
				tabBarInactiveTintColor: '#6c757d',
				headerShown: false,
			}}>
			<Tab.Screen
				name="MenuTab"
				component={MenuScreen}
				options={{
					title: 'Menu',
					tabBarLabel: 'Menu',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="bulletin-board"
							color={color}
							size={size}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="CartTab"
				component={CartScreen}
				options={{
					title: 'Cart',
					tabBarLabel: 'Cart',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="cart"
							color={color}
							size={size}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="OrdersTab"
				component={OrdersScreen}
				options={{
					title: 'My Orders',
					tabBarLabel: 'Orders',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="food"
							color={color}
							size={size}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="NotificationsTab"
				component={NotificationsScreen}
				options={{
					title: 'Notifications',
					tabBarLabel: 'Alerts',
					tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="bell"
							color={color}
							size={size}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="ProfileTab"
				component={ProfileScreen}
				options={{
					title: 'Profile',
					tabBarLabel: 'Profile',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="account"
							color={color}
							size={size}
						/>
					),
				}}
			/>
		</Tab.Navigator>
	)
}

const CustomerStack: React.FC = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<Stack.Screen
				name="Menu"
				component={TabNavigator}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="MenuItemView"
				component={MenuItemViewScreen}
				options={{ title: 'Menu Item' }}
			/>
			<Stack.Screen
				name="FullMenuList"
				component={FullMenuListScreen}
				options={({ route }) => ({
					title: route.params?.concessionName || 'Menu Items',
				})}
			/>
			<Stack.Screen
				name="OrderDetails"
				component={OrderDetailsScreen}
				options={{ title: 'Order Details', headerShown: true }}
			/>
			<Stack.Screen
				name="AccountDetails"
				component={AccountDetailsScreen}
				options={{ title: 'Account Details', headerShown: true }}
			/>
		</Stack.Navigator>
	)
}

export default CustomerStack
