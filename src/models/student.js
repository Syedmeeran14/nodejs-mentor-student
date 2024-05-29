import mongoose from "./index.js"

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"name is Required"]
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mentor'
    },
    previousMentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mentor'
    }
},{
    collection: 'student',
    versionKey: false
})

const studentModel = mongoose.model('student',studentSchema)


export default studentModel