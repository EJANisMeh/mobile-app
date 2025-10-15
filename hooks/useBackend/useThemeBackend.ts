import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type ThemeMode = 'light' | 'dark'

export interface ThemeColors {
	primary: string
	primaryDark: string
	secondary: string
	background: string
	surface: string
	card: string
	text: string
	textSecondary: string
	textOnPrimary: string
	border: string
	divider: string
	success: string
	warning: string
	error: string
	info: string
	inputBackground: string
	inputBorder: string
	inputText: string
	placeholder: string
}

const lightTheme: ThemeColors = {
	primary: '#DC143C',
	primaryDark: '#B91C3C',
	secondary: '#FF6B6B',
	background: '#FFFFFF',
	surface: '#F8F9FA',
	card: '#FFFFFF',
	text: '#1A1A1A',
	textSecondary: '#6B7280',
	textOnPrimary: '#FFFFFF',
	border: '#E5E7EB',
	divider: '#F3F4F6',
	success: '#10B981',
	warning: '#F59E0B',
	error: '#EF4444',
	info: '#3B82F6',
	inputBackground: '#FFFFFF',
	inputBorder: '#D1D5DB',
	inputText: '#1A1A1A',
	placeholder: '#9CA3AF',
}

const darkTheme: ThemeColors = {
	primary: '#DC143C',
	primaryDark: '#B91C3C',
	secondary: '#FF8A8A',
	background: '#000000',
	surface: '#1A1A1A',
	card: '#2D2D2D',
	text: '#FFFFFF',
	textSecondary: '#A3A3A3',
	textOnPrimary: '#FFFFFF',
	border: '#404040',
	divider: '#2D2D2D',
	success: '#22C55E',
	warning: '#FBBF24',
	error: '#F87171',
	info: '#60A5FA',
	inputBackground: '#2D2D2D',
	inputBorder: '#404040',
	inputText: '#FFFFFF',
	placeholder: '#6B7280',
}

export const useThemeBackend = () => {
	const [mode, setMode] = useState<ThemeMode>('light')

	useEffect(() => {
		loadTheme()
	}, [])

	useEffect(() => {
		saveTheme()
	}, [mode])

	const loadTheme = async () => {
		try {
			const savedTheme = await AsyncStorage.getItem('theme_mode')
			if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
				setMode(savedTheme)
			}
		} catch (error) {
			console.error('Failed to load theme:', error)
		}
	}

	const saveTheme = async () => {
		try {
			await AsyncStorage.setItem('theme_mode', mode)
		} catch (error) {
			console.error('Failed to save theme:', error)
		}
	}

	const toggleTheme = () => {
		setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
	}

	const setTheme = (newMode: ThemeMode) => {
		setMode(newMode)
	}

	const colors = mode === 'light' ? lightTheme : darkTheme

	return {
		mode,
		colors,
		toggleTheme,
		setTheme,
	}
}
