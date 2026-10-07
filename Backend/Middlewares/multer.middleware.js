import express from "express"
import multer from "multer"

const app = express()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    },

})

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 //max-size is 5mb
    }
})

