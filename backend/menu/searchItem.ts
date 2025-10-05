import express from 'express'
import { prisma, selectQuery } from '../db'

// Search menu items endpoint
export const searchItem = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const {
			concession_id,
			category,
			search,
			available,
			min_price,
			max_price,
			page = 1,
			limit = 20,
		} = req.query

		// Build where conditions
		const whereConditions: any = {}

		if (concession_id) {
			whereConditions.concession_id = parseInt(concession_id as string)
		}

		if (category) {
			whereConditions.category = {
				contains: category as string,
				mode: 'insensitive',
			}
		}

		if (search) {
			whereConditions.OR = [
				{
					name: {
						contains: search as string,
						mode: 'insensitive',
					},
				},
				{
					description: {
						contains: search as string,
						mode: 'insensitive',
					},
				},
			]
		}

		if (available !== undefined) {
			whereConditions.available = available === 'true'
		}

		if (min_price || max_price) {
			whereConditions.price = {}
			if (min_price) whereConditions.price.gte = parseFloat(min_price as string)
			if (max_price) whereConditions.price.lte = parseFloat(max_price as string)
		}

		// Search menu items using simplified query
		const menuItemsResult = await selectQuery(prisma, {
			table: 'menuItem',
			where: whereConditions,
			include: {
				concession: {
					select: {
						id: true,
						name: true,
						cafeteria_id: true,
					},
				},
			},
			orderBy: {
				name: 'asc',
			},
			limit: parseInt(limit as string),
			offset: (parseInt(page as string) - 1) * parseInt(limit as string),
		})

		if (!menuItemsResult.success) {
			return res.status(500).json({
				success: false,
				error: 'Failed to search menu items',
			})
		}

		res.json({
			success: true,
			menuItems: menuItemsResult.data || [],
			count: menuItemsResult.count || 0,
			page: parseInt(page as string),
			limit: parseInt(limit as string),
		})
	} catch (error) {
		console.error('Search menu items error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error while searching menu items',
		})
	}
}
