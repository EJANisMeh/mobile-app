import express from 'express'
import { prisma } from '../db'

// Toggle variation option availability endpoint
export const toggleVariationOptionAvailability = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { optionId } = req.params
		const { availability } = req.body

		// Validate optionId
		if (!optionId || isNaN(parseInt(optionId))) {
			return res.status(400).json({
				success: false,
				error: 'Valid option ID is required',
			})
		}

		// Validate availability
		if (typeof availability !== 'boolean') {
			return res.status(400).json({
				success: false,
				error: 'Availability must be a boolean value',
			})
		}

		// Update the variation option availability using raw SQL to avoid Prisma reserved word issues
		const updatedOption = await prisma.$queryRaw`
			UPDATE menu_item_variation_option_choices 
			SET availability = ${availability}
			WHERE id = ${parseInt(optionId)}
			RETURNING *
		`

		if (
			!updatedOption ||
			(Array.isArray(updatedOption) && updatedOption.length === 0)
		) {
			return res.status(404).json({
				success: false,
				error: 'Option not found',
			})
		}

		res.json({
			success: true,
			option: Array.isArray(updatedOption) ? updatedOption[0] : updatedOption,
			message: `Option marked as ${availability ? 'available' : 'unavailable'}`,
		})
	} catch (error) {
		console.error('Toggle variation option availability error:', error)
		res.status(500).json({
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'Failed to update option availability',
		})
	}
}
