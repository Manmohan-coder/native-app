import express from 'express'
import { getWishlist } from '../controllers/wishlist.controller.js'

const WishlistRouter = express.Router()

// get wishlist
WishlistRouter.get('/',getWishlist)
WishlistRouter.post('/',getWishlist)
WishlistRouter.delete('/:productId',getWishlist)

export default WishlistRouter