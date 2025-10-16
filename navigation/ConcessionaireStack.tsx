import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { ConcessionaireStackParamList } from '../types/navigation'
import { MaterialCommunityIcons } from '@expo/vector-icons'

// Import screen components
import MenuScreen from '../screens/concessionaire/menu'
import OrdersScreen from '../screens/concessionaire/orders'
import ConcessionScreen from '../screens/concessionaire/concession'
import EditConcessionDetailsScreen from '../screens/concessionaire/concession/editDetails'
import NotificationsScreen from '../screens/concessionaire/notification'
import ProfileScreen from '../screens/concessionaire/profile'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator<ConcessionaireStackParamList>()

// Main tab navigator
const MainTabs: React.FC = () => {
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

// Root stack navigator with tabs and modal screens
const ConcessionaireStack: React.FC = () => {
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
				}}
			/>
		</Stack.Navigator>
	)
}

export default ConcessionaireStack
