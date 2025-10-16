import express from 'express'
import { prisma, selectOne } from '../db'

/**
 * Get concession by ID
 * Process:
 * 1. Validate concessionId
 * 2. Find concession using selectOne from backend/db
 * 3. Return concession data
 */
export const getConcession = async (
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

		// Step 2: Find concession using modularized selectOne query
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

		const concession = concessionResult.data

		// Step 3: Return concession data
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
		})
	} catch (error) {
		console.error('Get concession error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error while fetching concession',
		})
	}
}
