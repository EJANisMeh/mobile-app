import express from 'express'
import { getConcession, updateConcession } from '../backend/concession'

const router = express.Router()

// Get concession by ID
router.get('/:concessionId', getConcession)

// Update concession
router.put('/:concessionId', updateConcession)

export default router
