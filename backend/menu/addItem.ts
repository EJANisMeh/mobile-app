import express from 'express'
import { prisma, insertQuery } from '../db'

// Add menu item endpoint
export const addItem = async (req: express.Request, res: express.Response) => {
	try {
		const { concession_id, name, description, price, category, available } =
			req.body

		// Validate input
		if (!concession_id || !name || !price) {
			return res.status(400).json({
				success: false,
				error: 'Concession ID, name, and price are required',
			})
		}

		// Create menu item using simplified query
		const menuItemResult = await insertQuery(prisma, {
			table: 'menuItem',
			data: {
				concession_id,
				name: name.trim(),
				description: description?.trim() || '',
				price: parseFloat(price),
				category: category?.trim() || 'General',
				available: available !== undefined ? available : true,
			},
			include: {
				concession: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		})

		if (!menuItemResult.success || !menuItemResult.data) {
			return res.status(500).json({
				success: false,
				error: 'Failed to add menu item',
			})
		}

		res.status(201).json({
			success: true,
			menuItem: menuItemResult.data,
			message: 'Menu item added successfully',
		})
	} catch (error) {
		console.error('Add menu item error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error while adding menu item',
		})
	}
}
