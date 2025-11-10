import express from 'express'
import {
	addItem,
	editItem,
	deleteItem,
	getItem,
	getItemById,
	getSelectionTypes,
	toggleVariationOptionAvailability,
	validatePriceAdjustment,
} from '../backend/menu'

const router = express.Router()

// Get menu items
router.get('/get', getItem)

// Get single menu item by ID
router.get('/get/:itemId', getItemById)

// Get selection types
router.get('/selection-types', getSelectionTypes)

// Add menu item
router.post('/add', addItem)

// Edit menu item
router.put('/edit/:id', editItem)

// Delete menu item
router.delete('/delete/:id', deleteItem)

// Toggle variation option availability
router.put(
	'/variation-option/:optionId/availability',
	toggleVariationOptionAvailability
)

// Validate price adjustment
router.post('/validate-price-adjustment', validatePriceAdjustment)

export default router
