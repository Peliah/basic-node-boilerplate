import { Router } from "express";
import { query, body } from "express-validator";
import authenticate from "@/middleware/authenticate";
import authorize from "@/middleware/authorize";
import validationError from "@/middleware/validationError";
import History from "@/models/history";
import getAllHistory from "@/controllers/v1/history/get_all_history";
import getUserHistory from "@/controllers/v1/history/get_user_history";

const router = Router();

/** 
 * @openapi
 * /api/v1/history:
 *   get:
 *     summary: Get user history
 *     tags: [History]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     gameId:
 *                       type: string
 *                     generatedNumber:
 *                       type: number
 *                     result:
 *                       type: string
 *                     newBalance:
 *                       type: number
 *                     balanceChange:
 *                       type: number
 *                     date:
 *                       type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/',
    authenticate,
    authorize(['admin', 'user']),
    getUserHistory
);

/** 
 * @openapi
 * /api/v1/history/all:
 *   get:
 *     summary: Get all history records (admin only)
 *     tags: [History]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of history records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset for pagination
 *     responses:
 *       200:
 *         description: Successfully retrieved all history records
 *       401:
 *         description: Unauthorized
 */
router.get('/all',
    authenticate,
    authorize(['admin']),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be a positive integer'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a positive integer'),
    validationError,
    getAllHistory
);

export default router;

