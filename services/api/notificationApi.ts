import AsyncStorage from '@react-native-async-storage/async-storage'
import { apiCall } from './api'

export interface Notification {
	id: number
	userId: number
	type: string
	title: string
	message: string
	relatedOrderId?: number
	isRead: boolean
	createdAt: Date
	order?: any
}

interface NotificationsResponse {
	success: boolean
	notifications?: Notification[]
	error?: string
}

interface MarkAsReadResponse {
	success: boolean
	message?: string
	deletedCount?: number
	error?: string
}

export const notificationApi = {
	getNotifications: async (
		userId: number,
		unreadOnly: boolean = false
	): Promise<NotificationsResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		const url = `/notifications/user/${userId}${
			unreadOnly ? '?unreadOnly=true' : ''
		}`

		return await apiCall<NotificationsResponse>(url, {
			method: 'GET',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		})
	},

	markAsRead: async (notificationId: number): Promise<MarkAsReadResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall<MarkAsReadResponse>(
			`/notifications/read/${notificationId}`,
			{
				method: 'PUT',
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			}
		)
	},

	markAllAsRead: async (userId: number): Promise<MarkAsReadResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall<MarkAsReadResponse>(
			`/notifications/read-all/${userId}`,
			{
				method: 'PUT',
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			}
		)
	},

	deleteNotification: async (
		notificationId: number
	): Promise<MarkAsReadResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall<MarkAsReadResponse>(
			`/notifications/${notificationId}`,
			{
				method: 'DELETE',
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			}
		)
	},

	deleteReadNotifications: async (
		userId: number
	): Promise<MarkAsReadResponse> => {
		const token = await AsyncStorage.getItem('authToken')

		return await apiCall<MarkAsReadResponse>(
			`/notifications/read-all/${userId}`,
			{
				method: 'DELETE',
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			}
		)
	},
}
