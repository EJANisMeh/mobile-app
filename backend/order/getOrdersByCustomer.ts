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

		// Convert Decimal types to numbers for JSON serialization
		const orders = ordersResult.data || []
		const ordersWithNumbers = Array.isArray(orders)
			? orders.map((order: any) => ({
					...order,
					total: order.total ? Number(order.total) : 0,
					orderItems: order.orderItems?.map((item: any) => ({
						...item,
						unitPrice: item.unitPrice ? Number(item.unitPrice) : 0,
						item_total: item.item_total ? Number(item.item_total) : 0,
					})),
			  }))
			: []

		res.json({
			success: true,
			orders: ordersWithNumbers,
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
