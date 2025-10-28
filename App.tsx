import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { AppProvider, useThemeContext } from './context'
import { RootNavigator } from './navigation'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const AppContent: React.FC = () => {
	const { mode } = useThemeContext()

	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<RootNavigator />
				<StatusBar style={mode === 'light' ? 'dark' : 'light'} />
			</NavigationContainer>
		</SafeAreaProvider>
	)
}

export default function App() {
	return (
		<AppProvider>
			<AppContent />
		</AppProvider>
	)
}
