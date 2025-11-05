import express from 'express'
import { prisma, selectQuery, selectOne } from '../db'

// Get orders for a concession
export const getOrdersByConcession = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { concessionId } = req.params
		const { status } = req.query

		const whereConditions: any = {
			concessionId: parseInt(concessionId),
		}

		// Filter by status if provided
		if (status) {
			const statusResult = await selectOne(prisma, {
				table: 'order_statuses',
				where: { code: status as string },
			})

			if (statusResult.success && statusResult.data) {
				whereConditions.status_id = statusResult.data.id
			}
		}

		// Get orders using simplified query
		const ordersResult = await selectQuery(prisma, {
			table: 'order',
			where: whereConditions,
			include: {
				customer: {
					select: {
						id: true,
						fname: true,
						lname: true,
						email: true,
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
				error: 'Failed to fetch concession orders',
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
		console.error('Error fetching concession orders:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
