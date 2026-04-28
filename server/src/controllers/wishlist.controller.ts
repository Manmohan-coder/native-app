import { Request, Response } from "express";
import wishlistModel from "../models/wishlist.model.js";

// ➕ Add product to wishlist
export const addToWishlist = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id; // assuming auth middleware
        const { productId } = req.body;

        let wishlist = await wishlistModel.findOne({ user: userId });

        if (!wishlist) {
            wishlist = await wishlistModel.create({
                user: userId,
                products: [productId],
            });
        } else {
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
                await wishlist.save();
            }
        }

        res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            wishlist,
        });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

// ❌ Remove product
export const removeFromWishlist = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const wishlist = await wishlistModel.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        wishlist.products = wishlist.products.filter(
            (id) => id.toString() !== productId
        );

        await wishlist.save();

        res.status(200).json({
            success: true,
            message: "Product removed",
            wishlist,
        });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

// 📦 Get wishlist
export const getWishlist = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        const wishlist = await wishlistModel.findOne({ user: userId })
            .populate("products");

        res.status(200).json({
            success: true,
            wishlist,
        });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};