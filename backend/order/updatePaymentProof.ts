import express from 'express'
import { prisma, updateQuery } from '../db'

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
