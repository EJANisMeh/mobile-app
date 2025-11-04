import express from 'express'
import {
	createOrder,
	getOrdersByCustomer,
	getOrdersByConcession,
	updateOrderStatus,
} from '../backend/order'

const router = express.Router()

router.post('/create', createOrder)
router.get('/customer/:customerId', getOrdersByCustomer)
router.get('/concession/:concessionId', getOrdersByConcession)
router.put('/status/:orderId', updateOrderStatus)

export default router
