import mongoose from "mongoose"
import config from "../config/config.js"

async function connectDB() {
    try {
        await mongoose.connect(config.MONGO_URI)
        console.log("Mongodb has connected to the data base")
    } catch (error) {
        console.log("Error has been occured in connection database")
    }
}

export default connectDB