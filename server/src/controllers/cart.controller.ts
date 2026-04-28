import { Request, Response } from "express";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

// get cart
export const getCart = async (req: Request, res: Response) => {
    try {
        let cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product", "name images price stock")

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] })
        }
        res.json({ success: true, data: cart })
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// add to cart product
export const addToCart = async (req: Request, res: Response) => {
    try {
        const { productId, quantity = 1, size } = req.body;
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ success: false, message: "Product Not Found" })
        }
        if (product.stock < quantity) {
            return res.status(400).json({ success: false, message: "Insufficient Stock" })
        }
        let cart = await Cart.findOne({ user: req.user._id })

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] })
        }

        const existingItem = cart.items.find((item) => {
            return item.product.toString() === productId && item.size === size
        })

        if (existingItem) {
            existingItem.quantity += quantity
            existingItem.price
        } else {
            cart.items.push({
                product: productId,
                quantity,
                price: product.price,
                size
            })
        }
        cart.calculateTotal()
        await cart.save()

        await cart.populate('items.product', 'name images price stock')
        res.json({ success: true, data: cart })

        res.json({ success: true, })
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// update cart 
export const updateCartItem = async (req: Request, res: Response) => {
    try {
        const { quantity, size } = req.body;
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id })
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not Found" })
        }
        const item = cart.items.find(
            (item) => item.product.toString() === productId && item.size === size
        )

        if (!item) {
            return res.status(404).json({ success: false, message: "Cart not Found" })
        }

        if (quantity <= 0) {
            cart.items = cart.items.filter((item) => item.product.toString() !== productId)
        } else {
            const product = await Product.findById(productId)
            if (product!.stock < quantity) {
                return res.status(400).json({ success: false, message: 'Insufficent Stock' })
            }
            item.quantity = quantity
        }
        cart.calculateTotal()
        await cart.save()
        await cart.populate('items.product', 'name images price stock')
        res.json({ success: true, data: cart })

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// delete cart
export const removeCartItem = async (req: Request, res: Response) => {
    try {
        const { size } = req.query;
        const cart = await Cart.findOne({ user: req.user._id })
        if (!cart || !size) {
            return res.status(404).json({ success: false, message: "Cart Not Found" })
        }
        cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId || item.size !== size)

        cart.calculateTotal()
        await cart.save()

        await cart.populate('items.product', 'name images price stock')

        res.json({ success: true, data: cart })
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// clear cart
export const clearCartItem = async (req: Request, res: Response) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
        if (cart) {
            cart.items = []
            cart.totalAmount = 0
            await cart.save()
        }
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message })
    }
}