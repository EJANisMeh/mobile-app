import express from 'express'
import { prisma, selectOne, updateQuery } from '../db'
import { createNotification } from '../notification/createNotification'

// Adjust order price (for discounts or surcharges)
export const adjustOrderPrice = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { orderId } = req.params
		const { newTotal, reason } = req.body

		const orderIdInt = parseInt(orderId)

		if (isNaN(orderIdInt)) {
			return res.status(400).json({
				success: false,
				error: 'Invalid order ID',
			})
		}

		if (typeof newTotal !== 'number' || newTotal < 0) {
			return res.status(400).json({
				success: false,
				error: 'Invalid new total amount',
			})
		}

		if (!reason || typeof reason !== 'string' || !reason.trim()) {
			return res.status(400).json({
				success: false,
				error: 'Reason for price adjustment is required',
			})
		}

		// Get order
		const orderResult = await selectOne(prisma, {
			table: 'order',
			where: { id: orderIdInt },
		})

		if (!orderResult.success || !orderResult.data) {
			return res.status(404).json({
				success: false,
				error: 'Order not found',
			})
		}

		const order = orderResult.data
		const currentTotal = parseFloat(order.total.toString())

		if (newTotal === currentTotal) {
			return res.status(400).json({
				success: false,
				error: 'New total must be different from current total',
			})
		}

		// Store original total if not already stored
		const original_total = order.original_total
			? parseFloat(order.original_total.toString())
			: currentTotal

		// Update order
		const updateResult = await updateQuery(prisma, {
			table: 'order',
			where: { id: orderIdInt },
			data: {
				total: newTotal,
				original_total: original_total,
				price_adjustment_reason: reason.trim(),
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

		if (!updateResult.success || !updateResult.data) {
			return res.status(500).json({
				success: false,
				error: 'Failed to adjust order price',
			})
		}

		// Create notification for customer
		const adjustmentAmount = newTotal - currentTotal
		const adjustmentType = adjustmentAmount > 0 ? 'increased' : 'decreased'
		const absoluteAmount = Math.abs(adjustmentAmount).toFixed(2)

		await createNotification(
			order.customerId,
			'price_adjusted',
			'Order Price Adjusted',
			`Your order price has been ${adjustmentType} by ₱${absoluteAmount}. Reason: ${reason.trim()}`,
			orderIdInt
		)

		res.json({
			success: true,
			order: updateResult.data,
			message: 'Order price adjusted successfully',
		})
	} catch (error) {
		console.error('Error adjusting order price:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
