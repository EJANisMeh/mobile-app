import express from 'express'
import { prisma, selectQuery } from '../db'

// Search menu items endpoint
export const getItem = async (req: express.Request, res: express.Response) => {
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
			whereConditions.concessionId = parseInt(concession_id as string)
		}

		if (category) {
			whereConditions.category = {
				is: {
					name: {
						contains: category as string,
						mode: 'insensitive',
					},
				},
			}
		}

		if (search) {
			whereConditions.name = {
				contains: search as string,
				mode: 'insensitive',
			}
		}

		if (available !== undefined) {
			whereConditions.availability = available === 'true'
		}

		if (min_price || max_price) {
			whereConditions.basePrice = {}
			if (min_price)
				whereConditions.basePrice.gte = parseFloat(min_price as string)
			if (max_price)
				whereConditions.basePrice.lte = parseFloat(max_price as string)
		}

		// Search menu items using simplified query
		const menuItemsResult = await selectQuery(prisma, {
			table: 'menuItem',
			where: whereConditions,
			include: {
				menu_item_category_links: {
					include: {
						category: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
				category: {
					select: {
						id: true,
						name: true,
					},
				},
				concession: {
					select: {
						id: true,
						name: true,
						cafeteriaId: true,
					},
				},
				menu_item_variation_groups: {
					where: {
						kind: 'group',
					},
					include: {
						menu_item_variation_option_choices: {
							orderBy: {
								position: 'asc',
							},
						},
						selection_types: true,
					},
					orderBy: {
						position: 'asc',
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
