import { useEffect } from 'react'
import { Platform } from 'react-native'
import * as NavigationBar from 'expo-navigation-bar'

/**
 * Hook to hide the Android navigation bar when the component mounts
 * and restore it when the component unmounts.
 */
export const useHideNavBar = () => {
	useEffect(() => {
		const hideNavigationBar = async () => {
			if (Platform.OS === 'android') {
				try {
					// Hide the navigation bar (system buttons)
					await NavigationBar.setVisibilityAsync('hidden')
					// Note: setBehaviorAsync is not needed with edge-to-edge mode
					// The system automatically handles swipe-to-show behavior
				} catch (error) {
					console.log('Error hiding navigation bar:', error)
				}
			}
		}

		const showNavigationBar = async () => {
			if (Platform.OS === 'android') {
				try {
					// Show the navigation bar when leaving the screen
					await NavigationBar.setVisibilityAsync('visible')
				} catch (error) {
					console.log('Error showing navigation bar:', error)
				}
			}
		}

		hideNavigationBar()

		// Cleanup: show navigation bar when component unmounts
		return () => {
			showNavigationBar()
		}
	}, [])
}
