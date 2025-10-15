import express from 'express'
import { prisma, updateQuery, selectOne } from '../db'

/**
 * Toggle concession open/closed status
 * Process:
 * 1. Validate concessionId
 * 2. Get current concession status
 * 3. Toggle is_open status
 * 4. Return updated concession data
 */
export const toggleConcessionStatus = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { concessionId } = req.params

		// Step 1: Validate input
		if (!concessionId) {
			return res.status(400).json({
				success: false,
				error: 'Concession ID is required',
			})
		}

		// Step 2: Get current concession to determine current status
		const concessionResult = await selectOne(prisma, {
			table: 'concession',
			where: { id: parseInt(concessionId) },
		})

		if (!concessionResult.success || !concessionResult.data) {
			return res.status(404).json({
				success: false,
				error: 'Concession not found',
			})
		}

		const currentConcession = concessionResult.data

		// Step 3: Toggle the is_open status
		const newStatus = !currentConcession.is_open

		const updateResult = await updateQuery(prisma, {
			table: 'concession',
			where: { id: parseInt(concessionId) },
			data: { is_open: newStatus },
		})

		if (!updateResult.success || !updateResult.data) {
			return res.status(500).json({
				success: false,
				error: 'Failed to toggle concession status',
			})
		}

		const concession = updateResult.data

		// Step 4: Return updated concession data
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
			message: `Concession is now ${newStatus ? 'open' : 'closed'}`,
		})
	} catch (error) {
		console.error('Toggle concession status error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error while toggling concession status',
		})
	}
}
