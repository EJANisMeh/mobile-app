import express from 'express'
import { getCafeteriasWithMenuItems } from '../backend/customer'

const router = express.Router()

// GET /api/customer/cafeterias-with-menu
router.get('/cafeterias-with-menu', getCafeteriasWithMenuItems)

export default router
