import { AppState, AppStateStatus } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Constants
const LAST_ACTIVE_KEY = 'lastActiveTimestamp'
const SESSION_TIMEOUT_MINUTES = 30 // Auto-logout after 30 minutes of inactivity
const SESSION_TIMEOUT_MS = SESSION_TIMEOUT_MINUTES * 60 * 1000

export interface AppStateManagerCallbacks {
	onAutoLogout: () => void
	onAppBackground: () => void
	onAppForeground: () => void
}

class AppStateManager {
	private appState: AppStateStatus = AppState.currentState
	private callbacks: AppStateManagerCallbacks | null = null
	private timeoutId: NodeJS.Timeout | null = null
	private appStateSubscription: any = null

	// Initialize the app state manager
	initialize(callbacks: AppStateManagerCallbacks) {
		this.callbacks = callbacks

		// Listen to app state changes
		this.appStateSubscription = AppState.addEventListener(
			'change',
			this.handleAppStateChange
		)

		// Check for auto-logout on app start
		this.checkForAutoLogout()

		// Update last active timestamp immediately
		this.updateLastActiveTimestamp()
	}

	// Clean up listeners
	cleanup() {
		if (this.appStateSubscription) {
			this.appStateSubscription.remove()
			this.appStateSubscription = null
		}
		if (this.timeoutId) {
			clearTimeout(this.timeoutId)
			this.timeoutId = null
		}
		this.callbacks = null
	}

	// Handle app state changes
	private handleAppStateChange = (nextAppState: AppStateStatus) => {
		console.log('App state changed:', this.appState, '->', nextAppState)

		// App going to background
		if (
			this.appState.match(/active/) &&
			nextAppState.match(/inactive|background/)
		) {
			console.log('App is going to background')
			this.updateLastActiveTimestamp()
			this.callbacks?.onAppBackground()
		}

		// App coming to foreground
		if (
			this.appState.match(/inactive|background/) &&
			nextAppState === 'active'
		) {
			console.log('App is coming to foreground')
			this.checkForAutoLogout()
			this.callbacks?.onAppForeground()
		}

		this.appState = nextAppState
	}

	// Update the last active timestamp
	private updateLastActiveTimestamp = async () => {
		try {
			const timestamp = Date.now().toString()
			await AsyncStorage.setItem(LAST_ACTIVE_KEY, timestamp)
			console.log(
				'Updated last active timestamp:',
				new Date(parseInt(timestamp))
			)
		} catch (error) {
			console.error('Failed to update last active timestamp:', error)
		}
	}

	// Check if the user should be auto-logged out
	private checkForAutoLogout = async () => {
		try {
			const lastActiveStr = await AsyncStorage.getItem(LAST_ACTIVE_KEY)

			if (!lastActiveStr) {
				// First time or no previous session
				this.updateLastActiveTimestamp()
				return
			}

			const lastActive = parseInt(lastActiveStr)
			const now = Date.now()
			const timeDiff = now - lastActive

			console.log('Session check:', {
				lastActive: new Date(lastActive),
				now: new Date(now),
				timeDiffMinutes: Math.round(timeDiff / 1000 / 60),
				timeoutMinutes: SESSION_TIMEOUT_MINUTES,
				shouldLogout: timeDiff > SESSION_TIMEOUT_MS,
			})

			// If more than timeout period has passed, auto-logout
			if (timeDiff > SESSION_TIMEOUT_MS) {
				console.log('Session expired, triggering auto-logout')
				this.callbacks?.onAutoLogout()
			} else {
				// Update timestamp for active session
				this.updateLastActiveTimestamp()
			}
		} catch (error) {
			console.error('Failed to check for auto-logout:', error)
			// On error, update timestamp to be safe
			this.updateLastActiveTimestamp()
		}
	}

	// Manual method to reset session timer (called on user interaction)
	resetSessionTimer = () => {
		this.updateLastActiveTimestamp()

		// Clear existing timeout
		if (this.timeoutId) {
			clearTimeout(this.timeoutId)
		}

		// Set new timeout for auto-logout
		this.timeoutId = setTimeout(() => {
			console.log('Session timeout reached, triggering auto-logout')
			this.callbacks?.onAutoLogout()
		}, SESSION_TIMEOUT_MS)
	}

	// Clear session data (called on logout)
	clearSession = async () => {
		try {
			await AsyncStorage.removeItem(LAST_ACTIVE_KEY)
			if (this.timeoutId) {
				clearTimeout(this.timeoutId)
				this.timeoutId = null
			}
			console.log('Session data cleared')
		} catch (error) {
			console.error('Failed to clear session data:', error)
		}
	}

	// Get session info for debugging
	getSessionInfo = async () => {
		try {
			const lastActiveStr = await AsyncStorage.getItem(LAST_ACTIVE_KEY)
			const lastActive = lastActiveStr ? parseInt(lastActiveStr) : null
			const now = Date.now()

			return {
				lastActive: lastActive ? new Date(lastActive) : null,
				now: new Date(now),
				timeSinceLastActive: lastActive ? now - lastActive : null,
				sessionTimeoutMs: SESSION_TIMEOUT_MS,
				appState: this.appState,
			}
		} catch (error) {
			console.error('Failed to get session info:', error)
			return null
		}
	}
}

// Export singleton instance
export const appStateManager = new AppStateManager()
