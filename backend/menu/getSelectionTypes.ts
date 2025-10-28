/**
 * Get Selection Types
 * Retrieves all available selection types for variation groups
 */
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { selectQuery } from '../db'

const prisma = new PrismaClient()

export const getSelectionTypes = async (req: Request, res: Response) => {
	try {
		const result = await selectQuery(prisma, {
			table: 'selection_types',
			columns: ['id', 'code', 'description'],
			orderBy: { id: 'asc' },
		})

		if (!result.success) {
			return res.status(500).json({
				success: false,
				error: result.error || 'Failed to fetch selection types',
			})
		}

		res.json({
			success: true,
			selectionTypes: result.data,
		})
	} catch (error: any) {
		console.error('Error fetching selection types:', error)
		res.status(500).json({
			success: false,
			error: error.message || 'Internal server error',
		})
	}
}
