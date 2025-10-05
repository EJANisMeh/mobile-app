import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../index'

const router = express.Router()

// JWT Secret
const JWT_SECRET =
	process.env.JWT_SECRET ||
	'your-super-secret-jwt-key-change-this-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Register endpoint
router.post('/register', async (req, res) => {
	try {
		const { fname, lname, email, password, role } = req.body

		// Validate input
		if (!fname || !lname || !email || !password || !role) {
			return res.status(400).json({
				success: false,
				error: 'All fields are required',
			})
		}

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		})

		if (existingUser) {
			return res.status(400).json({
				success: false,
				error: 'An account with this email already exists',
			})
		}

		// Hash password
		const passwordHash = await bcrypt.hash(password, 12)

		// Create user
		const user = await prisma.user.create({
			data: {
				fname: fname.trim(),
				lname: lname.trim(),
				email: email.toLowerCase().trim(),
				passwordHash,
				role,
				emailVerified: false, // In development, you might want to set this to true
			},
		})

		// Generate JWT token
		const token = jwt.sign(
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
})

// Login endpoint
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body

		// Validate input
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				error: 'Email and password are required',
			})
		}

		// Find user by email
		const user = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		})

		if (!user) {
			return res.status(401).json({
				success: false,
				error: 'Invalid email or password',
			})
		}

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
		const token = jwt.sign(
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
})

// Verify token endpoint
router.post('/verify-token', async (req, res) => {
	try {
		const { token } = req.body

		if (!token) {
			return res.status(400).json({
				success: false,
				error: 'Token is required',
			})
		}

		// Verify JWT token
		const decoded = jwt.verify(token, JWT_SECRET) as any

		// Find user by ID from token
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
		})

		if (!user) {
			return res.status(401).json({
				success: false,
				error: 'User not found',
			})
		}

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
})

export default router
