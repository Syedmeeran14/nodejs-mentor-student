import express from 'express'
import mentorStudentController from '../controller/mentorStudent.js'

const router = express.Router()

router.post('/createMentor',mentorStudentController.createMentor)
router.post('/createStudent',mentorStudentController.createStudent)
router.put('/assignStudents/:mentorId',mentorStudentController.assignStudents)
router.put('/assignMentor/:studentId',mentorStudentController.changeMentor)
router.get('/students/:mentorId',mentorStudentController.mentorStudents)
router.get('/previousMentor/:studentId',mentorStudentController.previousMentor)
router.get('/getAllMentors',mentorStudentController.mentors)
router.get('/getAllStudents',mentorStudentController.students)


export default router