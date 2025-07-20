import { Request, Response } from "express";
import { logger } from "@/lib/winston";
import History from "@/models/history";
import config from "@/config";

/**
 * @function getUserHistory
 * @description Controller to retrieve the history of a specific user
 * 
 * @param {Request} req - Express request object, expects userId to be set by authenticate middleware
 * @param {Response} res - Express response object used to send user history
 * 
 * @returns {void}
 */
const getUserHistory = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) ?? config.defaultResLimit;
    const offset = parseInt(req.query.offset as string) ?? config.defaultResOffset;
    const total = await History.countDocuments();
    try {
        if (!userId) {
            res.status(401).json({
                code: "AuthenticationError",
                message: "Access denied, no user ID found"
            });
            return;
        }

        const history = await History.find({ userId }).select('-__v')
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
        logger.info('User game history fetched successfully', { total, limit, offset, history });
    } catch (error) {
        res.status(500).json({
            code: "ServerError",
            message: "Internal Server Error",
            error: error
        });
        logger.error('Error while fetching user history', error);
    }
}
export default getUserHistory;