import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Get cafeterias with concessions and their menu items (limited to 5 per concession)
 * For customer menu screen default view
 */
export const getCafeteriasWithMenuItems = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		// Fetch all cafeterias with their concessions (both open and closed)
		const cafeterias = await prisma.cafeteria.findMany({
			include: {
				concessions: {
					include: {
						menuItems: {
							where: {
								availability: true, // Only show available items
							},
							orderBy: {
								position: 'asc',
							},
							take: 5, // Limit to 5 items per concession
							include: {
								category: true,
							},
						},
					},
					orderBy: [
						{
							is_open: 'desc', // Open concessions first
						},
						{
							name: 'asc',
						},
					],
				},
			},
			orderBy: {
				name: 'asc',
			},
		})

		// Transform data to match frontend expectations (camelCase)
		const transformedCafeterias = cafeterias.map((cafeteria) => ({
			...cafeteria,
			concessions: cafeteria.concessions.map((concession) => ({
				...concession,
				menuItems: concession.menuItems.map((item) => ({
					id: item.id,
					name: item.name,
					basePrice: Number(item.basePrice), // Convert Decimal to number
					images: item.images,
					availability: item.availability,
					displayImageIndex: item.display_image_index,
					category: item.category,
				})),
			})),
		}))

		// Return all cafeterias (even those with no concessions)
		res.status(200).json({
			success: true,
			cafeterias: transformedCafeterias,
		})
	} catch (error) {
		console.error('Get cafeterias with menu items error:', error)
		res.status(500).json({
			success: false,
			error: error instanceof Error ? error.message : 'Internal server error',
		})
	}
}
