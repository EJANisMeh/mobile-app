import express from 'express'
import { prisma, selectQuery } from '../db'

/**
 * Validates category price adjustments to check if any items will become free
 * POST /menu/validate-price-adjustment
 * Body: {
 *   concessionId: number,
 *   variationGroups: Array<{
 *     mode: string,
 *     categoryFilterId?: number | null,
 *     categoryFilterIds?: number[],
 *     categoryPriceAdjustment?: string | null
 *   }>
 * }
 */
export const validateCategoryPriceAdjustment = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { concessionId, variationGroups } = req.body

		if (!concessionId || !variationGroups) {
			return res.status(400).json({
				success: false,
				error: 'Missing required fields: concessionId and variationGroups',
			})
		}

		// Step 1: Check if at least one variation group uses single/multi category mode
		const categoryGroups = variationGroups.filter(
			(group: any) =>
				(group.mode === 'single-category' ||
					group.mode === 'multi-category') &&
				group.categoryPriceAdjustment != null
		)

		if (categoryGroups.length === 0) {
			return res.json({
				success: true,
				hasIssue: false,
				affectedItems: [],
				message: null,
			})
		}

		// Step 2: Check if any have negative price adjustment
		const negativeAdjustmentGroups = categoryGroups.filter((group: any) => {
			const adjustment = parseFloat(group.categoryPriceAdjustment || '0')
			return !isNaN(adjustment) && adjustment < 0
		})

		if (negativeAdjustmentGroups.length === 0) {
			return res.json({
				success: true,
				hasIssue: false,
				affectedItems: [],
				message: null,
			})
		}

		// Step 3: Collect all unique category IDs
		const categoryIds = new Set<number>()
		negativeAdjustmentGroups.forEach((group: any) => {
			if (group.mode === 'single-category' && group.categoryFilterId) {
				categoryIds.add(group.categoryFilterId)
			} else if (group.mode === 'multi-category' && group.categoryFilterIds) {
				group.categoryFilterIds.forEach((id: number) => categoryIds.add(id))
			}
		})

		const uniqueCategoryIds = Array.from(categoryIds)

		if (uniqueCategoryIds.length === 0) {
			return res.json({
				success: true,
				hasIssue: false,
				affectedItems: [],
				message: null,
			})
		}

		// Step 4: Query menu items from those categories
		const menuItemsResult = await selectQuery(prisma, {
			table: 'menuItem',
			where: {
				concessionId: parseInt(concessionId),
				menu_item_category_links: {
					some: {
						category_id: {
							in: uniqueCategoryIds,
						},
					},
				},
			},
			columns: ['id', 'name', 'basePrice'],
		})

		if (!menuItemsResult.success || !menuItemsResult.data) {
			return res.json({
				success: true,
				hasIssue: false,
				affectedItems: [],
				message: null,
			})
		}

		const menuItems = menuItemsResult.data as Array<{
			id: number
			name: string
			basePrice: any
		}>

		// Step 5: Calculate if any item will hit 0 or negative
		const affectedItemsMap = new Map<
			number,
			{
				id: number
				name: string
				originalPrice: number
				minAdjustedPrice: number
			}
		>()

		menuItems.forEach((item) => {
			const basePrice =
				typeof item.basePrice === 'string'
					? parseFloat(item.basePrice)
					: typeof item.basePrice === 'number'
					? item.basePrice
					: parseFloat(String(item.basePrice))

			if (isNaN(basePrice) || basePrice <= 0) {
				return // Skip items already at 0 or invalid prices
			}

			// Find the most negative adjustment that affects this item
			let minAdjustedPrice = basePrice
			negativeAdjustmentGroups.forEach((group: any) => {
				const adjustment = parseFloat(group.categoryPriceAdjustment || '0')
				const adjustedPrice = Math.max(0, basePrice + adjustment)
				if (adjustedPrice < minAdjustedPrice) {
					minAdjustedPrice = adjustedPrice
				}
			})

			// If any adjustment makes it 0 or negative, add to affected items
			if (minAdjustedPrice === 0) {
				affectedItemsMap.set(item.id, {
					id: item.id,
					name: item.name,
					originalPrice: basePrice,
					minAdjustedPrice,
				})
			}
		})

		const affectedItems = Array.from(affectedItemsMap.values()).map(
			(item) => ({
				id: item.id,
				name: item.name,
				originalPrice: item.originalPrice,
				adjustedPrice: item.minAdjustedPrice,
			})
		)

		if (affectedItems.length === 0) {
			return res.json({
				success: true,
				hasIssue: false,
				affectedItems: [],
				message: null,
			})
		}

		// Step 6: Return warning message
		const itemNames = affectedItems.map((item) => item.name).join(', ')
		const message = `One or more items within the concession will have a base price of ₱0 because of the price adjustment value\n\nAre you sure this is the intended purpose?`

		return res.json({
			success: true,
			hasIssue: true,
			affectedItems,
			message,
		})
	} catch (error) {
		console.error('Validate category price adjustment error:', error)
		return res.status(500).json({
			success: false,
			error: 'Internal server error while validating price adjustment',
		})
	}
}
