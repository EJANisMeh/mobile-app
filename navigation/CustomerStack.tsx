import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { CustomerStackParamList } from '../types/navigation'
import { View, Text, StyleSheet } from 'react-native'

const Tab = createBottomTabNavigator<CustomerStackParamList>()

// Placeholder screens for now
const MenuScreen: React.FC = () => (
	<View style={styles.placeholder}>
		<Text style={styles.placeholderText}>Menu Screen</Text>
		<Text style={styles.placeholderSubtext}>Coming Soon</Text>
	</View>
)

const CartScreen: React.FC = () => (
	<View style={styles.placeholder}>
		<Text style={styles.placeholderText}>Cart Screen</Text>
		<Text style={styles.placeholderSubtext}>Coming Soon</Text>
	</View>
)

const OrdersScreen: React.FC = () => (
	<View style={styles.placeholder}>
		<Text style={styles.placeholderText}>Orders Screen</Text>
		<Text style={styles.placeholderSubtext}>Coming Soon</Text>
	</View>
)

const NotificationsScreen: React.FC = () => (
	<View style={styles.placeholder}>
		<Text style={styles.placeholderText}>Notifications Screen</Text>
		<Text style={styles.placeholderSubtext}>Coming Soon</Text>
	</View>
)

const ProfileScreen: React.FC = () => (
	<View style={styles.placeholder}>
		<Text style={styles.placeholderText}>Profile Screen</Text>
		<Text style={styles.placeholderSubtext}>Coming Soon</Text>
	</View>
)

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

const styles = StyleSheet.create({
	placeholder: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f8f9fa',
	},
	placeholderText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 8,
	},
	placeholderSubtext: {
		fontSize: 16,
		color: '#666',
	},
})

export default CustomerStack
