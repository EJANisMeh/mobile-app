import express from 'express'
import { prisma, updateQuery } from '../db'

/**
 * Update concession details
 * Process:
 * 1. Validate concessionId and update data
 * 2. Update concession using updateQuery from backend/db
 * 3. Return updated concession data
 */
export const updateConcession = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { concessionId } = req.params
		const { name, description, image_url, is_open, payment_methods, schedule } =
			req.body

		// Step 1: Validate input
		if (!concessionId) {
			return res.status(400).json({
				success: false,
				error: 'Concession ID is required',
			})
		}

		// Prepare update data
		const updateData: any = {}

		if (name !== undefined) updateData.name = name
		if (description !== undefined) updateData.description = description
		if (image_url !== undefined) updateData.image_url = image_url
		if (is_open !== undefined) updateData.is_open = is_open
		if (payment_methods !== undefined) {
			// Ensure payment_methods is an array of [type, details] tuples
			// Format: [["cash", "Pay cash on counter"], ["gcash", "09171234567"], ...]
			const methods = Array.isArray(payment_methods) ? payment_methods : []

			// Validate that each method is a tuple [type, details]
			const validMethods = methods.filter(
				(m) =>
					Array.isArray(m) &&
					m.length === 2 &&
					typeof m[0] === 'string' &&
					typeof m[1] === 'string'
			)

			// Ensure cash is always present at index 0
			const cashIndex = validMethods.findIndex(
				([type]) => type.toLowerCase() === 'cash'
			)

			if (cashIndex > 0) {
				// Move cash to first position
				const cash = validMethods.splice(cashIndex, 1)[0]
				validMethods.unshift(cash)
			} else if (cashIndex === -1) {
				// Add cash if not present
				validMethods.unshift(['cash', 'Pay cash on counter'])
			}

			updateData.payment_methods = validMethods
		}
		if (schedule !== undefined) updateData.schedule = schedule

		// Step 2: Update concession using modularized updateQuery
		const updateResult = await updateQuery(prisma, {
			table: 'concession',
			where: { id: parseInt(concessionId) },
			data: updateData,
		})

		if (!updateResult.success || !updateResult.data) {
			return res.status(500).json({
				success: false,
				error: 'Failed to update concession',
			})
		}

		const concession = updateResult.data

		// Step 3: Return updated concession data
		res.json({
			success: true,
			concession_data: {
				id: concession.id,
				name: concession.name,
				description: concession.description,
				image_url: concession.image_url,
				cafeteriaId: concession.cafeteriaId,
				is_open: concession.is_open,
				payment_methods: concession.payment_methods,
				schedule: concession.schedule,
				createdAt: concession.createdAt,
				updatedAt: concession.updatedAt,
			},
			message: 'Concession updated successfully',
		})
	} catch (error) {
		console.error('Update concession error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error while updating concession',
		})
	}
}
