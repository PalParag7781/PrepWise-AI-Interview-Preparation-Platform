import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: (true, "username already taken")
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: (true, "email already exits")
    }
},
    { timestamps: true })

const userModel = mongoose.model("Users", userSchema)

export default userModel
