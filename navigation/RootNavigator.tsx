import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useAuth } from '../context'
import { RootStackParamList } from '../types/navigation'
import AuthStack from './AuthStack'
import CustomerStack from './CustomerStack'
import ConcessionaireStack from './ConcessionaireStack'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'

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

	return (
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
})

export default RootNavigator
