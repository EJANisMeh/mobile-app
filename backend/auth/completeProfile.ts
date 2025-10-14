import express from 'express'
import * as jwt from 'jsonwebtoken'
import { prisma, updateQuery } from '../db'

// Environment variables
const JWT_SECRET: string = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d'

/**
 * Complete user profile endpoint handler
 * Process:
 * 1. Validate userId and profile data
 * 2. Update user's fname, lname, image_url, contact_details
 * 3. Set new_login to false
 * 4. Generate new JWT token (to update the token with new_login=false)
 * 5. Return updated user data with new token
 */
export const completeProfile = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { userId, fname, lname, image_url, contact_details } = req.body

		// Step 1: Validate input
		if (!userId || !fname || !lname) {
			return res.status(400).json({
				success: false,
				error: 'User ID, first name, and last name are required',
			})
		}

		// Prepare update data
		const updateData: any = {
			fname: fname.trim(),
			lname: lname.trim(),
			new_login: false,
		}

		// Add optional fields if provided
		if (image_url) {
			updateData.image_url = image_url
		}

		if (contact_details && Array.isArray(contact_details)) {
			// Filter out empty strings and store as JSON
			const filteredContacts = contact_details.filter(
				(contact: string) => contact.trim() !== ''
			)
			updateData.contact_details = filteredContacts
		}

		// Step 2: Update user profile using modularized updateQuery
		const updateResult = await updateQuery(prisma, {
			table: 'user',
			where: { id: userId },
			data: updateData,
		})

		if (!updateResult.success || !updateResult.data) {
			return res.status(500).json({
				success: false,
				error: 'Failed to update profile',
			})
		}

		const user = updateResult.data

		// Step 3: Generate new JWT token with updated user data
		const token = (jwt as any).sign(
			{
				userId: user.id,
				email: user.email,
				role: user.role,
			},
			JWT_SECRET,
			{ expiresIn: JWT_EXPIRES_IN }
		)

		// Step 4: Return updated user data (excluding password hash) with token
		const userResponse = {
			id: user.id,
			role: user.role,
			fname: user.fname,
			lname: user.lname,
			email: user.email,
			new_login: user.new_login,
			emailVerified: user.emailVerified,
			contact_details: user.contact_details,
			image_url: user.image_url,
			concession_id: user.concession_id,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		}

		res.json({
			success: true,
			user: userResponse,
			token,
			message: 'Profile completed successfully',
		})
	} catch (error) {
		console.error('Complete profile error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error during profile completion',
		})
	}
}
