import express from 'express'
import { prisma, selectQuery } from '../db'

// Get order details by order ID
export const getOrderDetails = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { orderId } = req.params
		const orderIdInt = parseInt(orderId)

		if (isNaN(orderIdInt)) {
			return res.status(400).json({
				success: false,
				error: 'Invalid order ID',
			})
		}

		// Get order with all details
		const orderResult = await selectQuery(prisma, {
			table: 'order',
			where: { id: orderIdInt },
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
								id: true,
								name: true,
								description: true,
								images: true,
								basePrice: true,
							},
						},
					},
				},
			},
		})

		if (!orderResult.success) {
			return res.status(500).json({
				success: false,
				error: 'Failed to fetch order details',
			})
		}

		// Check if order exists
		const orders = Array.isArray(orderResult.data)
			? orderResult.data
			: [orderResult.data]

		if (!orders || orders.length === 0) {
			return res.status(404).json({
				success: false,
				error: 'Order not found',
			})
		}

		// Convert Decimal types to numbers for JSON serialization
		const order = orders[0]
		const orderWithNumbers = {
			...order,
			total: order.total ? Number(order.total) : 0,
			orderItems: order.orderItems?.map((item: any) => ({
				...item,
				unitPrice: item.unitPrice ? Number(item.unitPrice) : 0,
				item_total: item.item_total ? Number(item.item_total) : 0,
			})),
		}

		res.json({
			success: true,
			order: orderWithNumbers,
		})
	} catch (error) {
		console.error('Error fetching order details:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
