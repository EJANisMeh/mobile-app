import express from 'express'
import bcrypt from 'bcryptjs'
import { prisma, selectOne, updateQuery } from '../../db'

/**
 * Reset password endpoint handler
 * Process:
 * 1. Validate email and new password are provided
 * 2. Find user by email using selectOne from backend/db
 * 3. Validate new password requirements
 * 4. Hash new password using bcrypt
 * 5. Update password in database using updateQuery from backend/db
 *
 * Note: In production, this should require a reset token sent via email
 * For now, this is a simplified version for development
 */
export const resetPassword = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { email, newPassword, resetToken } = req.body

		// Step 1: Validate input
		if (!email || !newPassword) {
			return res.status(400).json({
				success: false,
				error: 'Email and new password are required',
			})
		}

		// TODO: In production, verify resetToken here
		// For now, we'll skip token verification for development
		if (process.env.NODE_ENV === 'production' && !resetToken) {
			return res.status(400).json({
				success: false,
				error: 'Reset token is required',
			})
		}

		// Validate new password length
		if (newPassword.length < 6) {
			return res.status(400).json({
				success: false,
				error: 'New password must be at least 6 characters long',
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
				error: 'No account found with this email address',
			})
		}

		const user = userResult.data

		// Step 3: Hash new password using bcrypt
		const newPasswordHash = await bcrypt.hash(newPassword, 12)

		// Step 4: Update password using modularized updateQuery
		const updateResult = await updateQuery(prisma, {
			table: 'user',
			where: { id: user.id },
			data: { passwordHash: newPasswordHash },
		})

		if (!updateResult.success) {
			return res.status(500).json({
				success: false,
				error: 'Failed to reset password',
			})
		}

		res.json({
			success: true,
			message:
				'Password reset successful. You can now login with your new password.',
		})
	} catch (error) {
		console.error('Reset password error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error while resetting password',
		})
	}
}

