import { Request, Response } from "express";
import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments()
        const totalProducts = await Product.countDocuments()
        const totalOrders = await Order.countDocuments()
        const validOrders = await Order.find({ orderStatus: { $ne: 'cancelled' } })
        const totalRevenue = validOrders.reduce(
            (sum, order) => sum + order.totalAmount, 0)
        const recentOrders = await Order.find().sort('-createdAt').limit(5).populate('user', 'name email')

        res.json({
            success: true, data: { totalUsers, totalProducts, totalOrders, totalRevenue, recentOrders }
        })

    } catch (err) {

    }
}