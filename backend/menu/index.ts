import express from 'express'
import { addItem } from './addItem'
import { editItem } from './editItem'
import { deleteItem } from './deleteItem'
import { searchItem } from './searchItem'

const router = express.Router()

// Add menu item
router.post('/add', addItem)

// Edit menu item
router.put('/edit/:id', editItem)

// Delete menu item
router.delete('/delete/:id', deleteItem)

// Search menu items
router.get('/search', searchItem)

export default router
