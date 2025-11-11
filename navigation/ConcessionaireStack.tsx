import React, { useEffect, useState, useCallback } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { ConcessionaireStackParamList } from '../types/navigation'
import { useAuthContext, useConcessionContext } from '../context'
import { useFocusEffect } from '@react-navigation/native'
import { notificationApi } from '../services/api'

// Import screen components
import MenuScreen from '../screens/concessionaire/menu'
import OrdersScreen from '../screens/concessionaire/orders'
import OrderDetailsScreen from '../screens/concessionaire/orders/orderDetails'
import ConcessionScreen from '../screens/concessionaire/concession'
import EditConcessionDetailsScreen from '../screens/concessionaire/concession/editDetails'
import ManagePaymentMethodsScreen from '../screens/concessionaire/concession/managePaymentMethods'
import CategoryManagementScreen from '../screens/concessionaire/menu/categoryManagement'
import AddMenuItemScreen from '../screens/concessionaire/menu/addItem'
import EditMenuItemScreen from '../screens/concessionaire/menu/editItem'
import NotificationsScreen from '../screens/concessionaire/notification'
import ProfileScreen from '../screens/concessionaire/profile'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator<ConcessionaireStackParamList>()

// Main tab navigator
const MainTabs: React.FC = () => {
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
			initialRouteName="Orders"
			screenOptions={{
				tabBarActiveTintColor: '#28a745',
				tabBarInactiveTintColor: '#6c757d',
				headerShown: false,
				headerLeft: () => null,
			}}>
			<Tab.Screen
				name="Orders"
				component={OrdersScreen}
				options={{
					title: 'Orders',
					tabBarLabel: 'Orders',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="food"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Menu"
				component={MenuScreen}
				options={{
					title: 'Menu',
					tabBarLabel: 'Menu',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="bulletin-board"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Concession"
				component={ConcessionScreen}
				options={{
					title: 'Concession',
					tabBarLabel: 'Concession',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="store"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Notifications"
				component={NotificationsScreen}
				options={{
					title: 'Notifications',
					tabBarLabel: 'Alerts',
					tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="bell"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					title: 'Profile',
					tabBarLabel: 'Profile',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="account"
							size={size}
							color={color}
						/>
					),
				}}
			/>
		</Tab.Navigator>
	)
}

// Root stack navigator with tabs and modal screens
const ConcessionaireStack: React.FC = () => {
	const { user } = useAuthContext()
	const { getConcession, concession } = useConcessionContext()

	// Load concession data globally when concessionaire stack mounts
	useEffect(() => {
		if (user?.concession_id && !concession) {
			getConcession(user.concession_id)
		}
	}, [user?.concession_id])

	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name="MainTabs"
				component={MainTabs}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="EditConcessionDetails"
				component={EditConcessionDetailsScreen}
				options={{
					headerShown: true,
					title: 'Edit Concession Details',
					presentation: 'modal',
					headerLeft: () => null,
				}}
			/>
			<Stack.Screen
				name="ManagePaymentMethods"
				component={ManagePaymentMethodsScreen}
				options={{
					headerShown: true,
					title: 'Manage Payment Methods',
					presentation: 'modal',
					headerLeft: () => null,
				}}
			/>
			<Stack.Screen
				name="CategoryManagement"
				component={CategoryManagementScreen}
				options={{
					headerShown: true,
					title: 'Categories',
					presentation: 'modal',
					headerLeft: () => null,
				}}
			/>
			<Stack.Screen
				name="AddMenuItem"
				component={AddMenuItemScreen}
				options={{
					headerShown: true,
					title: 'Add Menu Item',
					presentation: 'modal',
					headerLeft: () => null,
				}}
			/>
			<Stack.Screen
				name="EditMenuItem"
				component={EditMenuItemScreen}
				options={{
					headerShown: true,
					title: 'Edit Menu Item',
					presentation: 'modal',
					headerLeft: () => null,
				}}
			/>
			<Stack.Screen
				name="OrderDetails"
				component={OrderDetailsScreen}
				options={{
					headerShown: true,
					title: 'Order Details',
					presentation: 'modal',
					headerLeft: () => null,
				}}
			/>
		</Stack.Navigator>
	)
}

export default ConcessionaireStack
