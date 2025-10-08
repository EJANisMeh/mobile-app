import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import { ApiResponse } from '../../types'

/**
 * API Service - Thin HTTP Client Layer
 *
 * This file contains ONLY HTTP client code for making API requests.
 * All business logic is in the backend modules (backend/auth/, backend/user/, backend/debug/)
 *
 * Responsibilities:
 * - Configure API base URL based on platform
 * - Make HTTP requests to backend endpoints
 * - Handle AsyncStorage for tokens (frontend caching only)
 * - Return responses to callers
 *
 * Does NOT contain:
 * - Validation logic (belongs in backend)
 * - Database operations (belongs in backend/db)
 * - Business rules (belongs in backend)
 */

// API Configuration
// For React Native development:
// - Web and iOS simulator can use localhost
// - Android emulator (AVD) should use 10.0.2.2
// - Physical devices should use your machine IP (phoneIp)
const phoneIp: string = '192.168.100.35'
const getApiBaseUrl = () => {
	// Development mode helpers
	if (__DEV__) {
		// Web (Expo web / react-native-web)
		if (Platform.OS === 'web') {
			return 'http://localhost:3000/api'
		}

		// iOS simulator (can access localhost of host machine)
		if (Platform.OS === 'ios') {
			return 'http://localhost:3000/api'
		}

		// Android (emulator vs device)
		if (Platform.OS === 'android') {
			// For physical Android device, use your computer's IP address
			// For Android emulator (AVD), use 10.0.2.2
			// return 'http://10.0.2.2:3000/api' // uncomment this if using emulator
			return 'http://${phoneIp}:3000/api' // uncomment this if using physical android dvice
		}

		// Fallback to local network IP for any other platform
		return 'http://${phoneIp}:3000/api'
	}

	// Production API URL (replace with your actual production URL)
	return 'https://your-production-api.com/api'
}

const API_BASE_URL = getApiBaseUrl()



// Helper function to make API calls
export const apiCall = async <T = any>(
	endpoint: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> => {
	try {
		const url = `${API_BASE_URL}${endpoint}`

		const defaultHeaders = {
			'Content-Type': 'application/json',
		}

		const config: RequestInit = {
			...options,
			headers: {
				...defaultHeaders,
				...options.headers,
			},
		}

		const response = await fetch(url, config)
		const data = await response.json()

		// Don't throw errors, return them as part of the response
		if (!response.ok) {
			return {
				success: false,
				error: data.error || `Request failed with status ${response.status}`,
			}
		}

		return data
	} catch (error) {
		console.error('API call failed:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error occurred',
		}
	}
}




