/**
 * Menu API Endpoints
 * Pure HTTP client - all business logic is in backend/menu/*
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { apiCall } from './api'
import { AddMenuItemFormData } from '../../types'

export const menuApi = {
	/**
	 * Add new menu item
	 * Backend handles: validation, creating menu item with variations and addons
	 */
	addMenuItem: async (
		concessionId: number,
		formData: AddMenuItemFormData
	): Promise<any> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall('/menu/add', {
			method: 'POST',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			body: JSON.stringify({
				concessionId,
				name: formData.name.trim(),
				description: formData.description.trim() || null,
				basePrice: formData.basePrice || '0',
				images: formData.images,
				displayImageIndex: formData.displayImageIndex,
				categoryIds: formData.categoryIds,
				availability: formData.availability,
				variationGroups: formData.variationGroups.map((group) => ({
					name: group.name.trim(),
					selectionTypeId: group.selectionTypeId,
					multiLimit: group.multiLimit,
					mode: group.mode,
					categoryFilterId: group.categoryFilterId,
					options: group.options.map((opt) => ({
						name: opt.name.trim(),
						priceAdjustment: opt.priceAdjustment,
						isDefault: opt.isDefault,
						availability: opt.availability,
						position: opt.position,
					})),
					existingMenuItemIds: (group as any).existingMenuItemIds || [],
					position: group.position,
				})),
				addons: formData.addons.map((addon) => ({
					menuItemId: addon.menuItemId,
					label: addon.label?.trim() || null,
					priceOverride: addon.priceOverride,
					required: addon.required,
					position: addon.position,
				})),
			}),
		})
	},

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
	 * Get single menu item by ID with all details
	 * Backend handles: fetching full item data including variations and addons
	 */
	getMenuItemById: async (itemId: number): Promise<any> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall(`/menu/get/${itemId}`, {
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
