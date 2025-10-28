import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Add menu item endpoint with full support for images, variations, and add-ons
export const addItem = async (req: express.Request, res: express.Response) => {
	try {
		const {
			concessionId,
			name,
			description,
			basePrice,
			images,
			displayImageIndex,
			categoryId,
			availability,
			variationGroups,
			addons,
		} = req.body

		// Validate required fields: concessionId, name, category
		if (!concessionId || !name || !categoryId) {
			return res.status(400).json({
				success: false,
				error: 'Concession ID, name, and category are required',
			})
		}

		// Parse base price if provided, otherwise default to 0
		const parsedPrice =
			basePrice !== undefined && basePrice !== null && basePrice !== ''
				? parseFloat(basePrice)
				: 0
		if (isNaN(parsedPrice) || parsedPrice < 0) {
			return res.status(400).json({
				success: false,
				error: 'Invalid base price',
			})
		}

		// Validate images array
		const imageArray = Array.isArray(images) ? images : []
		if (imageArray.length > 3) {
			return res.status(400).json({
				success: false,
				error: 'Maximum 3 images allowed',
			})
		}

		// Validate display image index
		const displayIndex =
			typeof displayImageIndex === 'number' ? displayImageIndex : 0
		if (
			imageArray.length > 0 &&
			(displayIndex < 0 || displayIndex >= imageArray.length)
		) {
			return res.status(400).json({
				success: false,
				error: 'Invalid display image index',
			})
		}

		// Create menu item with all related data in a transaction
		const menuItem = await prisma.$transaction(async (tx) => {
			// 1. Create the base menu item
			const newItem = await tx.menuItem.create({
				data: {
					name: name.trim(),
					description: description?.trim() || null,
					basePrice: parsedPrice,
					images: imageArray,
					display_image_index: displayIndex,
					categoryId: categoryId,
					concessionId: concessionId,
					availability: availability !== undefined ? availability : true,
					position: 0, // You can implement custom positioning later
				},
			})

			// 2. Create variation groups if provided
			if (
				variationGroups &&
				Array.isArray(variationGroups) &&
				variationGroups.length > 0
			) {
				for (const group of variationGroups) {
					// Validate group data
					if (!group.name || !group.selectionTypeId) {
						continue // Skip invalid groups
					}

					// Determine kind based on mode
					let kind = 'group'
					if (group.mode === 'custom') {
						kind = 'group'
					} else if (group.mode === 'category') {
						kind = 'category_filter'
					} else if (group.mode === 'existing') {
						kind = 'existing_items'
					}

					// Create variation group
					const createdGroup = await tx.menu_item_variation_groups.create({
						data: {
							menu_item_id: newItem.id,
							kind: kind,
							name: group.name.trim(),
							selection_type_id: group.selectionTypeId,
							multi_limit: group.multiLimit || null,
							category_filter_id: group.categoryFilterId || null,
							position: group.position || 0,
						},
					})

					// 3. Create variation options for custom mode
					if (
						group.mode === 'custom' &&
						group.options &&
						Array.isArray(group.options)
					) {
						for (const option of group.options) {
							if (!option.name) continue // Skip invalid options

							const priceAdj = parseFloat(option.priceAdjustment || '0')
							if (isNaN(priceAdj)) continue

							await tx.menu_item_variation_option_choices.create({
								data: {
									group_id: createdGroup.id,
									name: option.name.trim(),
									price_adjustment: priceAdj,
									is_default: option.isDefault || false,
									position: option.position || 0,
									availability:
										option.availability !== undefined
											? option.availability
											: true,
								},
							})
						}
					}

					// Handle existing items mode: create option entries using selected menu items names
					if (
						group.mode === 'existing' &&
						(group as any).existingMenuItemIds &&
						Array.isArray((group as any).existingMenuItemIds)
					) {
						const ids = (group as any).existingMenuItemIds as number[]
						if (ids.length > 0) {
							// fetch menu items
							const referenced = await tx.menuItem.findMany({
								where: { id: { in: ids } },
							})
							for (const ref of referenced) {
								await tx.menu_item_variation_option_choices.create({
									data: {
										group_id: createdGroup.id,
										name: ref.name,
										price_adjustment: 0,
										is_default: false,
										position: 0,
										availability: true,
									},
								})
							}
						}
					}
				}
			}

			// 4. Create add-ons if provided
			if (addons && Array.isArray(addons) && addons.length > 0) {
				for (const addon of addons) {
					if (!addon.menuItemId) continue // Skip invalid add-ons

					const priceOverride = addon.priceOverride
						? parseFloat(addon.priceOverride)
						: null

					await tx.menu_item_addons.create({
						data: {
							menu_item_id: newItem.id,
							target_menu_item_id: addon.menuItemId,
							label: addon.label || null,
							price_override: priceOverride,
							required: addon.required || false,
							position: addon.position || 0,
						},
					})
				}
			}

			// Return the complete menu item with relations
			return await tx.menuItem.findUnique({
				where: { id: newItem.id },
				include: {
					category: true,
					menu_item_variation_groups: {
						include: {
							menu_item_variation_option_choices: true,
						},
					},
					menu_item_addons_menu_item_addons_menu_item_idTomenu_items: {
						include: {
							menu_items_menu_item_addons_target_menu_item_idTomenu_items: true,
						},
					},
				},
			})
		})

		res.status(201).json({
			success: true,
			menuItem: menuItem,
			message: 'Menu item added successfully',
		})
	} catch (error) {
		console.error('Add menu item error:', error)
		res.status(500).json({
			success: false,
			error: error instanceof Error ? error.message : 'Internal server error',
		})
	}
}
