import express from 'express'
import {
	getConcession,
	updateConcession,
	toggleConcessionStatus,
} from '../backend/concession'

const router = express.Router()

// Get concession by ID
router.get('/:concessionId', getConcession)

// Update concession
router.put('/:concessionId', updateConcession)

// Toggle concession status
router.patch('/:concessionId/toggle-status', toggleConcessionStatus)

export default router
