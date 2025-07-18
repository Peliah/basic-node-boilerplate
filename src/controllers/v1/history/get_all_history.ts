import { Request, Response } from "express";
import { logger } from "@/lib/winston";
import History from "@/models/history";
import config from "@/config";
/**
 * @function getAllHistory
 * @description Controller to retrieve all game history in the system
 * 
 * @param {Request} req - Express request object, expects userId to be set by authenticate middleware
 * @param {Response} res - Express response object used to send game history details
 * 
 * @returns {void}
 */
const getAllHistory = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    try {
        const limit = parseInt(req.query.limit as string) ?? config.defaultResLimit;
        const offset = parseInt(req.query.offset as string) ?? config.defaultResOffset;
        const total = await History.countDocuments();

        const history = await History.find({})
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
        logger.info('Game history fetched successfully', { history });
    } catch (error) {
        res.status(500).json({
            code: "ServerError",
            message: "Internal Server Error",
            error: error
        });
        logger.error('Error while fetching game history', error);
    }
}
export default getAllHistory;