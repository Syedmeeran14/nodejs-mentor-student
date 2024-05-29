import express from 'express'
import mentorStudentRoutes from './mentorstudent.js'

const router = express.Router()

router.use('/mentorstudent',mentorStudentRoutes)


export default router