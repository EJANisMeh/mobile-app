import express from 'express'
import { prisma, selectOne, updateQuery } from '../../db'

/**
 * Verify email endpoint handler
 * Process:
 * 1. Validate verification token is provided
 * 2. Find user by verification token (TODO: add verification_token field to user table)
 * 3. Update emailVerified to true using updateQuery from backend/db
 * 4. Clear verification token
 */
export const verifyEmail = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { token, email } = req.body

		// Step 1: Validate input
		if (!token && !email) {
			return res.status(400).json({
				success: false,
				error: 'Verification token or email is required',
			})
		}

		// For development, we'll allow verification by email directly
		// In production, this should only work with a valid token
		let userResult

		if (email && process.env.NODE_ENV !== 'production') {
			// Development: Allow verification by email
			userResult = await selectOne(prisma, {
				table: 'user',
				where: { email: email.toLowerCase() },
			})
		} else if (token) {
			// TODO: In production, find user by verification token
			// For now, we'll use email as a fallback
			return res.status(501).json({
				success: false,
				error: 'Token-based verification not yet implemented',
			})
		} else {
			return res.status(400).json({
				success: false,
				error: 'Invalid verification method',
			})
		}

		if (!userResult.success || !userResult.data) {
			return res.status(404).json({
				success: false,
				error: 'User not found or invalid verification token',
			})
		}

		const user = userResult.data

		// Check if already verified
		if (user.emailVerified) {
			return res.json({
				success: true,
				message: 'Email is already verified',
				alreadyVerified: true,
			})
		}

		// Step 2: Update emailVerified to true using modularized updateQuery
		const updateResult = await updateQuery(prisma, {
			table: 'user',
			where: { id: user.id },
			data: { emailVerified: true },
		})

		if (!updateResult.success) {
			return res.status(500).json({
				success: false,
				error: 'Failed to verify email',
			})
		}

		res.json({
			success: true,
			message: 'Email verified successfully. You can now login.',
		})
	} catch (error) {
		console.error('Email verification error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error during email verification',
		})
	}
}



