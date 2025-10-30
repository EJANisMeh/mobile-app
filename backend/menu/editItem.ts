import express from 'express'
import { prisma, updateQuery, selectOne } from '../db'

// Edit menu item endpoint
export const editItem = async (req: express.Request, res: express.Response) => {
	try {
		const { id } = req.params
		const {
			name,
			description,
			basePrice,
			categoryId,
			availability,
			images,
			displayImageIndex,
			variationGroups,
			addons,
		} = req.body

		// Validate menu item exists
		const existingItemResult = await selectOne(prisma, {
			table: 'menuItem',
			where: { id: parseInt(id) },
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
		if (categoryId !== undefined) updateData.categoryId = categoryId
		if (availability !== undefined) updateData.availability = availability
		if (images !== undefined) updateData.images = images
		if (displayImageIndex !== undefined)
			updateData.display_image_index = displayImageIndex

		// Update menu item using simplified query
		const menuItemResult = await updateQuery(prisma, {
			table: 'menuItem',
			where: { id: parseInt(id) },
			data: updateData,
		})

		if (!menuItemResult.success || !menuItemResult.data) {
			return res.status(500).json({
				success: false,
				error: 'Failed to update menu item',
			})
		}

		// Handle variation groups if provided
		if (variationGroups !== undefined) {
			// Delete existing variation groups for this item
			await prisma.menu_item_variation_groups.deleteMany({
				where: {
					menu_item_id: parseInt(id),
					kind: 'group',
				},
			})

			// Create new variation groups
			for (const group of variationGroups) {
				const createdGroup = await prisma.menu_item_variation_groups.create({
					data: {
						menu_item_id: parseInt(id),
						kind: 'group',
						code: group.mode, // Store mode in code field
						name: group.name,
						selection_type_id: group.selectionTypeId,
						multi_limit: group.multiLimit,
						category_filter_id: group.categoryFilterId,
						position: group.position,
					},
				}) // Add custom options if mode is custom
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

				// Add category items as options if mode is category
				if (group.mode === 'category' && group.categoryFilterId) {
					const categoryItems = await prisma.menuItem.findMany({
						where: { categoryId: group.categoryFilterId },
						orderBy: { position: 'asc' },
					})

					for (let i = 0; i < categoryItems.length; i++) {
						const item = categoryItems[i]
						await prisma.menu_item_variation_option_choices.create({
							data: {
								group_id: createdGroup.id,
								code: `item_${item.id}`,
								name: item.name,
								price_adjustment: item.basePrice,
								availability: item.availability,
								is_default: false,
								position: i,
							},
						})
					}
				}
			}
		}

		// Handle addons if provided
		if (addons !== undefined) {
			// Delete existing addons for this item
			await prisma.menu_item_addons.deleteMany({
				where: { menu_item_id: parseInt(id) },
			})

			// Create new addons
			for (const addon of addons) {
				await prisma.menu_item_addons.create({
					data: {
						menu_item_id: parseInt(id),
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

		res.json({
			success: true,
			message: 'Menu item updated successfully',
		})
	} catch (error) {
		console.error('Edit menu item error:', error)
		res.status(500).json({
			success: false,
			error: 'Internal server error while updating menu item',
		})
	}
}
