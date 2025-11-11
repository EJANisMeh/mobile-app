import express from 'express'
import { prisma } from '../db'

// Delete all read notifications for a user
export const deleteReadNotifications = async (
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

		const deleteResult = await prisma.notification.deleteMany({
			where: {
				userId: userIdInt,
				isRead: true,
			},
		})

		res.json({
			success: true,
			message: `${deleteResult.count} read notification(s) deleted successfully`,
			deletedCount: deleteResult.count,
		})
	} catch (error) {
		console.error('Error deleting read notifications:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
