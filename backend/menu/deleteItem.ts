import express from 'express'
import { prisma, deleteQuery, selectOne } from '../db'

// Delete menu item endpoint
export const deleteItem = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { id } = req.params
		const itemId = parseInt(id)

		// Validate menu item exists
		const existingItem = await prisma.menuItem.findUnique({
			where: { id: itemId },
		})

		if (!existingItem) {
			return res.status(404).json({
				success: false,
				error: 'Menu item not found',
			})
		}

		// Just delete - the trigger should be fixed now but if not, at least we get the item ID back
		const result = await prisma.$executeRawUnsafe(
			`DELETE FROM menu_items WHERE id = $1`,
			itemId
		)

		if (result === 0) {
			return res.status(404).json({
				success: false,
				error: 'Menu item not found or already deleted',
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
