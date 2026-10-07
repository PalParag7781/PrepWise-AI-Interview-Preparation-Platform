import express from "express"
import { Router } from "express"
import * as userController from "../controllers/user.controller.js"
import { isAuthenticated } from "../Middlewares/isAuthenticated.js"
import { upload } from "../Middlewares/multer.middleware.js"

const authRouter = Router()

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
authRouter.post("/register", userController.register)

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get tokens
 */
authRouter.post("/login", userController.login)

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and invalidate token
 */
authRouter.post("/logout", isAuthenticated, userController.logout)

/**
 * @route   GET /api/auth/getMe
 * @desc    Get currently logged-in user profile
 */
authRouter.get("/getMe", isAuthenticated, userController.getMe)

export default authRouter