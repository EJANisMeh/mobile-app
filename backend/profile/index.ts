import express from 'express'
import { getUserProfile } from './getUserProfile'
import { updateUserProfile } from './updateUserProfile'
import { changePassword } from './changePassword'

const router = express.Router()

// Get user profile
router.get('/:userId', getUserProfile)

// Update user profile
router.put('/:userId', updateUserProfile)

// Change password
router.put('/:userId/password', changePassword)

export default router
