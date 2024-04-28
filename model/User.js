import mongoose from "mongoose";

const user = mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});


const users=mongoose.model("User",user);

export default users;