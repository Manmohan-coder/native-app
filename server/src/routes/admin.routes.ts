import express from 'express'
import { authorize, protect } from '../middleware/auth.js'
import { getDashboardStats } from '../controllers/admin.controller.js'

const AdminRouter = express.Router()

AdminRouter.get('/', protect, authorize('admin'), getDashboardStats)

export default AdminRouter