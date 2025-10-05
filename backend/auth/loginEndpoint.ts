import express from 'express'
import bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { prisma, selectOne } from '../db'

// Environment variables
const JWT_SECRET: string = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d'

// Login endpoint
export const login = async (req: express.Request, res: express.Response) => {
	try {
		const { email, password } = req.body

		// Validate input
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				error: 'Email and password are required',
			})
		}

		// Find user by email using simplified query
		const userResult = await selectOne(prisma, {
			table: 'user',
			where: { email: email.toLowerCase() },
		})

		if (!userResult.success || !userResult.data) {
			return res.status(401).json({
				success: false,
				error: 'Invalid email or password',
			})
		}

		const user = userResult.data

		// Verify password
		const passwordMatch = await bcrypt.compare(password, user.passwordHash)

		if (!passwordMatch) {
			return res.status(401).json({
				success: false,
				error: 'Invalid email or password',
			})
		}

		// Check if email is verified (optional - you might want to skip this during development)
		if (!user.emailVerified && process.env.NODE_ENV === 'production') {
			return res.status(401).json({
				success: false,
				error: 'Please verify your email address before logging in',
				needsEmailVerification: true,
			})
		}

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

		res.json({
			success: true,
			user: userResponse,
			token,
			message: 'Login successful',
		})
	} catch (error) {
		console.error('Login error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error during login',
		})
	}
}
