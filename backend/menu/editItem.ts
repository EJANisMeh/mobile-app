import express from 'express'
import { prisma, updateQuery, selectOne } from '../db'

// Edit menu item endpoint
export const editItem = async (req: express.Request, res: express.Response) => {
	try {
		const { id } = req.params
		const { name, description, basePrice, categoryId, availability } = req.body

		// Validate menu item exists
		const existingItemResult = await selectOne(prisma, {
			table: 'menuItem',
			where: { id: parseInt(id) },
		})

		if (!existingItemResult.success || !existingItemResult.data) {
			return res.status(404).json({
				success: false,
				error: 'Menu item not found',
			})
		}

		// Prepare update data
		const updateData: any = {}
		if (name !== undefined) updateData.name = name.trim()
		if (description !== undefined)
			updateData.description = description ? description.trim() : null
		if (basePrice !== undefined) updateData.basePrice = parseFloat(basePrice)
		if (categoryId !== undefined) updateData.categoryId = categoryId
		if (availability !== undefined) updateData.availability = availability // Update menu item using simplified query
		const menuItemResult = await updateQuery(prisma, {
			table: 'menuItem',
			where: { id: parseInt(id) },
			data: updateData,
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
				error: 'Failed to update menu item',
			})
		}

		res.json({
			success: true,
			menuItem: menuItemResult.data,
			message: 'Menu item updated successfully',
		})
	} catch (error) {
		console.error('Edit menu item error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error while updating menu item',
		})
	}
}
