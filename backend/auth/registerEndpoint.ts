import express from 'express'
import bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { prisma, selectOne, insertQuery } from '../db'

// Environment variables
const JWT_SECRET: string = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d'

// Register endpoint
export const register = async (req: express.Request, res: express.Response) => {
	try {
		const { fname, lname, email, password, role } = req.body

		// Validate input
		if (!fname || !lname || !email || !password || !role) {
			return res.status(400).json({
				success: false,
				error: 'All fields are required',
			})
		}

		// Check if user already exists using simplified query
		const existingUserResult = await selectOne(prisma, {
			table: 'user',
			where: { email: email.toLowerCase() },
		})

		if (existingUserResult.success && existingUserResult.data) {
			return res.status(400).json({
				success: false,
				error: 'An account with this email already exists',
			})
		}

		// Hash password
		const passwordHash = await bcrypt.hash(password, 12)

		// Create user using simplified query
		const userResult = await insertQuery(prisma, {
			table: 'user',
			data: {
				fname: fname.trim(),
				lname: lname.trim(),
				email: email.toLowerCase().trim(),
				passwordHash,
				role,
				emailVerified: false, // In development, you might want to set this to true
			},
		})

		if (!userResult.success || !userResult.data) {
			return res.status(500).json({
				success: false,
				error: 'Failed to create user account',
			})
		}

		const user = userResult.data

		// Generate JWT token
		const token = (jwt as any).sign(
			{
				userId: user.id,
				email: user.email,
				role: user.role,
			},
			JWT_SECRET,
			{ expiresIn: JWT_EXPIRES_IN }
		)

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

		res.status(201).json({
			success: true,
			user: userResponse,
			token,
			message: 'Registration successful',
		})
	} catch (error) {
		console.error('Registration error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error during registration',
		})
	}
}
