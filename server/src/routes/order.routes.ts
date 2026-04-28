import express from 'express'
import { authorize, protect } from '../middleware/auth.js'
import { createOrder, getAllOrders, getOrder, getSingleOrder, updateOrderStatus } from '../controllers/order.controller.js'

const OrderRouter = express.Router()

// get user orders
OrderRouter.get('/', protect, getOrder)
// get single order
OrderRouter.get('/:id', protect, getSingleOrder)
// create order
OrderRouter.post('/', protect, createOrder)

OrderRouter.put('/:id/status', protect, authorize('admin'), updateOrderStatus)

OrderRouter.get('/admin/all', protect,authorize('admin'), getAllOrders)

export default OrderRouter