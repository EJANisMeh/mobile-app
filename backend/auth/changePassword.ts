import express from 'express'
import bcrypt from 'bcryptjs'
import { prisma, updateQuery, selectOne } from '../db'

/**
 * Change password endpoint handler
 * Process:
 * 1. Validate current password and new password are provided
 * 2. Find user by ID using selectOne from backend/db
 * 3. Verify current password matches using bcrypt
 * 4. Hash new password using bcrypt
 * 5. Update password in database using updateQuery from backend/db
 */
export const changePassword = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { userId } = req.params
		const { currentPassword, newPassword } = req.body

		// Step 1: Validate input
		if (!currentPassword || !newPassword) {
			return res.status(400).json({
				success: false,
				error: 'Current password and new password are required',
			})
		}

		// Validate new password length
		if (newPassword.length < 6) {
			return res.status(400).json({
				success: false,
				error: 'New password must be at least 6 characters long',
			})
		}

		// Validate new password is different from current
		if (currentPassword === newPassword) {
			return res.status(400).json({
				success: false,
				error: 'New password must be different from current password',
			})
		}

		// Step 2: Get user using modularized selectOne query
		const userResult = await selectOne(prisma, {
			table: 'user',
			where: { id: parseInt(userId) },
		})

		if (!userResult.success || !userResult.data) {
			return res.status(404).json({
				success: false,
				error: 'User not found',
			})
		}

		const user = userResult.data

		// Step 3: Verify current password using bcrypt
		const passwordMatch = await bcrypt.compare(
			currentPassword,
			user.passwordHash
		)

		if (!passwordMatch) {
			return res.status(400).json({
				success: false,
				error: 'Current password is incorrect',
			})
		}

		// Step 4: Hash new password using bcrypt
		const newPasswordHash = await bcrypt.hash(newPassword, 12)

		// Step 5: Update password using modularized updateQuery
		const updateResult = await updateQuery(prisma, {
			table: 'user',
			where: { id: parseInt(userId) },
			data: { passwordHash: newPasswordHash },
		})

		if (!updateResult.success) {
			return res.status(500).json({
				success: false,
				error: 'Failed to update password',
			})
		}

		return res.json({
			success: true,
			message: 'Password changed successfully',
		})
	} catch (error) {
		console.error('Change password error:', error)
		return res.status(500).json({
			success: false,
			error: 'Internal server error while changing password',
		})
	}
}
