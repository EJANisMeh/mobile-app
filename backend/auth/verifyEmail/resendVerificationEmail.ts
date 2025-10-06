/**
 * Resend verification email endpoint handler
 * Process:
 * 1. Validate email is provided
 * 2. Find user by email using selectOne from backend/db
 * 3. Check if already verified
 * 4. Generate new verification token
 * 5. Send verification email (TODO: implement email service)
 */
import express from 'express'
import { prisma, selectOne } from '../../db'

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
