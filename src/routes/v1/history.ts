import { Router } from "express";
import { query, body } from "express-validator";
import authenticate from "@/middleware/authenticate";
import authorize from "@/middleware/authorize";
import validationError from "@/middleware/validationError";
import History from "@/models/history";
import getAllHistory from "@/controllers/v1/history/get_all_history";
import getUserHistory from "@/controllers/v1/history/get_user_history";

const router = Router();

router.get('/',
    authenticate,
    authorize(['admin', 'user']),
    getUserHistory
);

router.get('/all',
    authenticate,
    authorize(['admin']),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be a positive integer'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a positive integer'),
    validationError,
    getAllHistory
);

export default router;

