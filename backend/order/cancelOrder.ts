import express from 'express'
import { prisma, selectOne, deleteQuery } from '../db'
import { ORDER_STATUS_CODES } from '../../utils/orderStatusCodes'
import { createNotification } from '../notification/createNotification'

// Cancel an order (only allowed when status is PENDING)
// For customers: deletes the order completely
export const cancelOrder = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { orderId } = req.params

		const orderIdInt = parseInt(orderId)

		if (isNaN(orderIdInt)) {
			return res.status(400).json({
				success: false,
				error: 'Invalid order ID',
			})
		}

		// Get order with status
		const orderResult = await selectOne(prisma, {
			table: 'order',
			where: { id: orderIdInt },
			include: {
				order_statuses: true,
			},
		})

		if (!orderResult.success || !orderResult.data) {
			return res.status(404).json({
				success: false,
				error: 'Order not found',
			})
		}

		const order = orderResult.data

		// Check if order is pending
		if (order.order_statuses?.code !== ORDER_STATUS_CODES.PENDING) {
			return res.status(400).json({
				success: false,
				error: 'Only pending orders can be cancelled',
			})
		}

		// Delete the order (cascade will delete order items)
		const deleteResult = await deleteQuery(prisma, {
			table: 'order',
			where: { id: orderIdInt },
		})

		if (!deleteResult.success) {
			return res.status(500).json({
				success: false,
				error: 'Failed to cancel order',
			})
		}

		// Create notification for concessionaire about customer cancellation
		if (order.concessionId) {
			const concession = await prisma.concession.findUnique({
				where: { id: order.concessionId },
				include: {
					users: true,
				},
			})

			if (concession && concession.users.length > 0) {
				for (const user of concession.users) {
					await createNotification(
						user.id,
						'order_cancelled',
						'Order Cancelled by Customer',
						`Order #${
							order.concession_order_number || orderIdInt
						} was cancelled by the customer`,
						orderIdInt
					)
				}
			}
		}

		res.json({
			success: true,
			message: 'Order cancelled successfully',
		})
	} catch (error) {
		console.error('Error cancelling order:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
