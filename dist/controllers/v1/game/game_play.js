"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("../../../lib/winston");
const game_1 = __importDefault(require("../../../models/game"));
const user_1 = __importDefault(require("../../../models/user"));
const create_history_1 = __importDefault(require("../history/create_history"));
const gamePlay = async (req, res) => {
    try {
        const userId = req.userId;
        const { generatedNumber, newBalance, result } = req.body;
        const newGame = await game_1.default.create({
            userId,
            generatedNumber,
            newBalance,
            result
        });
        if (newGame && userId) {
            const history = {
                userId,
                gameId: newGame._id,
                generatedNumber,
                result,
                newBalance,
                balanceChange: newGame.result === "win" ? +50 : -35,
                date: new Date()
            };
            await (0, create_history_1.default)(history);
            const user = await user_1.default.findById(userId);
            if (user) {
                user.balance = newBalance;
                await user.save();
            }
        }
        res.status(201).json({
            code: "GameCreated",
            message: "Game created successfully",
            game: newGame
        });
        winston_1.logger.info('Game created successfully', { newGame });
    }
    catch (error) {
        if (!res.headersSent) {
            res.status(500).json({
                code: "ServerError",
                message: "Internal Server Error",
                error: error
            });
        }
        winston_1.logger.error('Error while creating game', error);
    }
};
exports.default = gamePlay;
