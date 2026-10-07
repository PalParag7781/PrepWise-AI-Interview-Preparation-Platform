import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import config from "../config/config.js"
import blackListingTokenModel from "../models/blacklistingToken.model.js"

export const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body

        // Validate input
        if (!userName || !email || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            })
        }

        const existingUser = await userModel.findOne({
            $or: [{ userName }, { email }],
        })

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            })
        }

        const hashed_password = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            userName,
            password: hashed_password,
            email,
        })

        // Refresh Token
        const refreshToken = await jwt.sign({ userId: user._id }, config.JWT_SECRET, {
            expiresIn: "7d",
        })

        // Refresh Token Hash
        const refreshTokenHash = await crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex")

        // Access Token
        const accessToken = await jwt.sign({ userId: user._id }, config.JWT_SECRET, {
            expiresIn: "15m",
        })

        await userModel.updateOne(
            { _id: user._id },
            { $set: { refreshTokenHash } }
        )

        const safeUser = {
            _id: user._id,
            userName: user.userName,
            email: user.email,
        }

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: safeUser,
            accessToken,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            })
        }

        const existingUser = await userModel.findOne({ email })

        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message:
                    "No account exists with this email or the password is incorrect",
            })
        }

        const valid_password = await bcrypt.compare(
            password,
            existingUser.password
        )

        if (!valid_password) {
            return res.status(401).json({
                success: false,
                message:
                    "No account exists with this email or the password is incorrect",
            })
        }

        // Refresh Token
        const refreshToken = await jwt.sign(
            { userId: existingUser._id },
            config.JWT_SECRET,
            { expiresIn: "7d" }
        )

        // Refresh Token Hash
        const refreshTokenHash = await crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex")

        // Access Token
        const accessToken = await jwt.sign(
            { userId: existingUser._id },
            config.JWT_SECRET,
            { expiresIn: "15m" }
        )

        await userModel.updateOne(
            { _id: existingUser._id },
            { $set: { refreshTokenHash } }
        )

        const safeUser = {
            _id: existingUser._id,
            userName: existingUser.userName,
            email: existingUser.email,
        }

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            success: true,
            message: `Welcome back ${existingUser.userName}`,
            accessToken,
            user: safeUser,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

export const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken

        if (token) {
            await blackListingTokenModel.create({ token })
        }

        return res.clearCookie("refreshToken").status(200).json({
            success: true,
            message: "Logged out successfully",
        })
    } catch (error) {
        console.error("Error encountered while logging out:", error)
        return res.status(500).json({
            success: false,
            message: "Error while logging out",
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const userId = req.id
        const user = await userModel.findById(userId).select("-password")

        if (!user) {
            return res.status(404).json({
                message: "No such user exists",
                success: false,
            })
        }

        return res.status(200).json({
            success: true,
            user,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

