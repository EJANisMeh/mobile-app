import express from 'express'
import { login } from '../backend/auth/login'
import { register } from '../backend/auth/register'
import { checkAuthStatus } from '../backend/auth/checkAuthStatus'
import { logout } from '../backend/auth/logout'
import { changePassword } from '../backend/auth/changePassword'
import {
	resetPassword,
	requestPasswordReset,
} from '../backend/auth/resetPassword'
import {
	verifyEmail,
	resendVerificationEmail,
	checkEmailVerificationStatus,
} from '../backend/auth/verifyEmail'

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
