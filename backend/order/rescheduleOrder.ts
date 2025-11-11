import express from 'express'
import { prisma, selectOne, updateQuery } from '../db'
import { createNotification } from '../notification/createNotification'

export const rescheduleOrder = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { orderId } = req.params
		const { newScheduledDate, feedback } = req.body

		if (!newScheduledDate) {
			return res.status(400).json({
				success: false,
				error: 'New scheduled date is required',
			})
		}

		// Verify order exists
		const orderResult = await selectOne(prisma, {
			table: 'order',
			where: { id: parseInt(orderId) },
		})

		if (!orderResult.success || !orderResult.data) {
			return res.status(404).json({
				success: false,
				error: 'Order not found',
			})
		}

		// Update the order with new scheduled date and feedback
		const result = await updateQuery(prisma, {
			table: 'order',
			where: { id: parseInt(orderId) },
			data: {
				scheduled_for: new Date(newScheduledDate),
				order_mode: 'scheduled',
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

		if (!result.success || !result.data) {
			return res.status(500).json({
				success: false,
				error: 'Failed to reschedule order',
			})
		}

		// Create notification for customer
		const newDate = new Date(newScheduledDate)
		const formattedDate = newDate.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})

		const notificationMessage = feedback
			? `Your order has been rescheduled to ${formattedDate}. Note: ${feedback}`
			: `Your order has been rescheduled to ${formattedDate}.`

		await createNotification(
			orderResult.data.customerId,
			'order_rescheduled',
			'Order Rescheduled',
			notificationMessage,
			parseInt(orderId)
		)

		res.json({
			success: true,
			order: result.data,
			message: 'Order rescheduled successfully',
		})
	} catch (error) {
		console.error('Reschedule order error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
