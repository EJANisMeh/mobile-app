import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ConcessionaireStackParamList } from '../types/navigation'
import { View, Text, StyleSheet } from 'react-native'

const Tab = createBottomTabNavigator<ConcessionaireStackParamList>()

// Placeholder screens for now
const MenuScreen: React.FC = () => (
	<View style={styles.placeholder}>
		<Text style={styles.placeholderText}>Menu Management</Text>
		<Text style={styles.placeholderSubtext}>Coming Soon</Text>
	</View>
)

const OrdersScreen: React.FC = () => (
	<View style={styles.placeholder}>
		<Text style={styles.placeholderText}>Incoming Orders</Text>
		<Text style={styles.placeholderSubtext}>Coming Soon</Text>
	</View>
)

const ConcessionScreen: React.FC = () => (
	<View style={styles.placeholder}>
		<Text style={styles.placeholderText}>My Concession</Text>
		<Text style={styles.placeholderSubtext}>Coming Soon</Text>
	</View>
)

const ScanQRScreen: React.FC = () => (
	<View style={styles.placeholder}>
		<Text style={styles.placeholderText}>Scan QR</Text>
		<Text style={styles.placeholderSubtext}>Coming Soon</Text>
	</View>
)

const NotificationsScreen: React.FC = () => (
	<View style={styles.placeholder}>
		<Text style={styles.placeholderText}>Notifications</Text>
		<Text style={styles.placeholderSubtext}>Coming Soon</Text>
	</View>
)

const ProfileScreen: React.FC = () => (
	<View style={styles.placeholder}>
		<Text style={styles.placeholderText}>Profile</Text>
		<Text style={styles.placeholderSubtext}>Coming Soon</Text>
	</View>
)

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

export default ConcessionaireStack
