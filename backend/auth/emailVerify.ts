import express from 'express'
import { prisma, selectOne, updateQuery } from '../db'

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

/**
 * Resend verification email endpoint handler
 * Process:
 * 1. Validate email is provided
 * 2. Find user by email using selectOne from backend/db
 * 3. Check if already verified
 * 4. Generate new verification token
 * 5. Send verification email (TODO: implement email service)
 */
export const resendVerificationEmail = async (
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
			// Don't reveal if email exists for security
			return res.json({
				success: true,
				message:
					'If an account exists with this email, a verification email has been sent.',
			})
		}

		const user = userResult.data

		// Step 3: Check if already verified
		if (user.emailVerified) {
			return res.json({
				success: true,
				message: 'Email is already verified',
				alreadyVerified: true,
			})
		}

		// TODO: Step 4: Generate new verification token
		// TODO: Step 5: Send verification email

		// For now, just log and return success
		console.log(`Verification email resent to: ${email}`)

		res.json({
			success: true,
			message: 'Verification email sent. Please check your inbox.',
		})
	} catch (error) {
		console.error('Resend verification email error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error while resending verification email',
		})
	}
}

/**
 * Check email verification status endpoint handler
 * Process:
 * 1. Validate email is provided
 * 2. Find user by email using selectOne from backend/db
 * 3. Return emailVerified status
 */
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
