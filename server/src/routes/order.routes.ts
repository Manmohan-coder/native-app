import express from 'express'
import { authorize, protect } from '../middleware/auth.js'
import { createOrder, getAllOrders, getOrder, getSingleOrder, updateOrderStatus } from '../controllers/order.controller.js'

const OrderRouter = express.Router()

// get user orders
OrderRouter.get('/', protect, getOrder)
// all for admin
OrderRouter.get('/admin/all', protect,authorize('admin'), getAllOrders)
// get single order
OrderRouter.get('/:id', protect, getSingleOrder)
// create order
OrderRouter.post('/', protect, createOrder)
// update order by admin
OrderRouter.put('/:id/status', protect, authorize('admin'), updateOrderStatus)

export default OrderRouter