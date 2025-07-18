import { Request, Response } from "express";
import { logger } from "@/lib/winston";
import Game from "@/models/game";
import type { IGame } from "@/models/game";
import User from "@/models/user";
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

        res.status(201).json({
            code: "GameCreated",
            message: "Game created successfully",
            game: newGame
        });
        logger.info('Game created successfully', { newGame });

    } catch (error) {
        res.status(500).json({
            code: "ServerError",
            message: "Internal Server Error",
            error: error
        });
        logger.error('Error while fetching users', error);
    }
}
export default gamePlay;