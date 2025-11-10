import express from 'express'
import { prisma, selectQuery } from '../db'

/**
 * Validates price adjustments to check if any items will become free
 * Validates both category mode and existing items mode price adjustments
 * POST /menu/validate-price-adjustment
 * Body: {
 *   concessionId: number,
 *   variationGroups: Array<{
 *     mode: string,
 *     categoryFilterId?: number | null,
 *     categoryFilterIds?: number[],
 *     categoryPriceAdjustment?: string | null,
 *     options?: Array<{
 *       priceAdjustment?: string | null
 *     }>,
 *     existingMenuItemIds?: number[]
 *   }>
 * }
 */
export const validatePriceAdjustment = async (
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

		const allAffectedItems: Array<{
			id: number
			name: string
			originalPrice: number
			adjustedPrice: number
		}> = []

		// ===== PART 1: Validate Category Mode Groups =====
		const categoryGroups = variationGroups.filter(
			(group: any) =>
				(group.mode === 'single-category' || group.mode === 'multi-category') &&
				group.categoryPriceAdjustment != null
		)

		if (categoryGroups.length > 0) {
			// Check if any have negative price adjustment
			const negativeAdjustmentGroups = categoryGroups.filter((group: any) => {
				const adjustment = parseFloat(group.categoryPriceAdjustment || '0')
				return !isNaN(adjustment) && adjustment < 0
			})

			if (negativeAdjustmentGroups.length > 0) {
				// Collect all unique category IDs
				const categoryIds = new Set<number>()
				negativeAdjustmentGroups.forEach((group: any) => {
					if (group.mode === 'single-category' && group.categoryFilterId) {
						categoryIds.add(group.categoryFilterId)
					} else if (
						group.mode === 'multi-category' &&
						group.categoryFilterIds
					) {
						group.categoryFilterIds.forEach((id: number) => categoryIds.add(id))
					}
				})

				const uniqueCategoryIds = Array.from(categoryIds)

				if (uniqueCategoryIds.length > 0) {
					// Query menu items from those categories WITH their category links
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
						include: {
							menu_item_category_links: {
								select: {
									category_id: true,
								},
							},
						},
					})

					if (menuItemsResult.success && menuItemsResult.data) {
						const menuItems = menuItemsResult.data as Array<{
							id: number
							name: string
							basePrice: any
							menu_item_category_links: Array<{ category_id: number }>
						}>

						// Calculate if any item will hit 0 or negative
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

							// Get category IDs for this item
							const itemCategoryIds = item.menu_item_category_links.map(
								(link) => link.category_id
							)

							// Find the most negative adjustment that affects this item
							// Only apply adjustments from groups that include this item's categories
							let minAdjustedPrice = basePrice
							negativeAdjustmentGroups.forEach((group: any) => {
								const adjustment = parseFloat(
									group.categoryPriceAdjustment || '0'
								)

								// Check if this group's categories overlap with item's categories
								let groupAppliesToItem = false
								if (
									group.mode === 'single-category' &&
									group.categoryFilterId
								) {
									groupAppliesToItem = itemCategoryIds.includes(
										group.categoryFilterId
									)
								} else if (
									group.mode === 'multi-category' &&
									group.categoryFilterIds
								) {
									groupAppliesToItem = group.categoryFilterIds.some(
										(catId: number) => itemCategoryIds.includes(catId)
									)
								}

								if (groupAppliesToItem) {
									const adjustedPrice = Math.max(0, basePrice + adjustment)
									if (adjustedPrice < minAdjustedPrice) {
										minAdjustedPrice = adjustedPrice
									}
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

						allAffectedItems.push(
							...Array.from(affectedItemsMap.values()).map((item) => ({
								id: item.id,
								name: item.name,
								originalPrice: item.originalPrice,
								adjustedPrice: item.minAdjustedPrice,
							}))
						)
					}
				}
			}
		}

		// ===== PART 2: Validate Existing Items Mode Groups =====
		const existingItemsGroups = variationGroups.filter(
			(group: any) =>
				group.mode === 'existing' &&
				group.existingMenuItemIds &&
				group.existingMenuItemIds.length > 0 &&
				group.options &&
				group.options.length > 0
		)

		if (existingItemsGroups.length > 0) {
			// Collect all unique existing menu item IDs
			const existingItemIds = new Set<number>()
			existingItemsGroups.forEach((group: any) => {
				group.existingMenuItemIds.forEach((id: number) =>
					existingItemIds.add(id)
				)
			})

			const uniqueExistingItemIds = Array.from(existingItemIds)

			if (uniqueExistingItemIds.length > 0) {
				// Query the existing menu items
				const existingItemsResult = await selectQuery(prisma, {
					table: 'menuItem',
					where: {
						id: {
							in: uniqueExistingItemIds,
						},
					},
					columns: ['id', 'name', 'basePrice'],
				})

				if (existingItemsResult.success && existingItemsResult.data) {
					const existingItems = existingItemsResult.data as Array<{
						id: number
						name: string
						basePrice: any
					}>

					// Check each group and each item-option pair
					existingItemsGroups.forEach((group: any) => {
						// Each option corresponds to an item at the same index
						group.existingMenuItemIds.forEach(
							(itemId: number, index: number) => {
								const item = existingItems.find((i) => i.id === itemId)
								if (!item) return

								const basePrice =
									typeof item.basePrice === 'string'
										? parseFloat(item.basePrice)
										: typeof item.basePrice === 'number'
										? item.basePrice
										: parseFloat(String(item.basePrice))

								if (isNaN(basePrice) || basePrice <= 0) {
									return // Skip items already at 0 or invalid prices
								}

								// Get the option at the same index as this item
								const option = group.options[index]
								if (!option || !option.priceAdjustment) return

								const adjustment = parseFloat(option.priceAdjustment)
								if (isNaN(adjustment) || adjustment >= 0) return // Only check negative adjustments

								const adjustedPrice = Math.max(0, basePrice + adjustment)

								// If adjustment makes it 0 or negative, add to affected items
								if (adjustedPrice === 0) {
									// Check if not already added
									const alreadyAdded = allAffectedItems.some(
										(affectedItem) => affectedItem.id === item.id
									)
									if (!alreadyAdded) {
										allAffectedItems.push({
											id: item.id,
											name: item.name,
											originalPrice: basePrice,
											adjustedPrice: adjustedPrice,
										})
									}
								}
							}
						)
					})
				}
			}
		}

		// ===== Return Results =====
		if (allAffectedItems.length === 0) {
			return res.json({
				success: true,
				hasIssue: false,
				affectedItems: [],
				message: null,
			})
		}

		// Return warning message
		const itemNames = allAffectedItems.map((item) => item.name).join(', ')
		const message = `One or more items will have a price of ₱0 because of the price adjustment values: ${itemNames}\n\nAre you sure this is the intended purpose?`

		return res.json({
			success: true,
			hasIssue: true,
			affectedItems: allAffectedItems,
			message,
		})
	} catch (error) {
		console.error('Validate price adjustment error:', error)
		return res.status(500).json({
			success: false,
			error: 'Internal server error while validating price adjustment',
		})
	}
}
