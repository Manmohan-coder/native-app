import express from 'express'
import { protect } from '../middleware/auth.js'
import { addAddress, getAddress, removeAddress, updateAddress } from '../controllers/address.controller.js'

const AddressRouter = express.Router()
// get address
AddressRouter.get('/',protect,getAddress)
// create address
AddressRouter.post('/',protect,addAddress)
// update address
AddressRouter.put('/:id',protect,updateAddress)
// delete address
AddressRouter.delete('/:id',protect,removeAddress)

export default AddressRouter;