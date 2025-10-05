import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type ThemeMode = 'light' | 'dark'

export interface ThemeColors {
	// Primary colors (school theme)
	primary: string
	primaryDark: string
	secondary: string
	
	// Background colors
	background: string
	surface: string
	card: string
	
	// Text colors
	text: string
	textSecondary: string
	textOnPrimary: string
	
	// Border and divider colors
	border: string
	divider: string
	
	// Status colors
	success: string
	warning: string
	error: string
	info: string
	
	// Input colors
	inputBackground: string
	inputBorder: string
	inputText: string
	placeholder: string
}

const lightTheme: ThemeColors = {
	// School theme: White/Red for light mode
	primary: '#DC143C', // Crimson red
	primaryDark: '#B91C3C', // Darker red
	secondary: '#FF6B6B', // Light red accent
	
	// Background colors
	background: '#FFFFFF', // Pure white
	surface: '#F8F9FA', // Off-white
	card: '#FFFFFF', // White cards
	
	// Text colors
	text: '#1A1A1A', // Dark text on white
	textSecondary: '#6B7280', // Gray text
	textOnPrimary: '#FFFFFF', // White text on red
	
	// Border and divider colors
	border: '#E5E7EB', // Light gray borders
	divider: '#F3F4F6', // Very light gray
	
	// Status colors
	success: '#10B981', // Green
	warning: '#F59E0B', // Amber
	error: '#EF4444', // Red
	info: '#3B82F6', // Blue
	
	// Input colors
	inputBackground: '#FFFFFF',
	inputBorder: '#D1D5DB',
	inputText: '#1A1A1A',
	placeholder: '#9CA3AF',
}

const darkTheme: ThemeColors = {
	// School theme: Black/Red for dark mode
	primary: '#DC143C', // Crimson red (same as light)
	primaryDark: '#B91C3C', // Darker red
	secondary: '#FF8A8A', // Lighter red for dark background
	
	// Background colors
	background: '#000000', // Pure black
	surface: '#1A1A1A', // Dark gray
	card: '#2D2D2D', // Lighter dark gray
	
	// Text colors
	text: '#FFFFFF', // White text on black
	textSecondary: '#A3A3A3', // Light gray text
	textOnPrimary: '#FFFFFF', // White text on red
	
	// Border and divider colors
	border: '#404040', // Dark gray borders
	divider: '#2D2D2D', // Darker gray
	
	// Status colors
	success: '#22C55E', // Brighter green for dark
	warning: '#FBBF24', // Brighter amber
	error: '#F87171', // Lighter red
	info: '#60A5FA', // Lighter blue
	
	// Input colors
	inputBackground: '#2D2D2D',
	inputBorder: '#404040',
	inputText: '#FFFFFF',
	placeholder: '#6B7280',
}

export interface ThemeContextType {
	mode: ThemeMode
	colors: ThemeColors
	toggleTheme: () => void
	setTheme: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
	children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	const [mode, setMode] = useState<ThemeMode>('light')

	// Load theme from storage on mount
	useEffect(() => {
		loadTheme()
	}, [])

	// Save theme to storage when it changes
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
		setMode(prev => prev === 'light' ? 'dark' : 'light')
	}

	const setTheme = (newMode: ThemeMode) => {
		setMode(newMode)
	}

	const colors = mode === 'light' ? lightTheme : darkTheme

	const value: ThemeContextType = {
		mode,
		colors,
		toggleTheme,
		setTheme,
	}

	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	)
}

export const useTheme = (): ThemeContextType => {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}

export default ThemeContext