import express from 'express'
import { prisma, updateQuery } from '../db'

// Mark notification as read
export const markAsRead = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { notificationId } = req.params

		const notificationIdInt = parseInt(notificationId)

		if (isNaN(notificationIdInt)) {
			return res.status(400).json({
				success: false,
				error: 'Invalid notification ID',
			})
		}

		const result = await updateQuery(prisma, {
			table: 'notification',
			where: { id: notificationIdInt },
			data: { isRead: true },
		})

		if (!result.success) {
			return res.status(500).json({
				success: false,
				error: 'Failed to mark notification as read',
			})
		}

		res.json({
			success: true,
			message: 'Notification marked as read',
		})
	} catch (error) {
		console.error('Error marking notification as read:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
