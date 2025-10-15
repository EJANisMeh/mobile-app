import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { AppProvider, useTheme } from './context'
import { RootNavigator } from './navigation'

const AppContent: React.FC = () => {
	const { mode } = useTheme()

	return (
		<NavigationContainer>
			<RootNavigator />
			<StatusBar style={mode === 'light' ? 'dark' : 'light'} />
		</NavigationContainer>
	)
}

export default function App() {
	return (
		<AppProvider>
			<AppContent />
		</AppProvider>
	)
}
