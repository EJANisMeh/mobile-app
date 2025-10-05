import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { CustomerStackParamList } from '../types/navigation'

// Import screen components
import MenuScreen from '../screens/customer/MenuScreen'
import CartScreen from '../screens/customer/CartScreen'
import OrdersScreen from '../screens/customer/OrdersScreen'
import NotificationsScreen from '../screens/customer/NotificationsScreen'
import ProfileScreen from '../screens/customer/ProfileScreen'

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
				}}
			/>
			<Tab.Screen
				name="Cart"
				component={CartScreen}
				options={{
					title: 'Cart',
					tabBarLabel: 'Cart',
				}}
			/>
			<Tab.Screen
				name="Orders"
				component={OrdersScreen}
				options={{
					title: 'My Orders',
					tabBarLabel: 'Orders',
				}}
			/>
			<Tab.Screen
				name="Notifications"
				component={NotificationsScreen}
				options={{
					title: 'Notifications',
					tabBarLabel: 'Alerts',
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					title: 'Profile',
					tabBarLabel: 'Profile',
				}}
			/>
		</Tab.Navigator>
	)
}

export default CustomerStack
