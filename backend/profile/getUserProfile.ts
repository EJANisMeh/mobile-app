import express from 'express'
import { prisma, selectOne } from '../db'

// Get user profile by ID
export const getUserProfile = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { userId } = req.params

		// Get user profile using simplified query
		const userResult = await selectOne(prisma, {
			table: 'user',
			where: { id: parseInt(userId) },
			columns: [
				'id',
				'role',
				'fname',
				'lname',
				'email',
				'emailVerified',
				'contact_details',
				'image_url',
				'concession_id',
				'createdAt',
				'updatedAt',
			],
		})

		if (!userResult.success || !userResult.data) {
			return res.status(404).json({
				success: false,
				error: 'User not found',
			})
		}

		res.json({
			success: true,
			user: userResult.data,
		})
	} catch (error) {
		console.error('Error fetching user profile:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
