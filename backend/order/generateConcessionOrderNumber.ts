import { prisma } from '../db'

/**
 * Generates the next concession order number for a given concession
 * Order numbers start from 1 and increment per concession per day
 * Resets to 1 when a new day starts
 */
export const generateConcessionOrderNumber = async (
	concessionId: number
): Promise<number> => {
	try {
		// Get today's date at midnight (start of day)
		const today = new Date()
		today.setHours(0, 0, 0, 0)

		// Get tomorrow's date at midnight (end of today)
		const tomorrow = new Date(today)
		tomorrow.setDate(tomorrow.getDate() + 1)

		// Find the highest order number for this concession today
		const orders = await prisma.order.findMany({
			where: {
				concessionId,
				createdAt: {
					gte: today,
					lt: tomorrow,
				},
			},
			orderBy: {
				concession_order_number: 'desc',
			},
			take: 1,
		})

		if (!orders || orders.length === 0 || !orders[0].concession_order_number) {
			// No orders with order number today, start from 1
			return 1
		}

		// Increment the highest order number
		return orders[0].concession_order_number + 1
	} catch (error) {
		console.error('Error generating concession order number:', error)
		// Return 1 as fallback
		return 1
	}
}
