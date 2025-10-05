import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth'
import userRoutes from './routes/users'

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 3000

// Initialize Prisma Client
export const prisma = new PrismaClient({
	log:
		process.env.NODE_ENV === 'development'
			? ['query', 'info', 'warn', 'error']
			: ['error'],
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
	res.json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV,
	})
})

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
	try {
		await prisma.$connect()
		const userCount = await prisma.user.count()
		res.json({
			status: 'Database connected successfully',
			userCount,
			timestamp: new Date().toISOString(),
		})
	} catch (error) {
		console.error('Database connection error:', error)
		res.status(500).json({
			status: 'Database connection failed',
			error: error instanceof Error ? error.message : 'Unknown error',
			timestamp: new Date().toISOString(),
		})
	}
})

// Error handling middleware
app.use(
	(
		err: any,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		console.error('Server error:', err)
		res.status(500).json({
			error: 'Internal server error',
			message:
				process.env.NODE_ENV === 'development'
					? err.message
					: 'Something went wrong',
		})
	}
)

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`)
	console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
	console.log(`🗄️ Database test: http://localhost:${PORT}/api/test-db`)
})

// Graceful shutdown
process.on('beforeExit', async () => {
	await prisma.$disconnect()
})

process.on('SIGINT', async () => {
	await prisma.$disconnect()
	process.exit(0)
})

process.on('SIGTERM', async () => {
	await prisma.$disconnect()
	process.exit(0)
})
