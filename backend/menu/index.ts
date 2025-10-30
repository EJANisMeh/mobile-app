import express from 'express'
import { addItem } from './addItem'
import { editItem } from './editItem'
import { deleteItem } from './deleteItem'
import { getItem } from './getItem'
import { getItemById } from './getItemById'
import { getSelectionTypes } from './getSelectionTypes'
import { toggleVariationOptionAvailability } from './toggleVariationOptionAvailability'

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

export default router
