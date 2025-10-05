import express from 'express'
import { login } from './loginEndpoint'
import { register } from './registerEndpoint'
import { verifyToken } from './verifyToken'

const router = express.Router()

// Register endpoint
router.post('/register', register)

// Login endpoint
router.post('/login', login)

// Verify token endpoint
router.post('/verify-token', verifyToken)

export default router
