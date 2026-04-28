import { Request, Response } from "express";
import AddressModel from "../models/Address.model.js";

// get address
export const getAddress = async (req: Request, res: Response) => {
    try {
        const addresses = await AddressModel.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 })

        res.json({ success: true, data: addresses })
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// add new address
export const addAddress = async (req: Request, res: Response) => {
    try {
        const { type, street, city, state, zipCode, country, isDefault } = req.body;
        if (isDefault) {
            await AddressModel.updateMany({ user: req.user._id }, { isDefault: false })
        }
        const newAddress = await AddressModel.create({ user: req.user._id, type, street, city, state, zipCode, country, isDefault: isDefault || false })

        res.status(201).json({ success: true, data: newAddress })
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// update address
export const updateAddress = async (req: Request, res: Response) => {
    try {
        const { type, street, city, state, zipCode, country, isDefault } = req.body;
        let addressItem = await AddressModel.findById(req.params.id)
        if (!addressItem) {
            return res.status(404).json({ success: false, message: 'Address Not Found' })
        }
        // user owns address
        if (addressItem.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not Authorized' })
        }
        if (isDefault) {
            await AddressModel.updateMany({ user: req.user._id }, { isDefault: false })
        }
        addressItem = await AddressModel.findByIdAndUpdate(req.params.id,
            { type, street, city, state, zipCode, country, isDefault: isDefault || false }, { new: true })

        res.status(201).json({ success: true, data: addressItem })
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// delete address 
export const removeAddress = async (req: Request, res: Response) => {
    try {
        let address = await AddressModel.findById(req.params.id)

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address Not Found' })
        }
        // user owns address
        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not Authorized' })
        }

        await AddressModel.deleteOne(address)

        res.status(201).json({ success: true, message: "Address Removed" })
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message })
    }
}