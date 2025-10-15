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
		const {
			name,
			description,
			image_url,
			is_open,
			payment_methods,
			schedule,
		} = req.body

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
			// Ensure payment_methods is an array and always includes "cash"
			const methods = Array.isArray(payment_methods) ? payment_methods : []
			if (!methods.includes('cash')) {
				methods.unshift('cash') // Add cash as first payment method
			}
			updateData.payment_methods = methods
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
			concession: {
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
