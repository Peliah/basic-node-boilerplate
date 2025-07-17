import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import Token from '@/models/token';
import type { Request, Response, NextFunction } from "express";
import type { Types } from "mongoose";

/**
 * @function authenticate
 * @description Middleware to verify the user's access token from the Auhorization header
 *              if the token is valid, then the user's ID is attached to the request object,
 *              Otherwise, it returns an appropriate error response
 * 
 * @param {Request} req - Express request object. Expects a bearer token in the Authorization header
 * @param {Response} res - Express response object used to send error response if authenticatin fails
 * @param {NextFunction} next - Express next function to pass controll to the next middleware
 * 
 * @returns {void}
 */

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization
    console.log(authHeader);
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({
            code: "AuthenticationError",
            message: "Access denied, no token provided"
        })
        return;
    }
    const [_, token] = authHeader.split(' ');
    try {
        const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };
        req.userId = jwtPayload.userId;
        return next();
    } catch (error) {
        // Handle expired token
        if (error instanceof TokenExpiredError) {
            res.status(401).json({
                code: "AuthenticationError",
                message: "Access denied, expired token"
            })
            return;
        }
        if (error instanceof JsonWebTokenError) {
            res.status(401).json({
                code: "AuthenticationError",
                message: "Access denied, invalid token"
            })
            return;
        }

        res.status(500).json({
            code: "ServerError",
            message: "Internal Server Error",
            error: error
        })
        logger.error('Error during authentication ', error)
    }
}

export default authenticate;