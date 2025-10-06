import express from 'express'
import bcrypt from 'bcryptjs'
import { prisma, insertQuery, selectOne, deleteQuery } from '../db'

/**
 * Seed test users endpoint handler
 * Creates predefined test users for development and testing
 *
 * Test users created:
 * - customer1@example.com / password123 (Customer, Verified)
 * - customer2@example.com / password123 (Customer, Verified)
 * - concessionaire1@example.com / password123 (Concessionaire, Verified)
 * - concessionaire2@example.com / password123 (Concessionaire, Verified)
 * - unverified@test.com / password123 (Customer, Unverified)
 * - newuser@test.com / password123 (Customer, New Login)
 */
export const seedTestUsers = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		// Only allow in development
		if (process.env.NODE_ENV === 'production') {
			return res.status(403).json({
				success: false,
				error: 'Test user seeding is only allowed in development mode',
			})
		}

		const testUsers = [
			{
				fname: 'John',
				lname: 'Customer1',
				email: 'customer1@example.com',
				password: 'password123',
				role: 'customer',
				emailVerified: true,
				new_login: false,
			},
			{
				fname: 'Jane',
				lname: 'Customer2',
				email: 'customer2@example.com',
				password: 'password123',
				role: 'customer',
				emailVerified: true,
				new_login: false,
			},
			{
				fname: 'Mike',
				lname: 'Concessionaire1',
				email: 'concessionaire1@example.com',
				password: 'password123',
				role: 'concessionaire',
				emailVerified: true,
				new_login: false,
			},
			{
				fname: 'Sarah',
				lname: 'Concessionaire2',
				email: 'concessionaire2@example.com',
				password: 'password123',
				role: 'concessionaire',
				emailVerified: true,
				new_login: false,
			},
			{
				fname: 'Unverified',
				lname: 'User',
				email: 'unverified@test.com',
				password: 'password123',
				role: 'customer',
				emailVerified: false,
				new_login: true,
			},
			{
				fname: 'New',
				lname: 'User',
				email: 'newuser@test.com',
				password: 'password123',
				role: 'customer',
				emailVerified: true,
				new_login: true,
			},
		]

		const createdUsers = []
		const skippedUsers = []

		for (const testUser of testUsers) {
			// Check if user already exists
			const existingUser = await selectOne(prisma, {
				table: 'user',
				where: { email: testUser.email },
			})

			if (existingUser.success && existingUser.data) {
				skippedUsers.push(testUser.email)
				continue
			}

			// Hash password
			const passwordHash = await bcrypt.hash(testUser.password, 12)

			// Create user
			const result = await insertQuery(prisma, {
				table: 'user',
				data: {
					fname: testUser.fname,
					lname: testUser.lname,
					email: testUser.email,
					passwordHash,
					role: testUser.role,
					emailVerified: testUser.emailVerified,
					new_login: testUser.new_login,
				},
			})

			if (result.success) {
				createdUsers.push(testUser.email)
			}
		}

		res.json({
			success: true,
			message: `Test users seeded successfully`,
			created: createdUsers,
			skipped: skippedUsers,
			summary: {
				total: testUsers.length,
				created: createdUsers.length,
				skipped: skippedUsers.length,
			},
		})
	} catch (error) {
		console.error('Seed test users error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error while seeding test users',
		})
	}
}

/**
 * Clear all test users endpoint handler
 * Removes all test users from the database
 */
export const clearTestUsers = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		// Only allow in development
		if (process.env.NODE_ENV === 'production') {
			return res.status(403).json({
				success: false,
				error: 'Test user clearing is only allowed in development mode',
			})
		}

		const testEmails = [
			'customer1@example.com',
			'customer2@example.com',
			'concessionaire1@example.com',
			'concessionaire2@example.com',
			'unverified@test.com',
			'newuser@test.com',
		]

		let deletedCount = 0

		for (const email of testEmails) {
			const result = await deleteQuery(prisma, {
				table: 'user',
				where: { email },
			})

			if (result.success) {
				deletedCount++
			}
		}

		res.json({
			success: true,
			message: `Deleted ${deletedCount} test users`,
			deletedCount,
		})
	} catch (error) {
		console.error('Clear test users error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error while clearing test users',
		})
	}
}
