import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ConcessionaireStackParamList } from '../types/navigation'

// Import screen components
import MenuScreen from '../screens/concessionaire/menu'
import OrdersScreen from '../screens/concessionaire/orders'
import ConcessionScreen from '../screens/concessionaire/concession'
import NotificationsScreen from '../screens/concessionaire/notification'
import ProfileScreen from '../screens/concessionaire/profile'

const Tab = createBottomTabNavigator<ConcessionaireStackParamList>()

const ConcessionaireStack: React.FC = () => {
	return (
		<Tab.Navigator
			initialRouteName="Orders"
			screenOptions={{
				tabBarActiveTintColor: '#28a745',
				tabBarInactiveTintColor: '#6c757d',
				headerShown: true,
			}}>
			<Tab.Screen
				name="Orders"
				component={OrdersScreen}
				options={{
					title: 'Orders',
					tabBarLabel: 'Orders',
				}}
			/>
			<Tab.Screen
				name="Menu"
				component={MenuScreen}
				options={{
					title: 'Menu',
					tabBarLabel: 'Menu',
				}}
			/>
			<Tab.Screen
				name="Concession"
				component={ConcessionScreen}
				options={{
					title: 'Concession',
					tabBarLabel: 'Concession',
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

export default ConcessionaireStack
