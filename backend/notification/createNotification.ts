import express from 'express'
import { prisma, insertQuery } from '../db'

// Create a notification
export const createNotification = async (
	userId: number,
	type: string,
	title: string,
	message: string,
	relatedOrderId?: number
) => {
	try {
		const result = await insertQuery(prisma, {
			table: 'notification',
			data: {
				userId,
				type,
				title,
				message,
				relatedOrderId,
				isRead: false,
			},
		})

		return result
	} catch (error) {
		console.error('Error creating notification:', error)
		return { success: false, error: 'Failed to create notification' }
	}
}
