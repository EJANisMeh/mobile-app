import { AppState, AppStateStatus } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { clearAuthData } from './clearAuthData'

class AppStateManager {
	private isAppInBackground = false
	private readonly BACKGROUND_TIMEOUT = 30000 // 30 seconds
	private appStateSubscription: any = null
	private readonly APP_LAST_ACTIVE_KEY = 'app_last_active_timestamp'
	private logoutCallback: (() => Promise<void>) | null = null

	constructor() {
		this.handleAppStateChange = this.handleAppStateChange.bind(this)
	}

	// Set the logout callback to trigger immediate logout when auth is cleared
	setLogoutCallback(callback: () => Promise<void>) {
		this.logoutCallback = callback
	}

	// Public method to check for termination before app loads
	async checkTerminationAndClearAuth(): Promise<boolean> {
		try {
			const lastActiveString = await AsyncStorage.getItem(
				this.APP_LAST_ACTIVE_KEY
			)
			const authToken = await AsyncStorage.getItem('authToken')

			// If no auth token, no need to check
			if (!authToken) {
				console.log('No auth token found - user not logged in')
				return false
			}

			// If no timestamp but user is logged in, it means app was terminated without proper cleanup
			if (!lastActiveString) {
				console.log(
					'No last active timestamp - app was terminated, clearing auth'
				)
				await this.clearAuthOnTermination()
				return true
			}

			const lastActiveTime = parseInt(lastActiveString, 10)
			const currentTime = Date.now()
			const timeDifference = currentTime - lastActiveTime

			console.log('=== Termination Check ===')
			console.log('Last active:', new Date(lastActiveTime).toISOString())
			console.log('Current time:', new Date(currentTime).toISOString())
			console.log(
				'Time difference:',
				Math.round(timeDifference / 1000),
				'seconds'
			)
			console.log('========================')

			// If more than timeout period has passed, app was terminated
			if (timeDifference > this.BACKGROUND_TIMEOUT) {
				console.log(
					'App was terminated (exceeded timeout) - clearing auth data'
				)
				await this.clearAuthOnTermination()
				return true
			} else {
				console.log('App resumed within timeout - keeping auth data')
				return false
			}
		} catch (error) {
			console.error('Error checking for app termination:', error)
			return false
		}
	}

	async start() {
		// App state monitoring is now started after termination check
		// No need to check again here since checkTerminationAndClearAuth was called first

		this.appStateSubscription = AppState.addEventListener(
			'change',
			this.handleAppStateChange
		)

		// Update timestamp when app starts
		await this.updateLastActiveTime()
	}

	stop() {
		if (this.appStateSubscription) {
			this.appStateSubscription.remove()
			this.appStateSubscription = null
		}
	}

	private async updateLastActiveTime() {
		try {
			const currentTime = Date.now().toString()
			await AsyncStorage.setItem(this.APP_LAST_ACTIVE_KEY, currentTime)
			console.log('Updated last active time:', new Date().toISOString())
		} catch (error) {
			console.error('Error updating last active time:', error)
		}
	}

	private handleAppStateChange(nextAppState: AppStateStatus) {
		console.log('App state changed to:', nextAppState)

		switch (nextAppState) {
			case 'background':
				this.handleAppGoesToBackground()
				break
			case 'active':
				this.handleAppBecomesActive()
				break
			case 'inactive':
				// On iOS, this happens during transitions or when system dialogs appear
				// We don't want to logout here
				break
		}
	}

	private async handleAppGoesToBackground() {
		this.isAppInBackground = true
		console.log('App went to background')

		// Update timestamp when app goes to background
		await this.updateLastActiveTime()
	}

	private async handleAppBecomesActive() {
		if (this.isAppInBackground) {
			console.log('App became active from background')

			// Check if we should clear auth data based on time elapsed
			const wasTerminated = await this.checkTerminationAndClearAuth()
			if (wasTerminated) {
				console.log('Auth was cleared due to long background time')
			}
		}

		this.isAppInBackground = false

		// Update timestamp when app becomes active
		await this.updateLastActiveTime()
	}

	private async clearAuthOnTermination() {
		try {
			await clearAuthData()
			// Also clear the timestamp
			await AsyncStorage.removeItem(this.APP_LAST_ACTIVE_KEY)
			console.log('Auth data cleared due to app termination')

			// Trigger immediate logout to update UI state
			if (this.logoutCallback) {
				console.log('Triggering immediate logout to update UI')
				await this.logoutCallback()
			}
		} catch (error) {
			console.error('Error clearing auth data on termination:', error)
		}
	}
}

export const appStateManager = new AppStateManager()
