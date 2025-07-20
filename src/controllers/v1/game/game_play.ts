import { Request, Response } from "express";
import { logger } from "@/lib/winston";
import Game from "@/models/game";
import type { IGame } from "@/models/game";
import User from "@/models/user";
import createHistory from "../history/create_history";
import type { IHistory } from "@/models/history";

type GameData = Pick<IGame, 'generatedNumber' | 'newBalance' | 'result'>;
/**
 * @function gamePlay
 * @description Controller to handle game play actions
 * 
 * @param {Request} req - Express request object, expects userId to be set by authenticate middleware
 * @param {Response} res - Express response object used to send game results
 * 
 * @returns {void}
 */
const gamePlay = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { generatedNumber, newBalance, result } = req.body as GameData;

        const newGame = await Game.create({
            userId,
            generatedNumber,
            newBalance,
            result
        });

        if (newGame && userId) {
            const history: IHistory = {
                userId,
                gameId: newGame._id,
                generatedNumber,
                result,
                newBalance,
                balanceChange: newGame.result === "win" ? +50 : -35,
                date: new Date()
            };

            await createHistory(history);

            // update balance of user
            const user = await User.findById(userId);
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
        logger.info('Game created successfully', { newGame });

    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({
                code: "ServerError",
                message: "Internal Server Error",
                error: error
            });
        }
        logger.error('Error while creating game', error);
    }
};

export default gamePlay;