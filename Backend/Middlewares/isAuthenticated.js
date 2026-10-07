import jwt from "jsonwebtoken"
import config from "../config/config.js";
import blackListingTokenModel from "../models/blacklistingToken.model.js";

/**
 * @desc    Middleware to verify JWT Access Token and check token blacklisting
 */
export const isAuthenticated = async (req, res, next) => {

    try {
        const token = req.headers.authorization?.split(" ")[1]

        if (!token) {
            return res.status(401).json({ message: "Access token not found" });
        }

        const isBlackListed = await blackListingTokenModel.findOne({ token })

        if (isBlackListed) {
            return res.status(401).json({
                message: "Token is invalid",

            })
        }

        const decoded = jwt.verify(token, config.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        req.id = decoded.userId
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Token is invalid or expired",
            success: false,
        });
    }
}