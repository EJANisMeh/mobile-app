import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDatabase, disconnectDatabase } from './backend/db/index'
import authRoutes from './routes/authRouter'
import concessionRoutes from './routes/concessionRouter'
import customerRoutes from './routes/customerRouter'
import categoryRoutes from './routes/categoryRouter'
import menuRoutes from './routes/menuRouter'
import orderRoutes from './routes/orderRouter'
import notificationRoutes from './routes/notificationRouter'
import profileRoutes from './backend/profile/index'

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/concession', concessionRoutes)
app.use('/api/customer', customerRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/profile', profileRoutes)

// Health check endpoint
app.get('/api/health', (req: express.Request, res: express.Response) => {
	res.json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV,
	})
})

// Test database connection endpoint
app.get('/api/test-db', async (req: express.Request, res: express.Response) => {
	try {
		const { prisma } = await import('./backend/db')
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
const startServer = async () => {
	try {
		await connectDatabase()
		app.listen(PORT, () => {
			console.log(`🚀 Server running on:`)
			console.log(`   - Local: http://localhost:${PORT}`)
			console.log(`   - Network: http://192.168.100.35:${PORT}`)
			console.log(`📊 Health check: http://192.168.100.35:${PORT}/api/health`)
			console.log(`🗄️ Database test: http://192.168.100.35:${PORT}/api/test-db`)
		})
	} catch (error) {
		console.error('Failed to start server:', error)
		process.exit(1)
	}
}

// Graceful shutdown
process.on('beforeExit', async () => {
	await disconnectDatabase()
})

process.on('SIGINT', async () => {
	await disconnectDatabase()
	process.exit(0)
})

process.on('SIGTERM', async () => {
	await disconnectDatabase()
	process.exit(0)
})

// Start the server
startServer()
