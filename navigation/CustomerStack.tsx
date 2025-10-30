import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { CustomerStackParamList } from '../types/navigation'

// Import screen components
import MenuScreen from '../screens/customer/menu'
import CartScreen from '../screens/customer/cart'
import OrdersScreen from '../screens/customer/orders'
import NotificationsScreen from '../screens/customer/notification'
import ProfileScreen from '../screens/customer/profile'

const Tab = createBottomTabNavigator<CustomerStackParamList>()

const CustomerStack: React.FC = () => {
	return (
		<Tab.Navigator
			initialRouteName="Menu"
			screenOptions={{
				tabBarActiveTintColor: '#007bff',
				tabBarInactiveTintColor: '#6c757d',
				headerShown: true,
			}}>
			<Tab.Screen
				name="Menu"
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
				name="Cart"
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
				name="Orders"
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
				name="Notifications"
				component={NotificationsScreen}
				options={{
					title: 'Notifications',
					tabBarLabel: 'Alerts',
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
				name="Profile"
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

export default CustomerStack
