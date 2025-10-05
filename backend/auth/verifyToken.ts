import express from 'express'
import jwt from 'jsonwebtoken'
import { prisma, selectOne } from '../db'

// JWT Secret
const JWT_SECRET =
	process.env.JWT_SECRET ||
	'your-super-secret-jwt-key-change-this-in-production'

// Verify token endpoint
export const verifyToken = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { token } = req.body

		if (!token) {
			return res.status(400).json({
				success: false,
				error: 'Token is required',
			})
		}

		// Verify JWT token
		const decoded = jwt.verify(token, JWT_SECRET as string) as any

		// Find user by ID from token using simplified query
		const userResult = await selectOne(prisma, {
			table: 'user',
			where: { id: decoded.userId },
		})

		if (!userResult.success || !userResult.data) {
			return res.status(401).json({
				success: false,
				error: 'User not found',
			})
		}

		const user = userResult.data

		// Return user data (excluding password)
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
		res.status(401).json({
			success: false,
			error: 'Invalid or expired token',
			valid: false,
		})
	}
}
