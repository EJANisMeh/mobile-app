import express from 'express'
import { createOrder } from './createOrder'
import { getOrdersByCustomer } from './getOrdersByCustomer'
import { getOrdersByConcession } from './getOrdersByConcession'
import { updateOrderStatus } from './updateOrderStatus'

const router = express.Router()

// Create new order
router.post('/create', createOrder)

// Get orders by customer
router.get('/customer/:customerId', getOrdersByCustomer)

// Get orders by concession
router.get('/concession/:concessionId', getOrdersByConcession)

// Update order status
router.put('/status/:orderId', updateOrderStatus)

export default router
