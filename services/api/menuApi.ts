/**
 * Menu API Endpoints
 * Pure HTTP client - all business logic is in backend/menu/*
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { apiCall } from './api'

export const menuApi = {
	/**
	 * Get menu items for a concession
	 * Backend handles: menu item lookup, filtering, pagination
	 */
	getMenuItems: async (concessionId: number): Promise<any> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall(`/menu/get?concession_id=${concessionId}&limit=100`, {
			method: 'GET',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		})
	},

	/**
	 * Toggle menu item availability
	 * Backend handles: validation, updating availability status
	 */
	toggleAvailability: async (
		itemId: number,
		availability: boolean
	): Promise<any> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall(`/menu/edit/${itemId}`, {
			method: 'PUT',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			body: JSON.stringify({ availability }),
		})
	},

	/**
	 * Delete menu item
	 * Backend handles: validation, deletion
	 */
	deleteMenuItem: async (itemId: number): Promise<any> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall(`/menu/delete/${itemId}`, {
			method: 'DELETE',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		})
	},

	/**
	 * Toggle variation option availability
	 * Backend handles: validation, updating option availability status
	 */
	toggleVariationOptionAvailability: async (
		optionId: number,
		availability: boolean
	): Promise<any> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall(`/menu/variation-option/${optionId}/availability`, {
			method: 'PUT',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			body: JSON.stringify({ availability }),
		})
	},
}
