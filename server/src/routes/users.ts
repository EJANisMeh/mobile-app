import express from 'express'
import { prisma } from '../index'

const router = express.Router()

// Get all users (for debugging/admin purposes)
router.get('/', async (req, res) => {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				role: true,
				fname: true,
				lname: true,
				email: true,
				emailVerified: true,
				concession_id: true,
				createdAt: true,
				updatedAt: true,
				// Exclude password hash for security
			},
			orderBy: { createdAt: 'desc' },
		})

		res.json({
			success: true,
			users,
			count: users.length,
		})
	} catch (error) {
		console.error('Error fetching users:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
})

// Seed test users endpoint
router.post('/seed-test-users', async (req, res) => {
	try {
		const bcrypt = require('bcryptjs')

		// Clear existing users first (only in development)
		if (process.env.NODE_ENV === 'development') {
			await prisma.user.deleteMany({})
		}

		// Create specific test users
		const testUsers = [
			{
				fname: 'John',
				lname: 'Customer1',
				email: 'customer1@example.com',
				passwordHash: await bcrypt.hash('password123', 12),
				role: 'CUSTOMER',
				emailVerified: true,
			},
			{
				fname: 'Jane',
				lname: 'Customer2',
				email: 'customer2@example.com',
				passwordHash: await bcrypt.hash('password123', 12),
				role: 'CUSTOMER',
				emailVerified: true,
			},
			{
				fname: 'Mike',
				lname: 'Concessionaire1',
				email: 'concessionaire1@example.com',
				passwordHash: await bcrypt.hash('password123', 12),
				role: 'CONCESSION_OWNER',
				emailVerified: true,
				concession_id: 1,
			},
			{
				fname: 'Sarah',
				lname: 'Concessionaire2',
				email: 'concessionaire2@example.com',
				passwordHash: await bcrypt.hash('password123', 12),
				role: 'CONCESSION_OWNER',
				emailVerified: true,
				concession_id: 2,
			},
			{
				fname: 'Test',
				lname: 'Unverified',
				email: 'unverified@test.com',
				passwordHash: await bcrypt.hash('password123', 12),
				role: 'CUSTOMER',
				emailVerified: false,
			},
		]

		// Insert all test users
		const createdUsers = []
		for (const userData of testUsers) {
			const user = await prisma.user.create({ data: userData })
			createdUsers.push({
				id: user.id,
				email: user.email,
				role: user.role,
				emailVerified: user.emailVerified,
			})
		}

		res.json({
			success: true,
			message: 'Test users seeded successfully',
			users: createdUsers,
		})
	} catch (error) {
		console.error('Error seeding test users:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error during user seeding',
		})
	}
})

export default router
