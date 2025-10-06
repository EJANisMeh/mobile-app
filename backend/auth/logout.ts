import express from 'express'

/**
 * Logout endpoint handler
 * Note: Since we're using JWT tokens (stateless), logout is primarily handled on the client side
 * by removing the token from AsyncStorage. However, we provide this endpoint for:
 * 1. Logging logout events for analytics/security
 * 2. Future token blacklisting if needed
 * 3. Clearing any server-side session data if implemented later
 *
 * For now, this is a simple acknowledgment endpoint.
 * The actual logout logic (clearing tokens) happens in the frontend via AsyncStorage.
 */
export const logout = async (req: express.Request, res: express.Response) => {
	try {
		const { userId } = req.body

		// Log logout event (optional - for analytics/security)
		if (userId) {
			console.log(`User ${userId} logged out at ${new Date().toISOString()}`)
		}

		// Future: Implement token blacklisting here if needed
		// Future: Clear any server-side session data

		res.json({
			success: true,
			message: 'Logout successful',
		})
	} catch (error) {
		console.error('Logout error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error during logout',
		})
	}
}
