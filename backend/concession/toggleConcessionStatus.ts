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
		const concessionDataResult = await selectOne(prisma, {
			table: 'concession',
			where: { id: parseInt(concessionId) },
		})

		if (!concessionDataResult.success || !concessionDataResult.data) {
			return res.status(404).json({
				success: false,
				error: 'Concession not found',
			})
		}

		const currentConcessionData = concessionDataResult.data

		// Step 3: Toggle the is_open status
		const newStatus = !currentConcessionData.is_open

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

		const updatedConcessionData = updateResult.data

		// Step 4: Return updated concession status
		return res.json({
			success: true,
			concession_data: updatedConcessionData,
			message: `Concession is now ${newStatus ? 'open' : 'closed'}`,
		})
	} catch (error) {
		console.error('Toggle concession status error:', error)
		return res.status(500).json({
			success: false,
			error: 'Internal server error while toggling concession status',
		})
	}
}
