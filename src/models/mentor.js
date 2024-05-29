import mongoose from './index.js'

const mentorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Mentor name is necessary"]
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    }]
},{
    collection: 'mentor',
    versionKey: false
})

const mentorModel = mongoose.model('mentor',mentorSchema)


export default mentorModel
