import express from 'express'
import bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { prisma, selectOne, insertQuery } from '../db'

// Environment variables
const JWT_SECRET: string = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d'

/**
 * Register endpoint handler
 * Process:
 * 1. Validate all required fields (fname, lname, email, password, role)
 * 2. Check if user already exists using selectOne from backend/db
 * 3. Hash password using bcrypt
 * 4. Create user using insertQuery from backend/db with new_login=true and emailVerified=false
 * 5. Generate JWT token
 * 6. Return user data and token
 */
export const register = async (req: express.Request, res: express.Response) => {
	try {
		const { fname, lname, email, password, role } = req.body

		// Step 1: Validate input
		if (!fname || !lname || !email || !password || !role) {
			return res.status(400).json({
				success: false,
				error: 'All fields are required (fname, lname, email, password, role)',
			})
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			return res.status(400).json({
				success: false,
				error: 'Invalid email format',
			})
		}

		// Validate password length
		if (password.length < 6) {
			return res.status(400).json({
				success: false,
				error: 'Password must be at least 6 characters long',
			})
		}

		// Validate role
		const validRoles = [
			'customer',
			'concessionaire',
			'cafeteria_admin',
			'system_admin',
		]
		if (!validRoles.includes(role.toLowerCase())) {
			return res.status(400).json({
				success: false,
				error:
					'Invalid role. Must be one of: customer, concessionaire, cafeteria_admin, system_admin',
			})
		}

		// Step 2: Check if user already exists using modularized selectOne query
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

		// Step 3: Hash password using bcrypt
		const passwordHash = await bcrypt.hash(password, 12)

		// Step 4: Create user using modularized insertQuery
		// Set new_login=true (first time user) and emailVerified=false (needs verification)
		const userResult = await insertQuery(prisma, {
			table: 'user',
			data: {
				fname: fname.trim(),
				lname: lname.trim(),
				email: email.toLowerCase().trim(),
				passwordHash,
				role: role.toLowerCase(),
				new_login: true, // First time login flag
				emailVerified: false, // Needs email verification
			},
		})

		if (!userResult.success || !userResult.data) {
			return res.status(500).json({
				success: false,
				error: 'Failed to create user account',
			})
		}

		const user = userResult.data

		// Step 5: Generate JWT token
		const token = (jwt as any).sign(
			{
				userId: user.id,
				email: user.email,
				role: user.role,
			},
			JWT_SECRET,
			{ expiresIn: JWT_EXPIRES_IN }
		)

		// Step 6: Return user data (excluding password hash)
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
			needsEmailVerification: true, // Flag that email verification is needed
			message: 'Registration successful - Please verify your email',
		})
	} catch (error) {
		console.error('Registration error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error during registration',
		})
	}
}
