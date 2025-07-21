"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("../../../lib/winston");
const history_1 = __importDefault(require("../../../models/history"));
const config_1 = __importDefault(require("../../../config"));
const getUserHistory = async (req, res) => {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) ?? config_1.default.defaultResLimit;
    const offset = parseInt(req.query.offset) ?? config_1.default.defaultResOffset;
    const total = await history_1.default.countDocuments();
    try {
        if (!userId) {
            res.status(401).json({
                code: "AuthenticationError",
                message: "Access denied, no user ID found"
            });
            return;
        }
        const history = await history_1.default.find({ userId }).select('-__v')
            .limit(limit)
            .skip(offset)
            .lean()
            .exec();
        if (!history || history.length === 0) {
            res.status(404).json({
                code: "HistoryNotFound",
                message: "No history found for this user"
            });
            return;
        }
        res.status(200).json({ history });
        winston_1.logger.info('User game history fetched successfully', { total, limit, offset, history });
    }
    catch (error) {
        res.status(500).json({
            code: "ServerError",
            message: "Internal Server Error",
            error: error
        });
        winston_1.logger.error('Error while fetching user history', error);
    }
};
exports.default = getUserHistory;
