import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';

const JWT_TOKEN = "your_jwt_secret_token";

export default async function authMiddleware(req, res, next) {
    // grab token
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized or token missing "
        });
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, JWT_TOKEN);
        const user = await userModel.findById(payload.id).select('-password');
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User not found by the id"
            })
        }

        req.user = user;
        next()
    } catch (error) {
        console.error("JWT verification faile: ", error);
        return res.status(401).json({
            success: false,
            message: "Token is invalid or expired"
        })
    }
}