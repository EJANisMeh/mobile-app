import express from 'express'
import { prisma, selectQuery } from '../db'

/**
 * Test database connection endpoint handler
 * Performs a simple query to verify database connectivity
 */
export const testDatabase = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		// Test database connection by running a simple query
		const result = await selectQuery(prisma, {
			table: 'user',
			where: {},
			limit: 1,
		})

		if (result.success) {
			res.json({
				success: true,
				message: 'Database connection successful',
				database: {
					connected: true,
					name:
						process.env.DATABASE_URL?.split('/').pop()?.split('?')[0] ||
						'unknown',
					sampleQueryResult: result.data,
				},
			})
		} else {
			res.status(500).json({
				success: false,
				error: 'Database query failed',
				details: result.error,
			})
		}
	} catch (error) {
		console.error('Database test error:', error)
		res.status(500).json({
			success: false,
			error: 'Database connection failed',
			details: error instanceof Error ? error.message : 'Unknown error',
		})
	}
}

/**
 * Get database statistics endpoint handler
 * Returns counts of various entities in the database
 */
export const getDatabaseStats = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		// Only allow in development
		if (process.env.NODE_ENV === 'production') {
			return res.status(403).json({
				success: false,
				error: 'Database statistics are only available in development mode',
			})
		}

		// Get counts for various tables
		const userCount = await prisma.user.count()

		// Get role distribution
		const customerCount = await prisma.user.count({
			where: { role: 'customer' },
		})
		const concessionaireCount = await prisma.user.count({
			where: { role: 'concessionaire' },
		})

		// Get verification stats
		const verifiedCount = await prisma.user.count({
			where: { emailVerified: true },
		})
		const unverifiedCount = await prisma.user.count({
			where: { emailVerified: false },
		})

		res.json({
			success: true,
			message: 'Database statistics retrieved successfully',
			stats: {
				users: {
					total: userCount,
					byRole: {
						customers: customerCount,
						concessionaires: concessionaireCount,
					},
					byVerification: {
						verified: verifiedCount,
						unverified: unverifiedCount,
					},
				},
			},
		})
	} catch (error) {
		console.error('Get database stats error:', error)
		res.status(500).json({
			success: false,
			error: 'Failed to get database statistics',
			details: error instanceof Error ? error.message : 'Unknown error',
		})
	}
}

/**
 * Health check endpoint handler
 * Quick endpoint to check if the API server is running
 */
export const healthCheck = async (
	req: express.Request,
	res: express.Response
) => {
	res.json({
		success: true,
		message: 'API server is running',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		environment: process.env.NODE_ENV || 'development',
	})
}
