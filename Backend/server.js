import express from "express"
import connectDB from "./db/ConnectDb.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"


import { interviewRouter } from "./routes/interview.routes.js"


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
const PORT = process.env.PORT || 5000

// auth routes
app.use("/api/auth", authRouter)

// interview router
app.use("/api/interview", interviewRouter)

app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log("You are connected on Port", PORT);

    } catch (error) {
        console.error("ERROR:");
        console.error(error);

    }
})

