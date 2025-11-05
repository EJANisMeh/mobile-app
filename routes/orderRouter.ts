import express from 'express'
import {
	createOrder,
	getOrdersByCustomer,
	getOrdersByConcession,
	getOrderDetails,
	updateOrderStatus,
	updatePaymentProof,
	cancelOrder,
} from '../backend/order'

const router = express.Router()

router.post('/create', createOrder)
router.get('/customer/:customerId', getOrdersByCustomer)
router.get('/concession/:concessionId', getOrdersByConcession)
router.get('/:orderId', getOrderDetails)
router.put('/status/:orderId', updateOrderStatus)
router.put('/payment-proof/:orderId', updatePaymentProof)
router.put('/cancel/:orderId', cancelOrder)

export default router
