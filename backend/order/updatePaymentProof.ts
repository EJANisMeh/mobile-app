import express from 'express'
import { prisma, updateQuery, selectOne } from '../db'
import { createNotification } from '../notification/createNotification'

// Update payment proof for an order
export const updatePaymentProof = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { orderId } = req.params
		const { paymentProof } = req.body

		const orderIdInt = parseInt(orderId)

		if (isNaN(orderIdInt)) {
			return res.status(400).json({
				success: false,
				error: 'Invalid order ID',
			})
		}

		if (!paymentProof || !paymentProof.mode || !paymentProof.value) {
			return res.status(400).json({
				success: false,
				error: 'Invalid payment proof data',
			})
		}

		// Add submission timestamp
		const proofWithTimestamp = {
			...paymentProof,
			submittedAt: new Date().toISOString(),
		}

		// Get the order to check if it had payment_proof initially and get concession info
		const orderResult = await selectOne(prisma, {
			table: 'order',
			where: { id: orderIdInt },
			include: {
				concession: {
					include: {
						users: true,
					},
				},
			},
		})

		if (!orderResult.success || !orderResult.data) {
			return res.status(404).json({
				success: false,
				error: 'Order not found',
			})
		}

		const order = orderResult.data
		const hadPaymentProofBefore = order.payment_proof !== null

		// Update order with payment proof
		const updateResult = await updateQuery(prisma, {
			table: 'order',
			where: { id: orderIdInt },
			data: {
				payment_proof: proofWithTimestamp,
			},
		})

		if (!updateResult.success) {
			return res.status(500).json({
				success: false,
				error: 'Failed to update payment proof',
			})
		}

		// Create notification for concessionaire only if payment proof wasn't submitted during order creation
		if (
			!hadPaymentProofBefore &&
			order.concession &&
			order.concession.users &&
			order.concession.users.length > 0
		) {
			for (const user of order.concession.users) {
				await createNotification(
					user.id,
					'payment_proof_received',
					'Payment Proof Received',
					`Payment proof submitted for order #${
						order.concession_order_number || orderIdInt
					}`,
					orderIdInt
				)
			}
		}

		res.json({
			success: true,
			message: 'Payment proof submitted successfully',
			paymentProof: proofWithTimestamp,
		})
	} catch (error) {
		console.error('Error updating payment proof:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
