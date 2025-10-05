import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ConcessionaireStackParamList } from '../types/navigation'

// Import screen components
import MenuScreen from '../screens/concessionaire/MenuScreen'
import OrdersScreen from '../screens/concessionaire/OrdersScreen'
import ConcessionScreen from '../screens/concessionaire/ConcessionScreen'
import ScanQRScreen from '../screens/concessionaire/ScanQRScreen'
import NotificationsScreen from '../screens/concessionaire/NotificationsScreen'
import ProfileScreen from '../screens/concessionaire/ProfileScreen'

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
					title: 'My Concession',
					tabBarLabel: 'Concession',
				}}
			/>
			<Tab.Screen
				name="ScanQR"
				component={ScanQRScreen}
				options={{
					title: 'Scan QR',
					tabBarLabel: 'Scan',
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
