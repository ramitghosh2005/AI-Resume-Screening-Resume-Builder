const mongoose = require("mongoose");

//creating schema
const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required : true
    },
    name:{
        type: String,
        required: true

    },
    role:{
        type: String,
        default: "user"
    },
    photoUrl:{
        type: String
    }
},{timestamps:true});

const userModel = mongoose.model("user",UserSchema);

module.exports = userModel