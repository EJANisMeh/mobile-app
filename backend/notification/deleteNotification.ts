import express from 'express'
import { prisma, deleteQuery } from '../db'

// Delete/archive a single notification
export const deleteNotification = async (
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

		const deleteResult = await deleteQuery(prisma, {
			table: 'notification',
			where: { id: notificationIdInt },
		})

		if (!deleteResult.success) {
			return res.status(500).json({
				success: false,
				error: 'Failed to delete notification',
			})
		}

		res.json({
			success: true,
			message: 'Notification deleted successfully',
		})
	} catch (error) {
		console.error('Error deleting notification:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
