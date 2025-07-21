"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("../../../lib/winston");
const history_1 = __importDefault(require("../../../models/history"));
const config_1 = __importDefault(require("../../../config"));
const getAllHistory = async (req, res) => {
    const userId = req.userId;
    try {
        const limit = parseInt(req.query.limit) ?? config_1.default.defaultResLimit;
        const offset = parseInt(req.query.offset) ?? config_1.default.defaultResOffset;
        const total = await history_1.default.countDocuments();
        const history = await history_1.default.find({})
            .select('-__v')
            .limit(limit)
            .skip(offset)
            .lean()
            .exec();
        res.status(200).json({
            total,
            limit,
            offset,
            history
        });
        winston_1.logger.info('Game history fetched successfully', { history });
    }
    catch (error) {
        res.status(500).json({
            code: "ServerError",
            message: "Internal Server Error",
            error: error
        });
        winston_1.logger.error('Error while fetching game history', error);
    }
};
exports.default = getAllHistory;
