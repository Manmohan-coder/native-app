import { Request, Response } from "express";
import Product from "../models/Product.model.js";
import cloudinary from "../config/cloudinary.js";

// get all products
export const getProducts = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query
        const query: any = { isActive: true }
        const total = await Product.countDocuments(query)
        const products = await Product.find(query).skip((Number(page) - 1) * Number(limit)).limit(Number(limit))

        res.json({
            success: true,
            data: products,
            pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) }
        })
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// get single product
export const getProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }

        res.json({
            success: true,
            data: product,

        })
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// create new product
export const createProduct = async (req: Request, res: Response) => {
    try {
        let images = []
        if (req.files && (req.files as any).length > 0) {
            const uploadPromise = (req.files as any).map((file: any) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({
                        folder: 'ecom-app/products'
                    }, (err, result) => {
                        if (err) reject(err)
                        else resolve(result!.secure_url)
                    })
                    uploadStream.end(file.buffer)
                })
            })
            images = await Promise.all(uploadPromise)
        }
        let sizes = req.body.sizes || []
        if (typeof sizes === 'string') {
            try {
                sizes = JSON.parse(sizes)
            } catch (e) {
                sizes = sizes.split(',').map((s: string) => s.trim()).filter((s: string) => s !== "")
            }
        }

        if (!Array.isArray(sizes)) sizes = [sizes]
        const productData = {
            ...req.body,
            images: images,
            sizes: sizes
        }
        if (images.length === 0) {
            return res.status(400).json({ success: false, message: "upload at least one image" })
        }
        const product = await Product.create(productData)
        res.status(201).json({ success: true, data: product })
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// update product 
export const updateProduct = async (req: Request, res: Response) => {
    try {
        let images: string[] = []
        if (req.body.existingImages) {
            images = Array.isArray(req.body.existingImages)
                ? [...req.body.existingImages]
                : [req.body.existingImages]
        }
        // handle file upload
        if (req.files && (req.files as any).length > 0) {
            const uploadPromise = (req.files as any).map((file: any) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({
                        folder: 'ecom-app/products'
                    }, (err, result) => {
                        if (err) reject(err)
                        else resolve(result!.secure_url)
                    })
                    uploadStream.end(file.buffer)
                })
            })
            const newImages = await Promise.all(uploadPromise)
            images = [...images, ...newImages]
        }
        const updates = { ...req.body }

        if (req.body.sizes) {
            let sizes = req.body.sizes;
            if (typeof sizes === 'string') {
                try {
                    sizes = JSON.parse(sizes)
                } catch (e) {
                    sizes = sizes.split(',').map((s: string) => s.trim()).filter((s: string) => s !== "")
                }
            }
            if (!Array.isArray(sizes)) sizes = [sizes]
            updates.sizes = sizes
        }
        if (req.body.existingImages || (req.files && (req.files as any).length > 0)) {
            updates.images = images;
        }
        delete updates.existingImages

        const product = await Product.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        })
        if (!product) {
            return res.status(404).json({ success: false, message: "product not found" })
        }

        res.json({ success: true, data: product })
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// delete product
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }
        // delete images from cloudinary
        if (product?.images && product.images.length > 0) {
            const deletePromise = product.images.map((imagesUrl) => {
                const publicIdMatch = imagesUrl.match(/\/v\d+\/(.+)\.[a-z0-9]+$/)
                const publicId = publicIdMatch ? publicIdMatch[1] : null;
                if (publicId) {
                    return cloudinary.uploader.destroy(publicId)
                }
                return Promise.resolve()
            })
            await Promise.all(deletePromise)
        }
        await Product.findByIdAndDelete(req.params.id)

        res.json({ success: true, message: "Product Deleted!" })
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message })
    }
}