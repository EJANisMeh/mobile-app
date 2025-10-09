import express from 'express'
import {
	login,
	register,
	checkAuthStatus,
	logout,
	changePassword,
	resetPassword,
	requestPasswordReset,
	verifyEmail,
	resendVerificationEmail,
	checkEmailVerificationStatus,
} from '../backend/auth'

const router = express.Router()

// Register endpoint
router.post('/register', register)

// Login endpoint
router.post('/login', login)

// Check auth status endpoint
router.post('/check-status', checkAuthStatus)

// Logout endpoint
router.post('/logout', logout)

// Change password endpoint
router.post('/change-password', changePassword)

// Password reset endpoints
router.post('/request-reset', requestPasswordReset)
router.post('/reset-password', resetPassword)

// Email verification endpoints
router.post('/verify-email', verifyEmail)
router.post('/resend-verification', resendVerificationEmail)
router.post('/email-status', checkEmailVerificationStatus)

export default router
