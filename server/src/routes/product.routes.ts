import express from "express"
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/product.controller.js"
import upload from "../middleware/upload.js"
import { authorize, protect } from "../middleware/auth.js"

const ProductRouter = express.Router()

// get all products
ProductRouter.get('/', getProducts)
ProductRouter.get('/:id', getProduct)
ProductRouter.post('/', protect, authorize('admin'), upload.array('images', 5), createProduct)
ProductRouter.put('/:id', protect, authorize('admin'), upload.array('images', 5), updateProduct)
ProductRouter.delete('/:id', protect, authorize('admin'), deleteProduct)

export default ProductRouter