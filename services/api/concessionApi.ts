/**
 * Concession API Endpoints
 * Pure HTTP client - all business logic is in backend/concession/*
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ConcessionApiResponse } from '../../types'
import { apiCall } from './api'

export const concessionApi = {
	/**
	 * Get concession by ID
	 * Backend handles: concession lookup, returning concession data
	 */
	getConcession: async (
		concessionId: number
	): Promise<ConcessionApiResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall(`/api/concession/${concessionId}`, {
			method: 'GET',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		})
	},

	/**
	 * Update concession details
	 * Backend handles: validation, updating concession data
	 */
	updateConcession: async (
		concessionId: number,
		data: {
			name?: string
			description?: string | null
			image_url?: string | null
			is_open?: boolean
			payment_methods?: string[]
			schedule?: any
		}
	): Promise<ConcessionApiResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall(`/api/concession/${concessionId}`, {
			method: 'PUT',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			body: JSON.stringify(data),
		})
	},

	/**
	 * Toggle concession open/closed status
	 * Backend handles: updating is_open status
	 */
	toggleConcessionStatus: async (
		concessionId: number
	): Promise<ConcessionApiResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall(`/api/concession/${concessionId}/toggle-status`, {
			method: 'PATCH',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		})
	},
}
