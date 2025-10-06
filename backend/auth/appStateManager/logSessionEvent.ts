/**
 * Log session events for debugging/analytics
 */

export const logSessionEvent = (
	event: 'background' | 'foreground' | 'logout' | 'expired',
	userId?: number
): void => {
	const timestamp = new Date().toISOString()
	console.log(
		`[Session Event] ${event.toUpperCase()} - User: ${
			userId || 'N/A'
		} - Time: ${timestamp}`
	)

	// TODO: In production, send this to analytics service
	// TODO: Store session events in database for security auditing
}
