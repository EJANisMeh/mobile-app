import express from 'express'
import { prisma } from '../db'

// Get single menu item by ID with all details (for editing)
export const getItemById = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { itemId } = req.params

		if (!itemId || isNaN(parseInt(itemId))) {
			return res.status(400).json({
				success: false,
				error: 'Valid item ID is required',
			})
		}

		const menuItem = await prisma.menuItem.findUnique({
			where: {
				id: parseInt(itemId),
			},
			include: {
				concession: {
					select: {
						id: true,
						name: true,
						schedule: true,
						is_open: true,
					},
				},
				menu_item_category_links: {
					include: {
						category: true,
					},
				},
				menu_item_variation_groups: {
					include: {
						menu_item_variation_option_choices: {
							orderBy: {
								position: 'asc',
							},
						},
						selection_types: true,
					},
					orderBy: {
						position: 'asc',
					},
				},
				menu_item_addons_menu_item_addons_menu_item_idTomenu_items: {
					include: {
						menu_items_menu_item_addons_target_menu_item_idTomenu_items: {
							select: {
								id: true,
								name: true,
								basePrice: true,
							},
						},
					},
				},
			},
		})

		if (!menuItem) {
			return res.status(404).json({
				success: false,
				error: 'Menu item not found',
			})
		}

		// For variation groups with kind 'single_category_filter', 'multi_category_filter', or 'category_filter' (legacy), fetch menu items from the category
		if (menuItem.menu_item_variation_groups) {
			for (const group of menuItem.menu_item_variation_groups) {
				// Handle single category filter
				if (
					(group.kind === 'single_category_filter' ||
						group.kind === 'category_filter') &&
					group.category_filter_id
				) {
					// Fetch menu items that belong to this category from the same concession
					const categoryMenuItems = await prisma.menuItem.findMany({
						where: {
							concessionId: menuItem.concessionId,
							menu_item_category_links: {
								some: {
									category_id: group.category_filter_id,
								},
							},
						},
						select: {
							id: true,
							name: true,
							basePrice: true,
							availability: true,
							menu_item_category_links: {
								include: {
									category: true,
								},
							},
						},
						orderBy: {
							name: 'asc',
						},
					})

			// If parent group specificity is true, load variation groups with specificity: false for each menu item (subvariations - 1 level deep only)
			if (group.specificity) {
					for (const item of categoryMenuItems) {
						const subVariations =
							await prisma.menu_item_variation_groups.findMany({
								where: {
									menu_item_id: item.id,
									specificity: false, // Only load variations that should be shown when used as options (specificity: false)
								},
									include: {
										menu_item_variation_option_choices: {
											orderBy: {
												position: 'asc',
											},
										},
										selection_types: true,
									},
									orderBy: {
										position: 'asc',
									},
								})
							;(item as any).variationGroups = subVariations
						}
					}

					// Attach the menu items as a custom property
					;(group as any).categoryMenuItems = categoryMenuItems
				}
				// Handle multi-category filter
				else if (
					group.kind === 'multi_category_filter' &&
					group.category_filter_ids &&
					Array.isArray(group.category_filter_ids) &&
					group.category_filter_ids.length > 0
				) {
					// Fetch menu items that belong to any of these categories from the same concession
					const categoryMenuItems = await prisma.menuItem.findMany({
						where: {
							concessionId: menuItem.concessionId,
							menu_item_category_links: {
								some: {
									category_id: {
										in: group.category_filter_ids,
									},
								},
							},
						},
						select: {
							id: true,
							name: true,
							basePrice: true,
							availability: true,
							menu_item_category_links: {
								include: {
									category: true,
								},
							},
						},
						orderBy: {
							name: 'asc',
						},
				})

				// If parent group specificity is true, load variation groups with specificity: false for each menu item (subvariations - 1 level deep only)
				if (group.specificity) {
					for (const item of categoryMenuItems) {
						const subVariations =
							await prisma.menu_item_variation_groups.findMany({
								where: {
									menu_item_id: item.id,
									specificity: false, // Only load variations that should be shown when used as options (specificity: false)
								},
									include: {
										menu_item_variation_option_choices: {
											orderBy: {
												position: 'asc',
											},
										},
										selection_types: true,
									},
									orderBy: {
										position: 'asc',
									},
								})
							;(item as any).variationGroups = subVariations
						}
					}

					// Attach the menu items as a custom property
					;(group as any).categoryMenuItems = categoryMenuItems
				}
				// Handle existing items mode
				else if (group.kind === 'existing_items') {
					// Get menu item IDs from option choices
					const existingItemOptions =
						group.menu_item_variation_option_choices || []
					const menuItemIds = existingItemOptions
						.map((option) => {
							if (!option.code) return null
							const match = option.code.match(/item_(\d+)/)
							if (!match) return null
							const parsed = parseInt(match[1], 10)
							return Number.isNaN(parsed) ? null : parsed
						})
						.filter((id): id is number => id !== null)

					if (menuItemIds.length > 0) {
						// Fetch the referenced menu items
						const referencedMenuItems = await prisma.menuItem.findMany({
							where: {
								id: {
									in: menuItemIds,
								},
							},
							select: {
								id: true,
								name: true,
								basePrice: true,
								availability: true,
							},
					})

					// If parent group specificity is true, load variation groups with specificity: false for each menu item (subvariations - 1 level deep only)
					if (group.specificity) {
						for (const item of referencedMenuItems) {
							const subVariations =
								await prisma.menu_item_variation_groups.findMany({
									where: {
										menu_item_id: item.id,
										specificity: false, // Only load variations that should be shown when used as options (specificity: false)
									},
										include: {
											menu_item_variation_option_choices: {
												orderBy: {
													position: 'asc',
												},
											},
											selection_types: true,
										},
										orderBy: {
											position: 'asc',
										},
									})
								;(item as any).variationGroups = subVariations
							}
						}

						// Attach the menu items as a custom property
						;(group as any).existingMenuItems = referencedMenuItems
					}
				}
			}
		}

		res.json({
			success: true,
			item: menuItem,
		})
	} catch (error) {
		console.error('Get menu item by ID error:', error)
		res.status(500).json({
			success: false,
			error:
				error instanceof Error ? error.message : 'Failed to fetch menu item',
		})
	}
}
