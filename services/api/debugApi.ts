/**
 * Debug/Testing API Endpoints
 * These call backend/debug/* modules for development testing
 */
import { apiCall } from './api'

export const debugApi = {
	/**
	 * Seed test users
	 * Backend handles: creating 6 test users with various states
	 */
	seedTestUsers: async () => {
		return await apiCall('/debug/seed-users', {
			method: 'POST',
		})
	},

	/**
	 * Clear test users
	 * Backend handles: deleting test users from database
	 */
	clearTestUsers: async () => {
		return await apiCall('/debug/clear-users', {
			method: 'POST',
		})
	},

	/**
	 * Test database connection
	 * Backend handles: running test queries
	 */
	testDatabase: async () => {
		return await apiCall('/debug/test-db', {
			method: 'GET',
		})
	},

	/**
	 * Get database statistics
	 * Backend handles: counting users by role and verification status
	 */
	getDatabaseStats: async () => {
		return await apiCall('/debug/db-stats', {
			method: 'GET',
		})
	},

	/**
	 * Health check
	 * Backend handles: server status, uptime, environment info
	 */
	healthCheck: async () => {
		return await apiCall('/debug/health', {
			method: 'GET',
		})
	},
}
