const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", //same name passed in user.js file while creating model
        required: true
    },
    resume_name:{
        type: String,
        required: true
    },
    job_desc:{
        type: String,
        required: true
    },
    score:{
        type: Number,
        default: 0
    },
    reason:{
        type: String,
        default: "No feedback yet"
    }   
},{timestamps:true});

const resumeModel = mongoose.model("resume", resumeSchema);
module.exports = resumeModel;