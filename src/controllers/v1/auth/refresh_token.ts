import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import Token from '@/models/token';
import type { Request, Response } from "express";
import { Types } from "mongoose";

const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken as string;

    try {
        const tokenExists = await Token.exists({ token: refreshToken });
        if (!tokenExists) {
            res.status(401).json({
                code: "AuthorizationError",
                message: "Invalid refresh token"
            });
            return;
        }

        // Verify refresh tokens
        const jwtPayload = verifyRefreshToken(refreshToken) as { userId: Types.ObjectId, role: 'admin' | 'user' };
        const accessToken = generateAccessToken(jwtPayload.userId, jwtPayload.role);

        res.status(200).json({ accessToken });

    } catch (error) {
        if (error instanceof TokenExpiredError) {
            res.status(401).json({
                code: "AuthenticationError",
                message: "Refresh token expired, please login again"
            });
            return;
        }

        if (error instanceof JsonWebTokenError) {
            res.status(401).json({
                code: "AuthenticationError",
                message: "Invalid refresh token"
            });
            return;
        }

        res.status(500).json({
            code: "InternalServerError",
            message: "Internal Server Error",
            error: error
        })
        logger.error("An error occurred while refreshing the token.")
    }
}

export default refreshToken;