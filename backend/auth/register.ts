import express from 'express'
import bcrypt from 'bcryptjs'
import { prisma, selectOne, insertQuery } from '../db'

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
		const { email, password } = req.body

		// Step 1: Validate input (only email and password required)
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				error: 'Email and password are required',
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
		// Only store email, passwordHash, and role (hardcoded to 'customer')
		// new_login defaults to true, emailVerified defaults to false per schema
		const userResult = await insertQuery(prisma, {
			table: 'user',
			data: {
				email: email.toLowerCase().trim(),
				passwordHash,
				role: 'customer',
			},
		})

		if (!userResult.success || !userResult.data) {
			return res.status(500).json({
				success: false,
				error: 'Failed to create user account',
			})
		}

		const user = userResult.data

		res.status(201).json({
			success: true,
			userId: user.id,
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
