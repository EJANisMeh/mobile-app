import express from 'express'
import { prisma, updateQuery, selectOne } from '../db'

// Update order status
export const updateOrderStatus = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { orderId } = req.params
		const { statusCode, feedback } = req.body

		if (!statusCode) {
			return res.status(400).json({
				success: false,
				error: 'Status code is required',
			})
		}

		// Get status ID using simplified query
		const statusResult = await selectOne(prisma, {
			table: 'order_statuses',
			where: { code: statusCode },
		})

		if (!statusResult.success || !statusResult.data) {
			return res.status(400).json({
				success: false,
				error: 'Invalid status code',
			})
		}

		const status = statusResult.data

		// Update order using simplified query
		const orderResult = await updateQuery(prisma, {
			table: 'order',
			where: { id: parseInt(orderId) },
			data: {
				status_id: status.id,
				...(feedback && { concession_note: feedback }),
			},
			include: {
				concession: {
					select: {
						id: true,
						name: true,
					},
				},
				order_statuses: {
					select: {
						code: true,
						description: true,
					},
				},
			},
		})

		if (!orderResult.success || !orderResult.data) {
			return res.status(404).json({
				success: false,
				error: 'Order not found or failed to update',
			})
		}

		res.json({
			success: true,
			order: orderResult.data,
			message: 'Order status updated successfully',
		})
	} catch (error) {
		console.error('Error updating order status:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
