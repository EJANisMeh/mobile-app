import express from 'express'
import { prisma, selectOne, updateQuery } from '../../db'

/**
 * Verify email endpoint handler
 * Process:
 * 1. Validate userId and verificationCode are provided
 * 2. Find user by userId
 * 3. Verify the code matches (hardcoded to '123456' for development)
 * 4. Update emailVerified to true using updateQuery from backend/db
 */
export const verifyEmail = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { userId, verificationCode } = req.body

		// Step 1: Validate input
		if (!userId || !verificationCode) {
			return res.status(400).json({
				success: false,
				error: 'User ID and verification code are required',
			})
		}

		// Step 2: Find user by userId
		const userResult = await selectOne(prisma, {
			table: 'user',
			where: { id: userId },
		})

		if (!userResult.success || !userResult.data) {
			return res.status(404).json({
				success: false,
				error: 'User not found',
			})
		}

		const user = userResult.data

		// Check if already verified
		if (user.emailVerified) {
			return res.json({
				success: true,
				message: 'Email is already verified',
				alreadyVerified: true,
			})
		}

		// Step 3: Verify the code (hardcoded to '123456' for development)
		// TODO: In production, store and validate actual verification codes
		const VERIFICATION_CODE = '123456'
		if (verificationCode !== VERIFICATION_CODE) {
			return res.status(400).json({
				success: false,
				error: 'Invalid verification code',
			})
		}

		// Step 4: Update emailVerified to true using modularized updateQuery
		const updateResult = await updateQuery(prisma, {
			table: 'user',
			where: { id: user.id },
			data: { emailVerified: true },
		})

		if (!updateResult.success) {
			return res.status(500).json({
				success: false,
				error: 'Failed to verify email',
			})
		}

		res.json({
			success: true,
			message: 'Email verified successfully. You can now login.',
		})
	} catch (error) {
		console.error('Email verification error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error during email verification',
		})
	}
}



