import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useAuth } from '../context'
import { RootStackParamList } from '../types/navigation'
import AuthStack from './AuthStack'
import CustomerStack from './CustomerStack'
import ConcessionaireStack from './ConcessionaireStack'
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
	Alert,
} from 'react-native'
import {
	clearAuthData,
	logStoredAuthData,
	simulateAppTermination,
} from '../backend/auth'

const Stack = createStackNavigator<RootStackParamList>()

const LoadingScreen: React.FC = () => (
	<View style={styles.loadingContainer}>
		<ActivityIndicator
			size="large"
			color="#007bff"
		/>
		<Text style={styles.loadingText}>Loading...</Text>
	</View>
)

const RootNavigator: React.FC = () => {
	const { state } = useAuth()

	// Show loading screen while checking auth status
	if (state.isLoading) {
		return <LoadingScreen />
	}

	// Log authentication state and user object for debugging
	console.log('Auth:', {
		isAuthenticated: state.isAuthenticated,
		user: state.user,
	})

	// Debug function to clear auth data
	const handleClearAuthData = async () => {
		Alert.alert('Debug Menu', 'Choose debug action:', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Clear Auth Data',
				style: 'destructive',
				onPress: async () => {
					await clearAuthData()
					console.log('Auth data cleared manually')
				},
			},
			{
				text: 'Log Auth Data',
				onPress: async () => {
					await logStoredAuthData()
				},
			},
			{
				text: 'Simulate Termination',
				onPress: async () => {
					await simulateAppTermination()
				},
			},
		])
	}

	// Show debug button when authenticated (for development)
	const showDebugButton = state.isAuthenticated && __DEV__

	return (
		<>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				{!state.isAuthenticated ? (
					<Stack.Screen
						name="Auth"
						component={AuthStack}
					/>
				) : (
					<>
						{state.user?.role === 'CUSTOMER' ? (
							<Stack.Screen
								name="Customer"
								component={CustomerStack}
							/>
						) : state.user?.role === 'CONCESSION_OWNER' ? (
							<Stack.Screen
								name="Concessionaire"
								component={ConcessionaireStack}
							/>
						) : (
							// Default to customer if role is not recognized
							<Stack.Screen
								name="Customer"
								component={CustomerStack}
							/>
						)}
					</>
				)}
			</Stack.Navigator>

			{/* Debug button for development */}
			{showDebugButton && (
				<TouchableOpacity
					style={styles.debugButton}
					onPress={handleClearAuthData}>
					<Text style={styles.debugButtonText}>�️ Debug Menu</Text>
				</TouchableOpacity>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f8f9fa',
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: '#666',
	},
	debugButton: {
		position: 'absolute',
		top: 50,
		right: 20,
		backgroundColor: '#ff4444',
		padding: 10,
		borderRadius: 8,
		zIndex: 9999,
	},
	debugButtonText: {
		color: 'white',
		fontSize: 12,
		fontWeight: 'bold',
	},
})

export default RootNavigator
