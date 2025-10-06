/**
 * Check email verification status endpoint handler
 * Process:
 * 1. Validate email is provided
 * 2. Find user by email using selectOne from backend/db
 * 3. Return emailVerified status
 */

import express from 'express'
import { prisma, selectOne } from '../../db'

export const checkEmailVerificationStatus = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { email } = req.body

		// Step 1: Validate input
		if (!email) {
			return res.status(400).json({
				success: false,
				error: 'Email is required',
			})
		}

		// Step 2: Find user by email using modularized selectOne query
		const userResult = await selectOne(prisma, {
			table: 'user',
			where: { email: email.toLowerCase() },
		})

		if (!userResult.success || !userResult.data) {
			return res.status(404).json({
				success: false,
				error: 'User not found',
			})
		}

		const user = userResult.data

		// Step 3: Return verification status
		res.json({
			success: true,
			emailVerified: user.emailVerified,
		})
	} catch (error) {
		console.error('Check email verification status error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error while checking verification status',
		})
	}
}
