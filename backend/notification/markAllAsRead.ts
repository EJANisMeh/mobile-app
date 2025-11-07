import express from 'express'
import { prisma, updateQuery } from '../db'

// Mark all notifications as read for a user
export const markAllAsRead = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { userId } = req.params

		const userIdInt = parseInt(userId)

		if (isNaN(userIdInt)) {
			return res.status(400).json({
				success: false,
				error: 'Invalid user ID',
			})
		}

		// Use Prisma directly for bulk update
		await prisma.notification.updateMany({
			where: {
				userId: userIdInt,
				isRead: false,
			},
			data: {
				isRead: true,
			},
		})

		res.json({
			success: true,
			message: 'All notifications marked as read',
		})
	} catch (error) {
		console.error('Error marking all notifications as read:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
