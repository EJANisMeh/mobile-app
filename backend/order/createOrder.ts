import express from 'express'
import { prisma, selectOne } from '../db'
import {
	isMenuItemScheduledOnDate,
	normalizeMenuItemSchedule,
} from '../../utils/menuItemSchedule'

type OrderMode = 'now' | 'scheduled'

// Create a new order
export const createOrder = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const {
			customerId,
			concessionId,
			orderItems,
			total,
			payment_mode,
			concession_note,
			orderMode,
			scheduledFor,
		} = req.body

		// Validate required fields
		if (
			!customerId ||
			!concessionId ||
			!orderItems ||
			!Array.isArray(orderItems) ||
			orderItems.length === 0
		) {
			return res.status(400).json({
				success: false,
				error:
					'Missing required fields: customerId, concessionId, and orderItems',
			})
		}

		const resolvedMode: OrderMode =
			typeof orderMode === 'string' && orderMode.toLowerCase() === 'scheduled'
				? 'scheduled'
				: 'now'

		const validationErrors: string[] = []
		const now = new Date()
		let scheduledDate: Date | null = null

		if (resolvedMode === 'scheduled') {
			if (typeof scheduledFor !== 'string') {
				validationErrors.push(
					'Scheduled orders require a future date and time.'
				)
			} else {
				const parsed = new Date(scheduledFor)
				if (Number.isNaN(parsed.getTime())) {
					validationErrors.push('Scheduled date and time is invalid.')
				} else if (parsed.getTime() <= now.getTime()) {
					validationErrors.push(
						'Scheduled date and time must be in the future.'
					)
				} else {
					scheduledDate = parsed
				}
			}
		}

		// Fetch menu items to validate availability and schedule
		for (const item of orderItems) {
			const menuItem = await prisma.menuItem.findUnique({
				where: { id: item.menuItemId },
				select: {
					name: true,
					availability: true,
					availabilitySchedule: true,
				},
			})

			if (!menuItem) {
				validationErrors.push(
					`Menu item ${item.menuItemId} is no longer available. Please refresh and try again.`
				)
				continue
			}

			const schedule = normalizeMenuItemSchedule(
				menuItem.availabilitySchedule ?? undefined
			)

			if (resolvedMode === 'now') {
				if (!menuItem.availability) {
					validationErrors.push(`${menuItem.name} is out of stock.`)
				} else if (!isMenuItemScheduledOnDate(schedule, now)) {
					validationErrors.push(`${menuItem.name} is not being sold today.`)
				}
			} else if (scheduledDate) {
				if (!isMenuItemScheduledOnDate(schedule, scheduledDate)) {
					validationErrors.push(
						`${menuItem.name} is not available at the scheduled date and time.`
					)
				}
			}
		}

		if (validationErrors.length > 0) {
			return res.status(400).json({
				success: false,
				error: 'Order validation failed',
				reasons: validationErrors,
			})
		}

		// Get pending status ID using simplified query
		const pendingStatusResult = await selectOne(prisma, {
			table: 'order_statuses',
			where: { code: 'PENDING' },
		})

		if (!pendingStatusResult.success || !pendingStatusResult.data) {
			return res.status(500).json({
				success: false,
				error: 'Order status configuration error',
			})
		}

		const pendingStatus = pendingStatusResult.data

		// Create order with items in a transaction
		const result = await prisma.$transaction(async (tx) => {
			// Create the order directly with tx
			const order = await tx.order.create({
				data: {
					customerId,
					concessionId,
					total,
					payment_mode: payment_mode || {},
					status_id: pendingStatus.id,
					concession_note: concession_note || null,
					orderMode: resolvedMode,
					scheduledFor: scheduledDate,
				},
			})

			// Create order items
			const createdOrderItems = []
			for (const item of orderItems) {
				const orderItem = await tx.orderItem.create({
					data: {
						orderId: order.id,
						menuItemId: item.menuItemId,
						variationId: item.variationId || null,
						addon_menu_item_id: item.addon_menu_item_id || null,
						quantity: item.quantity,
						unitPrice: item.unitPrice,
						variation_snapshot: item.variation_snapshot || null,
						options_snapshot: item.options_snapshot || null,
						addons_snapshot: item.addons_snapshot || null,
						item_total: item.item_total,
					},
				})

				createdOrderItems.push(orderItem)
			}

			return { order, orderItems: createdOrderItems }
		})

		res.status(201).json({
			success: true,
			message: 'Order created successfully',
			order: result.order,
			orderItems: result.orderItems,
		})
	} catch (error) {
		console.error('Error creating order:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
