import express from 'express'
import { addItem } from './addItem'
import { editItem } from './editItem'
import { deleteItem } from './deleteItem'
import { getItem } from './getItem'
import { getSelectionTypes } from './getSelectionTypes'

const router = express.Router()

// Get menu items
router.get('/get', getItem)

// Get selection types
router.get('/selection-types', getSelectionTypes)

// Add menu item
router.post('/add', addItem)

// Edit menu item
router.put('/edit/:id', editItem)

// Delete menu item
router.delete('/delete/:id', deleteItem)

export default router
