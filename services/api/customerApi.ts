import { apiCall } from './api'
import type { CafeteriasWithMenuResponse } from '../../types'

export const customerApi = {
	/**
	 * Get cafeterias with concessions and menu items
	 * For customer menu screen default view
	 */
	getCafeteriasWithMenu: async (): Promise<CafeteriasWithMenuResponse> => {
		return apiCall<CafeteriasWithMenuResponse>(
			'/customer/cafeterias-with-menu',
			{
				method: 'GET',
			}
		)
	},
}
