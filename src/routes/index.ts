import authRoutes from './user.routes'
import { Router } from 'express'

const router = Router()

router.use('/users', authRoutes)

export default router