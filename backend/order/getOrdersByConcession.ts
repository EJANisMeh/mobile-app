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
								imageUrl: true,
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

		res.json({
			success: true,
			orders: ordersResult.data || [],
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
