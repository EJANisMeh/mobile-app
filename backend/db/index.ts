// Database backend index - exports all database connection and setup
// This file provides database connection and initialization for the Express server

import { PrismaClient } from '@prisma/client'

// Initialize Prisma Client
export const prisma = new PrismaClient({
	log:
		process.env.NODE_ENV === 'development'
			? ['query', 'info', 'warn', 'error']
			: ['error'],
})

// Database connection helper
export const connectDatabase = async () => {
	try {
		await prisma.$connect()
		console.log('✅ Database connected successfully')
	} catch (error) {
		console.error('❌ Database connection failed:', error)
		process.exit(1)
	}
}

// Graceful shutdown helper
export const disconnectDatabase = async () => {
	try {
		await prisma.$disconnect()
		console.log('✅ Database disconnected successfully')
	} catch (error) {
		console.error('❌ Database disconnection error:', error)
	}
}

// Export simplified query functions
export { selectQuery, selectOne } from './selectQuery'
export { insertQuery, upsertQuery } from './insertQuery'
export { updateQuery, updateManyQuery } from './updateQuery'
export { deleteQuery, deleteManyQuery } from './deleteQuery'
