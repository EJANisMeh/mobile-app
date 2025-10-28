import express from 'express'
import { prisma } from '../db'

/**
 * Update categories (batch update)
 * Handles adding new categories, updating existing ones, and removing deleted ones
 */
export const updateCategories = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { concessionId, categories } = req.body

		if (!concessionId) {
			return res.status(400).json({
				success: false,
				error: 'Concession ID is required',
			})
		}

		if (!Array.isArray(categories)) {
			return res.status(400).json({
				success: false,
				error: 'Categories must be an array',
			})
		}

		// Filter out empty names
		const validCategories = categories.filter((cat) => cat.name.trim() !== '')

		// Start a transaction
		const result = await prisma.$transaction(async (tx) => {
			// Get existing categories
			const existingCategories = await tx.menu_item_categories.findMany({
				where: {
					concession_id: concessionId,
				},
			})

			const existingIds = existingCategories.map((cat) => cat.id)
			const incomingIds = validCategories
				.filter((cat) => cat.id)
				.map((cat) => cat.id)

			// Delete categories that are no longer in the list
			const idsToDelete = existingIds.filter((id) => !incomingIds.includes(id))
			if (idsToDelete.length > 0) {
				await tx.menu_item_categories.deleteMany({
					where: {
						id: {
							in: idsToDelete,
						},
					},
				})
			}

			// Update or create categories
			const updatedCategories = await Promise.all(
				validCategories.map(async (category, index) => {
					if (category.id) {
						// Update existing category
						return await tx.menu_item_categories.update({
							where: { id: category.id },
							data: {
								name: category.name,
								position: index,
								updated_at: new Date(),
							},
						})
					} else {
						// Create new category
						return await tx.menu_item_categories.create({
							data: {
								concession_id: concessionId,
								name: category.name,
								position: index,
							},
						})
					}
				})
			)

			return updatedCategories
		})

		res.json({
			success: true,
			categories: result,
		})
	} catch (error) {
		console.error('Update categories error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error while updating categories',
		})
	}
}
