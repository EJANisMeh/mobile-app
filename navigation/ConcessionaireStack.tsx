import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ConcessionaireStackParamList } from '../types/navigation'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { LogoutButton } from '../components'
import { useAuth } from '../context'

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

const ProfileScreen: React.FC = () => {
	const { state } = useAuth()

	return (
		<ScrollView style={styles.profileContainer}>
			<View style={styles.profileContent}>
				<Text style={styles.profileTitle}>Concessionaire Profile</Text>

				{/* User Information */}
				{state.user && (
					<View style={styles.userInfo}>
						<Text style={styles.infoLabel}>Name:</Text>
						<Text style={styles.infoValue}>
							{state.user.fname} {state.user.lname}
						</Text>

						<Text style={styles.infoLabel}>Email:</Text>
						<Text style={styles.infoValue}>{state.user.email}</Text>

						<Text style={styles.infoLabel}>Role:</Text>
						<Text style={styles.infoValue}>{state.user.role}</Text>

						<Text style={styles.infoLabel}>Concession ID:</Text>
						<Text style={styles.infoValue}>
							{state.user.concession_id || 'Not assigned'}
						</Text>

						<Text style={styles.infoLabel}>Status:</Text>
						<Text style={styles.infoValue}>
							{state.user.emailVerified ? 'Verified' : 'Unverified'}
						</Text>
					</View>
				)}

				{/* Logout Button */}
				<LogoutButton />
			</View>
		</ScrollView>
	)
}

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
	profileContainer: {
		flex: 1,
		backgroundColor: '#f8f9fa',
	},
	profileContent: {
		padding: 20,
	},
	profileTitle: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 30,
		textAlign: 'center',
	},
	userInfo: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 12,
		marginBottom: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	infoLabel: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#555',
		marginTop: 12,
		marginBottom: 4,
	},
	infoValue: {
		fontSize: 16,
		color: '#333',
		marginBottom: 8,
	},
})

export default ConcessionaireStack
