import express from 'express'
import { prisma } from '../db'

// Get single menu item by ID with all details (for editing)
export const getItemById = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { itemId } = req.params

		if (!itemId || isNaN(parseInt(itemId))) {
			return res.status(400).json({
				success: false,
				error: 'Valid item ID is required',
			})
		}

		const menuItem = await prisma.menuItem.findUnique({
			where: {
				id: parseInt(itemId),
			},
			include: {
				menu_item_category_links: {
					include: {
						category: true,
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
				menu_item_addons_menu_item_addons_menu_item_idTomenu_items: {
					include: {
						menu_items_menu_item_addons_target_menu_item_idTomenu_items: {
							select: {
								id: true,
								name: true,
								basePrice: true,
							},
						},
					},
				},
			},
		})

		if (!menuItem) {
			return res.status(404).json({
				success: false,
				error: 'Menu item not found',
			})
		}

		res.json({
			success: true,
			item: menuItem,
		})
	} catch (error) {
		console.error('Get menu item by ID error:', error)
		res.status(500).json({
			success: false,
			error:
				error instanceof Error ? error.message : 'Failed to fetch menu item',
		})
	}
}
