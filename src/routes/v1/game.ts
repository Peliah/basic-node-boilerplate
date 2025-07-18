import { Router } from "express";
import { body } from "express-validator";
import authenticate from "@/middleware/authenticate";
import authorize from "@/middleware/authorize";
import validationError from "@/middleware/validationError";
import Game from "@/models/game";
import gamePlay from "@/controllers/v1/game/game_play";

const router = Router();

router.post('/play',
    authenticate,
    authorize(['admin', 'user']),
    body('userId').notEmpty().isString().withMessage('User ID must be a string'),
    body('generatedNumber').notEmpty().isInt().withMessage(''),
    body('newBalance').notEmpty().isInt().withMessage('New balance must be a number'),
    body('result').notEmpty().isIn(['win', 'lose']).withMessage('Result must be either "win" or "lose"'),
    validationError,
    gamePlay,
);
export default router;