/**
 * Validate if the session has expired based on last active timestamp
 * Returns true if session is still valid, false if expired
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LAST_ACTIVE_KEY, SESSION_TIMEOUT_MS } from './constants'

export const validateSessionTimeout = async (): Promise<{
	isValid: boolean
	timeSinceLastActive?: number
	lastActive?: Date
}> => {
	try {
		const lastActiveStr = await AsyncStorage.getItem(LAST_ACTIVE_KEY)

		if (!lastActiveStr) {
			// No session data found
			return { isValid: false }
		}

		const lastActive = parseInt(lastActiveStr)
		const now = Date.now()
		const timeDiff = now - lastActive

		const isValid = timeDiff <= SESSION_TIMEOUT_MS

		return {
			isValid,
			timeSinceLastActive: timeDiff,
			lastActive: new Date(lastActive),
		}
	} catch (error) {
		console.error('Error validating session timeout:', error)
		return { isValid: false }
	}
}
