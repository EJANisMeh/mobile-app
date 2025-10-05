import express from 'express'
import bcrypt from 'bcryptjs'
import { prisma, updateQuery, selectOne } from '../db'

// Change user password
export const changePassword = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { userId } = req.params
		const { currentPassword, newPassword } = req.body

		// Validate input
		if (!currentPassword || !newPassword) {
			return res.status(400).json({
				success: false,
				error: 'Current password and new password are required',
			})
		}

		// Get user with password using simplified query
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

		// Verify current password
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

		// Hash new password
		const newPasswordHash = await bcrypt.hash(newPassword, 12)

		// Update password using simplified query
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

		res.json({
			success: true,
			message: 'Password changed successfully',
		})
	} catch (error) {
		console.error('Error changing password:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
