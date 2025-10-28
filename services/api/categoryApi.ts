/**
 * Category API Endpoints
 * Pure HTTP client - all business logic is in backend/category/*
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { apiCall } from './api'
import { Category, UpdateCategoryInput } from '../../types/categoryTypes'

export const categoryApi = {
	/**
	 * Get all categories for a concession
	 * Backend handles: category lookup, sorting by position
	 */
	getCategories: async (concessionId: number): Promise<any> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall(`/category/get?concessionId=${concessionId}`, {
			method: 'GET',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		})
	},

	/**
	 * Update categories (batch update)
	 * Backend handles: validation, adding new, updating existing, deleting removed
	 */
	updateCategories: async (
		concessionId: number,
		categories: UpdateCategoryInput[]
	): Promise<any> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall(`/category/update`, {
			method: 'PUT',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			body: JSON.stringify({ concessionId, categories }),
		})
	},
}
