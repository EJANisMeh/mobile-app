import express from 'express'
import bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { prisma, selectOne, updateQuery } from '../db'

// Environment variables
const JWT_SECRET: string = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d'

/**
 * Login endpoint handler
 * Process:
 * 1. Validate credentials (email and password)
 * 2. Search for user by email using selectOne from backend/db
 * 3. Validate password matches
 * 4. Check email_verify status - if false, return needsEmailVerification
 * 5. Check new_login status - if true, return needsProfileCreation
 * 6. Generate JWT token and return user data
 */
export const login = async (req: express.Request, res: express.Response) => {
	try {
		const { email, password } = req.body

		// Step 1: Validate input
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				error: 'Email and password are required',
			})
		}
		// Step 2: Find user by email using modularized selectOne query
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

		// Step 3: Verify password using bcrypt
		const passwordMatch = await bcrypt.compare(password, user.passwordHash)

		if (!passwordMatch) {
			return res.status(401).json({
				success: false,
				error: 'Invalid email or password',
			})
		}

		// Return user data (excluding password hash)
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

		// Step 4: Check if email is verified
		if (!user.emailVerified)
		{
			return res.json({
				success: true,
				user: userResponse,
				needsEmailVerification: true,
				message: 'Login successful - Please verify your email',
			})
		}

		// Step 5: Check if this is a new login (first time login after registration)
		if (user.new_login) {
			// User needs to complete profile creation
			// Issue a JWT token so they can complete their profile, but flag them as needing profile creation
			const token = (jwt as any).sign(
				{
					userId: user.id,
					email: user.email,
					role: user.role,
				},
				JWT_SECRET,
				{ expiresIn: JWT_EXPIRES_IN }
			)

			return res.json({
				success: true,
				user: userResponse,
				token,
				needsProfileCreation: true,
				message: 'Login successful - Please complete your profile',
			})
		} // Step 6: Generate JWT token for successful login
		const token = (jwt as any).sign(
			{
				userId: user.id,
				email: user.email,
				role: user.role,
			},
			JWT_SECRET,
			{ expiresIn: JWT_EXPIRES_IN }
		)

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
