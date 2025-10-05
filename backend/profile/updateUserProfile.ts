import express from 'express'
import { prisma, updateQuery, selectOne } from '../db'

// Update user profile
export const updateUserProfile = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { userId } = req.params
		const { fname, lname, contact_details, image_url } = req.body

		// Check if user exists
		const existingUserResult = await selectOne(prisma, {
			table: 'user',
			where: { id: parseInt(userId) },
		})

		if (!existingUserResult.success || !existingUserResult.data) {
			return res.status(404).json({
				success: false,
				error: 'User not found',
			})
		}

		// Prepare update data
		const updateData: any = {}
		if (fname !== undefined) updateData.fname = fname.trim()
		if (lname !== undefined) updateData.lname = lname.trim()
		if (contact_details !== undefined)
			updateData.contact_details = contact_details
		if (image_url !== undefined) updateData.image_url = image_url

		// Update user profile using simplified query
		const userResult = await updateQuery(prisma, {
			table: 'user',
			where: { id: parseInt(userId) },
			data: updateData,
		})

		if (!userResult.success || !userResult.data) {
			return res.status(500).json({
				success: false,
				error: 'Failed to update user profile',
			})
		}

		// Return updated user data (excluding password)
		const userResponse = {
			id: userResult.data.id,
			role: userResult.data.role,
			fname: userResult.data.fname,
			lname: userResult.data.lname,
			email: userResult.data.email,
			emailVerified: userResult.data.emailVerified,
			contact_details: userResult.data.contact_details,
			image_url: userResult.data.image_url,
			concession_id: userResult.data.concession_id,
			createdAt: userResult.data.createdAt,
			updatedAt: userResult.data.updatedAt,
		}

		res.json({
			success: true,
			user: userResponse,
			message: 'Profile updated successfully',
		})
	} catch (error) {
		console.error('Error updating user profile:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
