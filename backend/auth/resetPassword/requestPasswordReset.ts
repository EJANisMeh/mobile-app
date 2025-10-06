/**
 * Request password reset endpoint handler
 * Sends a password reset email with a token
 * Process:
 * 1. Validate email is provided
 * 2. Find user by email using selectOne from backend/db
 * 3. Generate reset token
 * 4. Store reset token in database (TODO: add reset_token field to user table)
 * 5. Send reset email (TODO: implement email service)
 */

import express from 'express'
import { prisma, selectOne } from '../../db'

export const requestPasswordReset = async (
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

		// Don't reveal if email exists or not for security
		// Always return success to prevent email enumeration
		if (!userResult.success || !userResult.data) {
			return res.json({
				success: true,
				message:
					'If an account exists with this email, a password reset link has been sent.',
			})
		}

		// TODO: Step 3: Generate reset token
		// TODO: Step 4: Store reset token in database
		// TODO: Step 5: Send reset email

		// For now, just log and return success
		console.log(`Password reset requested for email: ${email}`)

		res.json({
			success: true,
			message:
				'If an account exists with this email, a password reset link has been sent.',
		})
	} catch (error) {
		console.error('Request password reset error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error while requesting password reset',
		})
	}
}
