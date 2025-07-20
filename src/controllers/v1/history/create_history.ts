import { Request, Response } from "express";
import { logger } from "@/lib/winston";
import type { IHistory } from "@/models/history";
import History from "@/models/history";

/**
 * @function createHistory
 * @description Controller to create a new game history
 * 
 * @param {Request} req - Express request object, expects userId to be set by authenticate middleware
 * @param {Response} res - Express response object used to send game history details
 * 
 * @returns {void}
 * 
 */

const createHistory = async (history: IHistory): Promise<void> => {

    try {
        const newHistory = await History.create(
            history
        );

        logger.info('History created successfully', { newHistory });
    } catch (error) {

        logger.error(`Error creating history: ${error}`);
    }
}

export default createHistory