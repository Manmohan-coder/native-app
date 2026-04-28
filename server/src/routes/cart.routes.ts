import express from 'express'
import { protect } from '../middleware/auth.js'
import { addToCart, clearCartItem, getCart, removeCartItem, updateCartItem } from '../controllers/cart.controller.js'

const CartRouter = express.Router()

// get user cart
CartRouter.get('/', protect, getCart)
// add item to cart
CartRouter.post('/add', protect, addToCart)
// update item to cart
CartRouter.put('/item/:productId', protect, updateCartItem)
// delete item in cart
CartRouter.delete('/item/:productId', protect, removeCartItem)
// clear cart 
CartRouter.delete('/', protect, clearCartItem)

export default CartRouter;