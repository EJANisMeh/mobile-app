import express from 'express'
import { prisma, updateQuery, selectOne } from '../db'
import {
	normalizeMenuItemSchedule,
	hasAnyMenuItemScheduleDay,
} from '../../utils/menuItemSchedule'
import { VariationGroupMode, getKindFromMode } from '../../types'

// Edit menu item endpoint
export const editItem = async (req: express.Request, res: express.Response) => {
	try {
		const { id } = req.params
		const menuItemId = parseInt(id, 10)
		if (Number.isNaN(menuItemId)) {
			return res.status(400).json({
				success: false,
				error: 'Valid menu item ID is required',
			})
		}
		const {
			name,
			description,
			basePrice,
			categoryIds,
			availability,
			images,
			displayImageIndex,
			variationGroups,
			addons,
			availabilitySchedule,
		} = req.body

		// Validate menu item exists
		const existingItemResult = await selectOne(prisma, {
			table: 'menuItem',
			where: { id: menuItemId },
		})

		if (!existingItemResult.success || !existingItemResult.data) {
			return res.status(404).json({
				success: false,
				error: 'Menu item not found',
			})
		}

		// Prepare update data
		const updateData: any = {}
		if (name !== undefined) updateData.name = name.trim()
		if (description !== undefined)
			updateData.description = description ? description.trim() : null
		if (basePrice !== undefined) updateData.basePrice = parseFloat(basePrice)
		if (availability !== undefined) updateData.availability = availability
		if (images !== undefined) updateData.images = images
		if (displayImageIndex !== undefined)
			updateData.display_image_index = displayImageIndex
		if (availabilitySchedule !== undefined) {
			const normalizedSchedule = normalizeMenuItemSchedule(availabilitySchedule)
			if (!hasAnyMenuItemScheduleDay(normalizedSchedule)) {
				return res.status(400).json({
					success: false,
					error: 'Select at least one day in the availability schedule',
				})
			}
			updateData.availabilitySchedule = normalizedSchedule
		}

		// Update menu item using simplified query
		const menuItemResult = await updateQuery(prisma, {
			table: 'menuItem',
			where: { id: menuItemId },
			data: updateData,
		})

		if (!menuItemResult.success || !menuItemResult.data) {
			return res.status(500).json({
				success: false,
				error: 'Failed to update menu item',
			})
		}

		// Handle category links if provided
		if (categoryIds !== undefined && Array.isArray(categoryIds)) {
			// Delete existing category links
			await prisma.menu_item_category_link.deleteMany({
				where: { menu_item_id: menuItemId },
			})

			// Create new category links
			for (const categoryId of categoryIds) {
				await prisma.menu_item_category_link.create({
					data: {
						menu_item_id: menuItemId,
						category_id: categoryId,
					},
				})
			}
		}
		if (variationGroups !== undefined) {
			// Delete ALL existing variation groups for this item (all kinds)
			await prisma.menu_item_variation_groups.deleteMany({
				where: {
					menu_item_id: menuItemId,
				},
			})

			// Create new variation groups
			for (const group of variationGroups) {
				// Determine kind based on mode
				const mode = group.mode as VariationGroupMode
				const kind = getKindFromMode(mode || 'custom')

				const createdGroup = await prisma.menu_item_variation_groups.create({
					data: {
						menu_item_id: menuItemId,
						kind: kind,
						code: group.mode, // Store mode in code field
						name: group.name,
						selection_type_id: group.selectionTypeId,
						multi_limit: group.multiLimit,
						category_filter_id: group.categoryFilterId,
						position: group.position,
					},
				})
				
				// Add custom options if mode is custom
				if (group.mode === 'custom' && group.options) {
					for (const option of group.options) {
						await prisma.menu_item_variation_option_choices.create({
							data: {
								group_id: createdGroup.id,
								name: option.name,
								price_adjustment: parseFloat(option.priceAdjustment),
								availability: option.availability,
								is_default: option.isDefault,
								position: option.position,
							},
						})
					}
				}

				// Add existing menu items as options if mode is existing
				if (group.mode === 'existing' && group.existingMenuItemIds) {
					for (let i = 0; i < group.existingMenuItemIds.length; i++) {
						const menuItemId = group.existingMenuItemIds[i]
						const menuItem = await prisma.menuItem.findUnique({
							where: { id: menuItemId },
						})

						if (menuItem) {
							await prisma.menu_item_variation_option_choices.create({
								data: {
									group_id: createdGroup.id,
									code: `item_${menuItemId}`,
									name: menuItem.name,
									price_adjustment: menuItem.basePrice,
									availability: menuItem.availability,
									is_default: false,
									position: i,
								},
							})
						}
					}
				}

				// Note: Category mode does NOT create option choices here
				// Options are dynamically fetched based on category_filter_id when viewing the item
			}
		}

		// Handle addons if provided
		if (addons !== undefined) {
			// Delete existing addons for this item
			await prisma.menu_item_addons.deleteMany({
				where: { menu_item_id: menuItemId },
			})

			// Create new addons
			for (const addon of addons) {
				await prisma.menu_item_addons.create({
					data: {
						menu_item_id: menuItemId,
						target_menu_item_id: addon.menuItemId,
						label: addon.label,
						price_override: addon.priceOverride
							? parseFloat(addon.priceOverride)
							: null,
						required: addon.required,
						position: addon.position,
					},
				})
			}
		}

		const updatedMenuItem = await prisma.menuItem.findUnique({
			where: { id: menuItemId },
			include: {
				menu_item_category_links: {
					include: {
						category: true,
					},
				},
				menu_item_variation_groups: {
					where: { kind: 'group' },
					include: {
						menu_item_variation_option_choices: {
							orderBy: { position: 'asc' },
						},
						selection_types: true,
					},
					orderBy: { position: 'asc' },
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
		res.json({
			success: true,
			message: 'Menu item updated successfully',
			menuItem: updatedMenuItem,
		})
	} catch (error) {
		console.error('Edit menu item error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error while updating menu item',
		})
	}
}
