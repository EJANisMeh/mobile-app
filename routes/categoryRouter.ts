import express from 'express'
import { getCategories, updateCategories } from '../backend/category'

const router = express.Router()

// GET /category/get - Get all categories for a concession
router.get('/get', getCategories)

// PUT /category/update - Update categories (batch update)
router.put('/update', updateCategories)

export default router
