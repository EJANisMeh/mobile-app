import express from 'express'
import jwt from 'jsonwebtoken'
import { prisma, selectOne } from '../db'

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'

/**
 * Check authentication status endpoint handler
 * Process:
 * 1. Verify JWT token is provided
 * 2. Decode and verify JWT token
 * 3. Find user by ID from token using selectOne from backend/db
 * 4. Return user data if valid, error if invalid
 */
export const checkAuthStatus = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { token } = req.body

		// Step 1: Validate token is provided
		if (!token) {
			return res.status(400).json({
				success: false,
				error: 'Token is required',
				valid: false,
			})
		}

		// Step 2: Verify JWT token
		let decoded: any
		try {
			decoded = jwt.verify(token, JWT_SECRET as string)
		} catch (error) {
			return res.status(401).json({
				success: false,
				error: 'Invalid or expired token',
				valid: false,
			})
		}

		// Step 3: Find user by ID from token using modularized selectOne query
		const userResult = await selectOne(prisma, {
			table: 'user',
			where: { id: decoded.userId },
		})

		if (!userResult.success || !userResult.data) {
			return res.status(401).json({
				success: false,
				error: 'User not found',
				valid: false,
			})
		}

		const user = userResult.data

		// Step 4: Return user data (excluding password hash)
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
			valid: true,
		})
	} catch (error) {
		console.error('Check auth status error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error while checking authentication status',
			valid: false,
		})
	}
}
