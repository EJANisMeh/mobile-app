import express from 'express'
import { prisma, selectQuery } from '../db'

// Get orders by customer ID
export const getOrdersByCustomer = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { customerId } = req.params
		const customerIdInt = parseInt(customerId)

		if (isNaN(customerIdInt)) {
			return res.status(400).json({
				success: false,
				error: 'Invalid customer ID',
			})
		}

		// Get orders using simplified query
		const ordersResult = await selectQuery(prisma, {
			table: 'order',
			where: { customerId: customerIdInt },
			include: {
				concession: {
					select: {
						id: true,
						name: true,
						cafeteria: {
							select: {
								name: true,
								location: true,
							},
						},
					},
				},
				order_statuses: {
					select: {
						code: true,
						description: true,
					},
				},
				orderItems: {
					include: {
						menuItem: {
							select: {
								name: true,
								description: true,
								images: true,
							},
						},
					},
				},
			},
			orderBy: { createdAt: 'desc' },
		})

		if (!ordersResult.success) {
			return res.status(500).json({
				success: false,
				error: 'Failed to fetch customer orders',
			})
		}

		res.json({
			success: true,
			orders: ordersResult.data || [],
			count: ordersResult.count || 0,
		})
	} catch (error) {
		console.error('Error fetching customer orders:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
