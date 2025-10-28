import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { ConcessionaireStackParamList } from '../types/navigation'

// Import screen components
import MenuScreen from '../screens/concessionaire/menu'
import OrdersScreen from '../screens/concessionaire/orders'
import ConcessionScreen from '../screens/concessionaire/concession'
import EditConcessionDetailsScreen from '../screens/concessionaire/concession/editDetails'
import ManagePaymentMethodsScreen from '../screens/concessionaire/concession/managePaymentMethods'
import CategoryManagementScreen from '../screens/concessionaire/menu/categoryManagement'
import NotificationsScreen from '../screens/concessionaire/notification'
import ProfileScreen from '../screens/concessionaire/profile'
import { MaterialCommunityIcons } from '@expo/vector-icons'

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
					headerShown: false,
					title: 'Category Management',
					presentation: 'modal',
					headerLeft: () => null,
				}}
			/>
			<Stack.Screen
				name="AddMenuItem"
				component={MenuScreen}
				options={{
					headerShown: true,
					title: 'Add Menu Item',
					presentation: 'modal',
					headerLeft: () => null,
				}}
			/>
			<Stack.Screen
				name="EditMenuItem"
				component={MenuScreen}
				options={{
					headerShown: true,
					title: 'Edit Menu Item',
					presentation: 'modal',
					headerLeft: () => null,
				}}
			/>
		</Stack.Navigator>
	)
}

export default ConcessionaireStack
