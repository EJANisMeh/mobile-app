import express from 'express'
import { prisma, deleteQuery, selectOne } from '../db'

// Delete menu item endpoint
export const deleteItem = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { id } = req.params

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

		// Delete menu item using simplified query
		const deleteResult = await deleteQuery(prisma, {
			table: 'menuItem',
			where: { id: parseInt(id) },
		})

		if (!deleteResult.success) {
			return res.status(500).json({
				success: false,
				error: 'Failed to delete menu item',
			})
		}

		res.json({
			success: true,
			message: 'Menu item deleted successfully',
		})
	} catch (error) {
		console.error('Delete menu item error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error while deleting menu item',
		})
	}
}
