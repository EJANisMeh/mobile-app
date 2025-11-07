import express from 'express'
import { prisma, selectQuery } from '../db'

// Get notifications for a user
export const getNotifications = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { userId } = req.params
		const { unreadOnly } = req.query

		const userIdInt = parseInt(userId)

		if (isNaN(userIdInt)) {
			return res.status(400).json({
				success: false,
				error: 'Invalid user ID',
			})
		}

		// Build where clause
		const where: any = { userId: userIdInt }
		if (unreadOnly === 'true') {
			where.isRead = false
		}

		const result = await selectQuery(prisma, {
			table: 'notification',
			where,
			orderBy: { createdAt: 'desc' },
			include: {
				order: {
					include: {
						order_statuses: true,
						concession: {
							select: {
								id: true,
								name: true,
							},
						},
						customer: {
							select: {
								id: true,
								fname: true,
								lname: true,
							},
						},
					},
				},
			},
		})

		if (!result.success) {
			return res.status(500).json({
				success: false,
				error: 'Failed to fetch notifications',
			})
		}

		res.json({
			success: true,
			notifications: result.data || [],
		})
	} catch (error) {
		console.error('Error fetching notifications:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
