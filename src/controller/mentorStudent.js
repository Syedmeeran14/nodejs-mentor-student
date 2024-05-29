import mentorModel from '../models/mentor.js'
import studentModel from '../models/student.js'


// API to create Mentor
const createMentor = async(req,res) => {
    try {
        const mentor = await mentorModel.create(req.body)

        res.status(200).send({
            message: "Mentor created successfully",
            mentor
        })
    } catch(error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}


// API to create Student
const createStudent = async(req,res) => {
    try {
        const student = await studentModel.create(req.body)

        res.status(200).send({
            message: "Student created successfully",
            student
        })
    } catch(error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}


// API to assign Students to Mentor
const assignStudents = async(req,res) => {
    try {

        const mentor = await mentorModel.findById(req.params.mentorId)
        if (!mentor) {
        return res.status(404).send({ message: 'Mentor not found' })
        }

        const studentIds = req.body.studentIds
        if (!Array.isArray(studentIds)) {
        return res.status(400).send({ message: 'Invalid student IDs array' })
        }

        const students = await studentModel.find({ _id: { $in: studentIds }, mentor: null })
        if (!students.length) {
        return res.status(404).send({ message: 'No students found or already assigned to a mentor' })
        }
        
        if(studentIds.length === students.length) {

            students.forEach(s => {
                s.mentor = mentor._id

                if(!mentor.students.includes(s._id)) {
                    mentor.students.push(s._id)
                }
            })
    
            await Promise.all(students.map(s => s.save()))
            await mentor.save()
    
            res.status(200).send({
                message: "All the Students are assigned successfully"
            })
            return;
        }

        let temp = students.map(s => s._id.toString())

        const unmatched = studentIds.filter(i => !temp.includes(i))

        students.forEach(s => {
            s.mentor = mentor._id

            if(!mentor.students.includes(s._id)) {
                    mentor.students.push(s._id)
                }
        })

        await Promise.all(students.map( s => s.save()))
        await mentor.save()

        res.status(400).send({
            message: `Students with Ids ${unmatched} were already assigned to a mentor`
        })

    } catch(error) {
        console.log(error)
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}


// API to Assign or Change Mentor for a particular Student
const changeMentor = async(req,res) => {
    try {
        const student = await studentModel.findById(req.params.studentId)
        if(!student) {
            res.status(400).send({message: "Student not found"})
            return;
        }

        const mentor = await mentorModel.findById(req.body.mentorId)
        if(!mentor) {
            res.status(400).send({message: "Mentor not found"})
            return;
        }

        if(student.mentor?.toString() === mentor._id?.toString()){
            res.status(400).send({
                message: `Cannot change Mentor because ${mentor._id} is the current Mentor`
            })
            return;
        }
        
        // removing the student from the new mentor's students list before inserting
        let curr = mentor.students.findIndex(i => i.equals(student._id))
        if(curr >= 0) {
            mentor.students.splice(curr,1)
                await mentor.save()
        }

        //if the student exist in the students list of previous mentor remove him 
        if(student.mentor) {

            let oldId = student.previousMentor? student.previousMentor : undefined 
            student.previousMentor = student.mentor
            if(oldId) {
                const old = await mentorModel.findById(oldId)
                let del = old.students.findIndex(i => i.equals(student._id))
                if(del >= 0) {
                    old.students.splice(del,1)
                    await old.save()
                }
            }

            // removing the student from the current mentor's students list
            let rem = await mentorModel.findById(student.mentor)
            let remStd = rem.students.findIndex(i => i.equals(student._id))
            if(remStd >= 0) {
                rem.students.splice(remStd,1)
                    await rem.save()
            }

            // atlast inserting new mentor
            student.mentor = mentor._id
        }
        
        //Assigning Mentor for new Student
        if(!student.mentor){
            student.mentor = mentor._id
        }
        
        mentor.students.push(student._id)

        await student.save()
        await mentor.save()
        
        res.status(200).send({message: "Mentor change successfull",student})

    } catch(error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}


// API to show all the Students for a particular Mentor
const mentorStudents = async(req,res) => {
    try {
        const mentor = await mentorModel.findById(req.params.mentorId).populate('students')
        if(!mentor) {
            return res.status(400).send({
                message: "Mentor not found"
            })
        }

        if(!mentor.students.length) {
            return res.status(200).send({
                message: "This Mentor has no Students"
            })
        }

        res.status(200).send({
            students: mentor.students
        })

    } catch(error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}


// API endpoint to show Previously assigned mentor for a particular student
const previousMentor = async(req,res) => {
    try {
        let student = await studentModel.findById(req.params.studentId).populate('previousMentor',{students: 0})

        if(!student) {
            return res.status(400).send({
                message: "Student not found"
            })
        }
        
        if(!student.previousMentor) {
            return res.status(400).send({
                message: "Student has no previous Mentor"
            })
        }

        res.status(200).send({
            previousMentor: student.previousMentor
        })

    } catch(error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}


// API to get all the Mentors
const mentors = async(req,res) => {
    try {
        const mentors = await mentorModel.find()

        res.status(200).send({
            message: "Mentors fetched successfully",
            mentors
        })
    } catch(error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}


// API to get all the Students
const students = async(req,res) => {
    try {
        const students = await studentModel.find()

        res.status(200).send({
            message: "Students fetched successfully",
            students
        })
    } catch(error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}


export default {
    createMentor,
    createStudent,
    assignStudents,
    changeMentor,
    mentorStudents,
    previousMentor,
    mentors,
    students
}