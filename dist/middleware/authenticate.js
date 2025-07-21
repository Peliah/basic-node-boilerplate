"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const jwt_1 = require("../lib/jwt");
const winston_1 = require("../lib/winston");
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({
            code: "AuthenticationError",
            message: "Access denied, no token provided"
        });
        return;
    }
    const [_, token] = authHeader.split(' ');
    try {
        const jwtPayload = (0, jwt_1.verifyAccessToken)(token);
        req.userId = jwtPayload.userId;
        return next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            res.status(401).json({
                code: "AuthenticationError",
                message: "Access denied, expired token"
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            res.status(401).json({
                code: "AuthenticationError",
                message: "Access denied, invalid token"
            });
            return;
        }
        res.status(500).json({
            code: "ServerError",
            message: "Internal Server Error",
            error: error
        });
        winston_1.logger.error('Error during authentication ', error);
    }
};
exports.default = authenticate;
