import jwt from "jsonwebtoken";
import config from "@/config";

import { Types } from "mongoose";

export const generateAccessToken = (userId: Types.ObjectId): string => {
    if (!config.JWT_ACCESS_SECRET) {
        throw new Error("JWT_ACCESS_SECRET is not defined in the environment variables");
    }

    return jwt.sign({ userId }, config.JWT_ACCESS_SECRET, { expiresIn: config.ACCESS_TOKEN_EXPIRY, subject: "accessApi" });
};

export const generateRefreshToken = (userId: Types.ObjectId): string => {
    if (!config.JWT_REFRESH_SECRET) {
        throw new Error("JWT_REFRESH_SECRET is not defined in the environment variables");
    }

    return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, { expiresIn: config.REFRESH_TOKEN_EXPIRY, subject: "refreshToken " });
};