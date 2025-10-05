import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useAuth, useTheme } from '../context'
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
} from 'react-native'
import { authApi, userApi, healthApi } from '../services/api'
import { MenuModal } from '../components'
import { useMenuModal } from '../hooks'

const Stack = createStackNavigator<RootStackParamList>()

// Debug menu toggle - set to false to hide debug menu
const SHOW_DEBUG_MENU = true

const LoadingScreen: React.FC = () => {
	const { colors } = useTheme()

	return (
		<View
			style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
			<ActivityIndicator
				size="large"
				color={colors.primary}
			/>
			<Text style={[styles.loadingText, { color: colors.textSecondary }]}>
				Loading...
			</Text>
		</View>
	)
}

const RootNavigator: React.FC = () => {
	const { user, isAuthenticated, isLoading, logout } = useAuth()
	const { mode, toggleTheme, colors } = useTheme()
	const debugMenuModal = useMenuModal()

	// Show loading screen while checking auth status
	if (isLoading) {
		return <LoadingScreen />
	}

	// Log authentication state and user object for debugging
	console.log('Auth:', {
		isAuthenticated: isAuthenticated,
		user: user,
	})

	// Debug function to clear auth data
	const handleClearAuthData = async () => {
		debugMenuModal.showMenu({
			title: 'Debug Menu',
			message: 'Choose debug action:',
			options: [
				{
					text: 'Clear Auth & Logout',
					style: 'destructive',
					onPress: async () => {
						await authApi.clearAuthData()
						await logout()
						console.log('Auth data cleared and logged out')
					},
				},
				{
					text: 'Log Auth Data',
					onPress: async () => {
						const user = await authApi.getStoredUser()
						console.log('Stored user data:', user)
					},
				},
				{
					text: 'Test Database',
					onPress: async () => {
						const result = await healthApi.testDatabase()
						console.log('Database test result:', result)
					},
				},
				{
					text: `Toggle Theme (${mode === 'light' ? 'to Dark' : 'to Light'})`,
					onPress: () => {
						toggleTheme()
					},
				},
				{
					text: 'Seed Test Users',
					onPress: async () => {
						const result = await userApi.seedTestUsers()
						console.log('Seed test users result:', result)
					},
				},
			],
		})
	}

	// Show debug button when authenticated and debug menu is enabled
	const showDebugButton = isAuthenticated && __DEV__ && SHOW_DEBUG_MENU

	return (
		<>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				{!isAuthenticated ? (
					<Stack.Screen
						name="Auth"
						component={AuthStack}
					/>
				) : (
					<>
						{user?.role === 'customer' ? (
							<Stack.Screen
								name="Customer"
								component={CustomerStack}
							/>
						) : user?.role === 'concessionaire' ? (
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
					style={[styles.debugButton, { backgroundColor: colors.error }]}
					onPress={handleClearAuthData}>
					<Text
						style={[styles.debugButtonText, { color: colors.textOnPrimary }]}>
						⚙️ Debug Menu
					</Text>
				</TouchableOpacity>
			)}

			<MenuModal
				visible={debugMenuModal.visible}
				onClose={debugMenuModal.hideMenu}
				{...debugMenuModal.props}
			/>
		</>
	)
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
	},
	debugButton: {
		position: 'absolute',
		top: 50,
		right: 20,
		padding: 10,
		borderRadius: 8,
		zIndex: 9999,
	},
	debugButtonText: {
		fontSize: 12,
		fontWeight: 'bold',
	},
})

export default RootNavigator
