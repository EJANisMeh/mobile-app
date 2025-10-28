import express from 'express'
import { prisma, selectQuery } from '../db'

/**
 * Get all categories for a concession
 */
export const getCategories = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { concessionId } = req.query

		if (!concessionId) {
			return res.status(400).json({
				success: false,
				error: 'Concession ID is required',
			})
		}

		const categoriesResult = await selectQuery(prisma, {
			table: 'menu_item_categories',
			where: {
				concession_id: parseInt(concessionId as string),
			},
			orderBy: {
				position: 'asc',
			},
		})

		if (!categoriesResult.success) {
			return res.status(500).json({
				success: false,
				error: 'Failed to fetch categories',
			})
		}

		res.json({
			success: true,
			categories: categoriesResult.data || [],
		})
	} catch (error) {
		console.error('Get categories error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error while fetching categories',
		})
	}
}
